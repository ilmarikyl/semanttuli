import { describe, expect, it } from 'vitest';
import type { Guess } from '$lib/types';
import { assignPlaces, bestUnhintedCloseness, compareResults, type SortableResult } from './ranking';

function guess(partial: Partial<Guess> & Pick<Guess, 'rank' | 'similarityScore'>): Guess {
	return {
		guessNumber: 1,
		word: 'x',
		wasHinted: false,
		...partial,
	};
}

function result(partial: Partial<SortableResult> & Pick<SortableResult, 'outcome'>): SortableResult {
	return {
		guessCount: 10,
		hintCount: 0,
		bestUnhintedRank: 0,
		bestUnhintedSimilarity: 0,
		submittedAt: 1000,
		...partial,
	};
}

describe('bestUnhintedCloseness', () => {
	it('ignores Hints when finding the closest Guess', () => {
		expect(
			bestUnhintedCloseness([
				guess({ rank: 200, similarityScore: 40 }),
				guess({ rank: 980, similarityScore: 90, wasHinted: true }),
			]),
		).toEqual({ rank: 200, similarity: 40 });
	});

	it('uses similarity when typed Guesses share a Rank', () => {
		expect(
			bestUnhintedCloseness([guess({ rank: 0, similarityScore: 12 }), guess({ rank: 0, similarityScore: 30 })]),
		).toEqual({ rank: 0, similarity: 30 });
	});

	it('returns no closeness when every Guess was a Hint', () => {
		expect(bestUnhintedCloseness([guess({ rank: 990, similarityScore: 95, wasHinted: true })])).toEqual({
			rank: 0,
			similarity: 0,
		});
	});
});

describe('compareResults', () => {
	it('places a Win above a Give-up', () => {
		const win = result({ outcome: 'won', guessCount: 80, hintCount: 15 });
		const giveUp = result({ outcome: 'gaveUp', guessCount: 3, bestUnhintedRank: 999 });
		expect(compareResults(win, giveUp)).toBeLessThan(0);
		expect(compareResults(giveUp, win)).toBeGreaterThan(0);
	});

	it('ranks Wins by fewer guesses, then fewer hints, then earlier Result', () => {
		expect(
			compareResults(
				result({ outcome: 'won', guessCount: 12, hintCount: 2, submittedAt: 2000 }),
				result({ outcome: 'won', guessCount: 20, hintCount: 0, submittedAt: 1000 }),
			),
		).toBeLessThan(0);

		expect(
			compareResults(
				result({ outcome: 'won', guessCount: 12, hintCount: 0, submittedAt: 2000 }),
				result({ outcome: 'won', guessCount: 12, hintCount: 3, submittedAt: 1000 }),
			),
		).toBeLessThan(0);

		expect(
			compareResults(
				result({ outcome: 'won', guessCount: 12, hintCount: 1, submittedAt: 1000 }),
				result({ outcome: 'won', guessCount: 12, hintCount: 1, submittedAt: 2000 }),
			),
		).toBeLessThan(0);
	});

	it('ranks Give-ups by closest typed Guess, then earlier Result', () => {
		expect(
			compareResults(
				result({ outcome: 'gaveUp', bestUnhintedRank: 400, bestUnhintedSimilarity: 20, submittedAt: 2000 }),
				result({ outcome: 'gaveUp', bestUnhintedRank: 100, bestUnhintedSimilarity: 80, submittedAt: 1000 }),
			),
		).toBeLessThan(0);

		expect(
			compareResults(
				result({ outcome: 'gaveUp', bestUnhintedRank: 0, bestUnhintedSimilarity: 40, submittedAt: 2000 }),
				result({ outcome: 'gaveUp', bestUnhintedRank: 0, bestUnhintedSimilarity: 10, submittedAt: 1000 }),
			),
		).toBeLessThan(0);

		expect(
			compareResults(
				result({
					outcome: 'gaveUp',
					bestUnhintedRank: 50,
					bestUnhintedSimilarity: 20,
					submittedAt: 1000,
				}),
				result({
					outcome: 'gaveUp',
					bestUnhintedRank: 50,
					bestUnhintedSimilarity: 20,
					submittedAt: 2000,
				}),
			),
		).toBeLessThan(0);
	});
});

describe('assignPlaces', () => {
	it('assigns unique Places in order, Wins then Give-ups', () => {
		const placed = assignPlaces([
			result({ outcome: 'gaveUp', bestUnhintedRank: 10, submittedAt: 1 }),
			result({ outcome: 'won', guessCount: 40, submittedAt: 3 }),
			result({ outcome: 'won', guessCount: 12, submittedAt: 2 }),
		]);

		expect(placed.map((row) => row.place)).toEqual([1, 2, 3]);
		expect(placed.map((row) => row.outcome)).toEqual(['won', 'won', 'gaveUp']);
		expect(placed.map((row) => row.guessCount)).toEqual([12, 40, 10]);
	});
});
