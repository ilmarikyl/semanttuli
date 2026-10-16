import { MongoServerError } from 'mongodb';
import { currentLanguage } from '$lib/config/language';
import { getLeaderboardCollection } from '$lib/services/dbService';
import { MAX_HINTS } from '$lib/utils/constants';
import { DAILY_RESULT_CAP, expiresAtForDay, getUtc3UnixDay } from './constants';
import { parseResultName } from './name';
import { assignPlaces } from './ranking';
import type { AddResultInput, AddResultResponse, LeaderboardDoc, LeaderboardRow } from './types';

let indexesReady: Promise<void> | null = null;

async function collection() {
	const col = await getLeaderboardCollection();
	if (!indexesReady) {
		indexesReady = Promise.all([
			col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
			col.createIndex({ dayId: 1 }),
			col.createIndex(
				{ dayId: 1, nameKey: 1 },
				{ unique: true, partialFilterExpression: { nameKey: { $exists: true } } },
			),
		]).then(() => undefined);
		indexesReady.catch(() => {
			indexesReady = null;
		});
	}
	await indexesReady;
	return col;
}

async function retainRecentDays(today: number) {
	const yesterday = today - 1;
	const col = await collection();
	await col.deleteMany({ dayId: { $lt: yesterday } });
	await col.updateMany({ dayId: today }, { $set: { expiresAt: expiresAtForDay(today) } });
	await col.updateMany({ dayId: yesterday }, { $set: { expiresAt: expiresAtForDay(yesterday) } });
}

function isValidResult(input: AddResultInput): boolean {
	if (input.outcome !== 'won' && input.outcome !== 'gaveUp') return false;
	if (!Number.isInteger(input.guessCount) || input.guessCount < 1 || input.guessCount > 10_000) return false;
	if (!Number.isInteger(input.hintCount) || input.hintCount < 0 || input.hintCount > MAX_HINTS) return false;
	if (!Number.isInteger(input.bestUnhintedRank) || input.bestUnhintedRank < 0 || input.bestUnhintedRank > 1000) {
		return false;
	}
	if (!Number.isFinite(input.bestUnhintedSimilarity)) return false;
	if (!Number.isInteger(input.gameNumber)) return false;
	return true;
}

function toRow(doc: {
	id: string;
	place: number;
	name: string | null;
	outcome: LeaderboardDoc['outcome'];
	guessCount: number;
	hintCount: number;
	bestUnhintedRank: number;
	bestUnhintedSimilarity: number;
}): LeaderboardRow {
	return {
		id: doc.id,
		place: doc.place,
		name: doc.name,
		outcome: doc.outcome,
		guessCount: doc.guessCount,
		hintCount: doc.hintCount,
		bestUnhintedRank: doc.bestUnhintedRank,
		bestUnhintedSimilarity: doc.bestUnhintedSimilarity,
	};
}

async function rowsForDay(dayId: number): Promise<LeaderboardRow[]> {
	const col = await collection();
	const docs = await col.find({ dayId }).toArray();
	return assignPlaces(
		docs.map((doc) => ({
			id: doc._id.toString(),
			outcome: doc.outcome,
			guessCount: doc.guessCount,
			hintCount: doc.hintCount,
			bestUnhintedRank: doc.bestUnhintedRank,
			bestUnhintedSimilarity: doc.bestUnhintedSimilarity,
			submittedAt: doc.submittedAt.getTime(),
			name: doc.name,
		})),
	).map(toRow);
}

export async function listBoards(): Promise<{ today: LeaderboardRow[]; yesterday: LeaderboardRow[] }> {
	const today = getUtc3UnixDay();
	await retainRecentDays(today);
	const [todayRows, yesterdayRows] = await Promise.all([rowsForDay(today), rowsForDay(today - 1)]);
	return { today: todayRows, yesterday: yesterdayRows };
}

export async function listTodayResults(): Promise<LeaderboardRow[]> {
	return (await listBoards()).today;
}

export async function addResult(input: AddResultInput): Promise<AddResultResponse> {
	if (!isValidResult(input)) {
		return { ok: false, error: 'invalid-result' };
	}

	const parsed = parseResultName(input.name ?? '', currentLanguage);
	if (parsed.kind === 'invalid') return { ok: false, error: 'invalid-name' };
	if (parsed.kind === 'reserved') return { ok: false, error: 'reserved-name' };

	const dayId = getUtc3UnixDay();
	await retainRecentDays(dayId);
	const col = await collection();

	const count = await col.countDocuments({ dayId });
	if (count >= DAILY_RESULT_CAP) {
		return { ok: false, error: 'cap-reached' };
	}

	const submittedAt = new Date();
	const doc: LeaderboardDoc = {
		dayId,
		gameNumber: input.gameNumber,
		name: parsed.kind === 'named' ? parsed.displayName : null,
		outcome: input.outcome,
		guessCount: input.guessCount,
		hintCount: input.hintCount,
		bestUnhintedRank: input.bestUnhintedRank,
		bestUnhintedSimilarity: input.bestUnhintedSimilarity,
		submittedAt,
		expiresAt: expiresAtForDay(dayId),
	};
	if (parsed.kind === 'named') {
		doc.nameKey = parsed.nameKey;
	}

	try {
		const inserted = await col.insertOne(doc);
		const after = await col.countDocuments({ dayId });
		if (after > DAILY_RESULT_CAP) {
			await col.deleteOne({ _id: inserted.insertedId });
			return { ok: false, error: 'cap-reached' };
		}
		const rows = await rowsForDay(dayId);
		const row = rows.find((r) => r.id === inserted.insertedId.toString());
		return {
			ok: true,
			id: inserted.insertedId.toString(),
			place: row?.place ?? rows.length,
			name: doc.name,
		};
	} catch (error) {
		if (error instanceof MongoServerError && error.code === 11000) {
			return { ok: false, error: 'name-taken' };
		}
		throw error;
	}
}
