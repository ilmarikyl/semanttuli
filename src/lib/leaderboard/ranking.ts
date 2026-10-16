import type { Guess } from '$lib/types';
import { determineHintRank } from '$lib/utils/utils';

export type SortableResult = {
	outcome: 'won' | 'gaveUp';
	guessCount: number;
	hintCount: number;
	bestUnhintedRank: number;
	bestUnhintedSimilarity: number;
	submittedAt: number;
};

export type PlacedResult<T extends SortableResult> = T & { place: number };

export function bestUnhintedCloseness(guesses: Guess[]): { rank: number; similarity: number } {
	const typed = guesses.filter((guess) => !guess.wasHinted);
	if (typed.length === 0) {
		return { rank: 0, similarity: 0 };
	}

	return typed.reduce(
		(best, guess) => {
			if (guess.rank > best.rank) {
				return { rank: guess.rank, similarity: guess.similarityScore };
			}
			if (guess.rank === best.rank && guess.similarityScore > best.similarity) {
				return { rank: guess.rank, similarity: guess.similarityScore };
			}
			return best;
		},
		{ rank: typed[0].rank, similarity: typed[0].similarityScore },
	);
}

/** Extra guesses a hint costs beyond the one it already occupies. A +1 hint costs nothing more. */
function extraGuessesForHint(startRank: number, nextRank: number): number {
	if (startRank < 1) return 4;
	const jump = nextRank - startRank;
	if (jump >= 100) return 4;
	if (jump >= 50) return 3;
	if (jump >= 35) return 2;
	if (jump >= 10) return 1;
	return 0;
}

export function effectiveGuesses(
	result: Pick<SortableResult, 'guessCount' | 'hintCount' | 'bestUnhintedRank'>,
): number {
	let rank = result.bestUnhintedRank;
	let extra = 0;
	for (let i = 0; i < result.hintCount; i++) {
		const next = determineHintRank(rank);
		extra += extraGuessesForHint(rank, next);
		rank = next;
	}
	return result.guessCount + extra;
}

export function compareResults(a: SortableResult, b: SortableResult): number {
	if (a.outcome !== b.outcome) {
		return a.outcome === 'won' ? -1 : 1;
	}

	if (a.outcome === 'won') {
		const effort = effectiveGuesses(a) - effectiveGuesses(b);
		if (effort !== 0) return effort;
		if (a.hintCount !== b.hintCount) return a.hintCount - b.hintCount;
		return a.submittedAt - b.submittedAt;
	}

	if (a.bestUnhintedRank !== b.bestUnhintedRank) {
		return b.bestUnhintedRank - a.bestUnhintedRank;
	}
	if (a.bestUnhintedSimilarity !== b.bestUnhintedSimilarity) {
		return b.bestUnhintedSimilarity - a.bestUnhintedSimilarity;
	}
	return a.submittedAt - b.submittedAt;
}

export function assignPlaces<T extends SortableResult>(results: T[]): PlacedResult<T>[] {
	return [...results].sort(compareResults).map((row, index) => ({ ...row, place: index + 1 }));
}
