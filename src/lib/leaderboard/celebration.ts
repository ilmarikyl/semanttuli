import { getUtc3UnixDay } from './constants';
import { findPostedForDay, type PostedResult } from './posted';
import type { LeaderboardRow } from './types';
import { getGameNumberForUtc3Day } from '$lib/utils/utils';

export const CELEBRATION_PLACE_LIMIT = 10;

export type CelebrationRow = {
	place: number;
	name: string | null;
	guessCount: number;
	hintCount: number;
	you: boolean;
};

export type YesterdayCelebration = {
	place: number;
	top: CelebrationRow[];
};

const celebratedKey = (dayId: number) => `leaderboardCelebrated:${dayId}`;

/** Dev-only. `?celebrate` or `?celebrate=1` shows the overlay with sample results. */
export function celebrationPreview(search: string, dev: boolean): YesterdayCelebration | null {
	if (!dev) return null;
	const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
	if (!params.has('celebrate')) return null;
	const raw = Number(params.get('celebrate'));
	const place = Number.isInteger(raw) && raw >= 1 && raw <= CELEBRATION_PLACE_LIMIT ? raw : 3;
	const names = ['Aino', 'Liisa', 'Pekka', 'Sari', 'Jussi', 'Kaisa', 'Olli', 'Noora', 'Eero', 'Hanna'];
	return {
		place,
		top: names.map((name, index) => ({
			place: index + 1,
			name: index + 1 === place ? 'Matti' : name,
			guessCount: 8 + index,
			hintCount: index % 3,
			you: index + 1 === place,
		})),
	};
}

export function decideCelebration(input: {
	posted: PostedResult | null;
	row: Pick<LeaderboardRow, 'id' | 'outcome' | 'place'> | null;
}): 'show' | 'skip' {
	const { posted, row } = input;
	if (!posted || posted.name == null || posted.name.trim() === '') return 'skip';
	if (posted.outcome === 'gaveUp') return 'skip';
	if (!row || row.id !== posted.id) return 'skip';
	if (row.outcome !== 'won') return 'skip';
	if (row.place < 1 || row.place > CELEBRATION_PLACE_LIMIT) return 'skip';
	return 'show';
}

export async function loadYesterdayCelebration(): Promise<YesterdayCelebration | null> {
	if (typeof window === 'undefined') return null;
	const yesterday = getUtc3UnixDay() - 1;
	const key = celebratedKey(yesterday);
	if (localStorage.getItem(key)) return null;

	const posted = findPostedForDay(Object.entries(localStorage), yesterday, getGameNumberForUtc3Day(yesterday));
	if (!posted || posted.name == null || posted.name.trim() === '' || posted.outcome === 'gaveUp') {
		localStorage.setItem(key, 'skip');
		return null;
	}

	try {
		const response = await fetch('/api/leaderboard');
		if (!response.ok) return null;
		const data = (await response.json()) as { yesterday?: LeaderboardRow[] };
		const row = (data.yesterday ?? []).find((entry) => entry.id === posted.id) ?? null;
		const decision = decideCelebration({ posted, row });
		localStorage.setItem(key, decision === 'show' ? 'shown' : 'skip');
		if (decision !== 'show' || !row || row.name == null) return null;
		const top = (data.yesterday ?? [])
			.filter((entry) => entry.outcome === 'won' && entry.place >= 1 && entry.place <= CELEBRATION_PLACE_LIMIT)
			.map((entry) => ({
				place: entry.place,
				name: entry.name,
				guessCount: entry.guessCount,
				hintCount: entry.hintCount,
				you: entry.id === posted.id,
			}));
		return { place: row.place, top };
	} catch {
		return null;
	}
}
