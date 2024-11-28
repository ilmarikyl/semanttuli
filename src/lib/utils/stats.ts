import type { GameStats } from '$lib/types';

export function createInitialStats(gameNumber: number): GameStats {
	return {
		abandons: 0,
		firstPlay: gameNumber,
		giveUps: 0,
		lastWon: gameNumber - 1,
		lastPlay: gameNumber,
		playStreak: 0,
		totalGuesses: 0,
		totalHints: 0,
		totalPlayDays: 1, // Start with 1 as this is the first play
		wins: 0,
		winStreak: 0,
	};
}
