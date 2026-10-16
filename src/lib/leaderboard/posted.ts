import type { ResultOutcome } from './types';

const storageKey = (gameNumber: number) => `leaderboardPosted:${gameNumber}`;
const storagePrefix = 'leaderboardPosted:';

export type PostedResult = {
	id: string;
	name: string | null;
	outcome?: ResultOutcome;
	dayId?: number;
};

export function parsePostedResult(raw: string): PostedResult | null {
	try {
		const parsed = JSON.parse(raw) as PostedResult;
		if (!parsed || typeof parsed.id !== 'string') return null;
		if (parsed.name != null && typeof parsed.name !== 'string') return null;
		return {
			id: parsed.id,
			name: parsed.name ?? null,
			outcome: parsed.outcome === 'won' || parsed.outcome === 'gaveUp' ? parsed.outcome : undefined,
			dayId: typeof parsed.dayId === 'number' ? parsed.dayId : undefined,
		};
	} catch {
		return null;
	}
}

export function getPostedResult(gameNumber: number): PostedResult | null {
	if (typeof window === 'undefined') return null;
	const raw = localStorage.getItem(storageKey(gameNumber));
	if (!raw) return null;
	return parsePostedResult(raw);
}

export function savePostedResult(gameNumber: number, posted: PostedResult): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(storageKey(gameNumber), JSON.stringify(posted));
}

export function findPostedForDay(
	entries: Iterable<[string, string]>,
	dayId: number,
	yesterdayGameNumber: number,
): PostedResult | null {
	let legacy: PostedResult | null = null;
	for (const [key, raw] of entries) {
		if (!key.startsWith(storagePrefix)) continue;
		const parsed = parsePostedResult(raw);
		if (!parsed) continue;
		if (parsed.dayId === dayId) return parsed;
		const keyGame = Number(key.slice(storagePrefix.length));
		if (parsed.dayId == null && keyGame === yesterdayGameNumber) legacy = parsed;
	}
	return legacy;
}
