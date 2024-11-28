// src/gameState.js
import { writable, type Writable } from 'svelte/store';

import type { Guess, GameState, SimilarityData, WinState, GameStats } from '$lib/types';
import { updateStatsStore } from '$stores/stats';
import { createInitialStats } from '$lib/utils/stats';
import { saveIsGameInfoCollapsed } from '$lib/utils/localStorage';

export const gameState: Writable<GameState> = writable({
	gameNumber: -1,
	guesses: [],
	isGameInfoCollapsed: false,
	latestGuess: null,
	secretWordVec: [],
	similarityData: { top: null, top10: null, top1000: null },
	sortBy: 'similarityScore',
	sortOrder: 'desc',
	yesterdayNearby10: [],
	yesterdayWord: '',
	winState: 'playing',
});

export function updateGuesses(guessData: {
	guessNumber: number;
	word: string;
	similarityScore: number;
	rank: number;
	wasHinted: boolean;
	isNew: boolean;
	addToGuesses?: boolean;
}): void {
	const newGuess: Guess = {
		guessNumber: guessData.guessNumber,
		word: guessData.word,
		similarityScore: guessData.similarityScore,
		rank: guessData.rank,
		wasHinted: guessData.wasHinted,
		isNew: guessData.isNew,
	};

	gameState.update((state) => {
		let updatedState = { ...state, latestGuess: newGuess };

		if (guessData.addToGuesses) {
			const guesses = [...state.guesses, newGuess].sort((a, b) => b.similarityScore - a.similarityScore);
			updatedState = {
				...updatedState,
				guesses,
				sortBy: 'similarityScore',
				sortOrder: 'desc',
			};
		}

		return updatedState;
	});
}

export function updateWinState(winState: WinState) {
	gameState.update((state) => ({ ...state, winState }));
}

export function updateSimilarityData(data: SimilarityData) {
	gameState.update((state) => ({ ...state, similarityData: data }));
}

export function updateSecretWordVec(vec: number[]) {
	gameState.update((state) => ({ ...state, secretWordVec: vec }));
}

export function updateYesterdayData(nearby10: string[], word: string) {
	gameState.update((state) => {
		const newState = {
			...state,
			yesterdayNearby10: nearby10,
			yesterdayWord: word,
		};
		return newState;
	});
}

export function toggleGameInfoCollapsed(collapseState?: boolean) {
	if (collapseState !== undefined) {
		gameState.update((state) => ({
			...state,
			isGameInfoCollapsed: collapseState,
		}));

		saveIsGameInfoCollapsed(collapseState);
	}
}

export function setSortOrder(column: string): void {
	gameState.update((state) => {
		const { guesses } = state;
		let { sortBy, sortOrder } = state;

		if (sortBy === column) {
			sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		} else {
			sortBy = column;

			if (column === 'word') {
				sortOrder = 'asc';
			} else {
				sortOrder = 'desc';
			}
		}

		const sortedGuesses = sortGuesses(guesses, sortBy, sortOrder);
		return { ...state, sortBy, sortOrder, guesses: sortedGuesses };
	});
}

function sortGuesses(guesses: Guess[], sortBy: string, sortOrder: 'asc' | 'desc'): Guess[] {
	return guesses.sort((a, b) => {
		let result: number;

		if (sortBy === 'guessNumber') {
			result = a.guessNumber - b.guessNumber;
		} else if (sortBy === 'word') {
			result = a.word.localeCompare(b.word);
		} else if (sortBy === 'similarityScore') {
			result = a.similarityScore - b.similarityScore;
		} else {
			result = 0; // Default case if sortBy does not match any criteria
		}

		return sortOrder === 'asc' ? result : -result;
	});
}

// Function to load game state from localStorage
export const loadGameState = (actualGameNumber: number) => {
	if (typeof window !== 'undefined') {
		// ----- GAME STATE -----
		const savedGuesses = localStorage.getItem('guesses');
		const savedWinState = localStorage.getItem('winState');
		const savedLatestGuess = localStorage.getItem('latestGuess');
		const savedIsGameInfoCollapsed = localStorage.getItem('isGameInfoCollapsed') === 'true';

		let parsedGuesses: Guess[] | undefined;
		let parsedLatestGuess: Guess | undefined;
		let parsedWinState: WinState | undefined;

		if (savedGuesses) parsedGuesses = JSON.parse(savedGuesses) as Guess[];
		if (savedLatestGuess) parsedLatestGuess = JSON.parse(savedLatestGuess) as Guess;

		if (savedWinState && ['won', 'gaveUp', 'playing'].includes(savedWinState)) {
			parsedWinState = savedWinState as WinState;
		}

		const savedGameNumber = localStorage.getItem('gameNumber');
		const savedGameNumberInt = Number(savedGameNumber);

		// Check if gameNumber is missing or doesn't match newestGameNumber
		if (!savedGameNumber || savedGameNumberInt !== actualGameNumber) {
			// Clear relevant items from localStorage
			localStorage.removeItem('guesses');
			localStorage.removeItem('winState');
			localStorage.removeItem('latestGuess');

			// Set gameNumber to newestGameNumber
			localStorage.setItem('gameNumber', actualGameNumber.toString());
			localStorage.setItem('statsRecorded', 'false');

			// Update gameState with default values
			gameState.update((state) => ({
				...state,
				gameNumber: actualGameNumber,
				guesses: [],
				latestGuess: null,
				winState: 'playing',
			}));
		} else {
			// If gameNumber matches, proceed with saving the loaded values to the store
			gameState.update((state) => ({
				...state,
				gameNumber: savedGameNumberInt,
				guesses: parsedGuesses || state.guesses,
				latestGuess: parsedLatestGuess || state.latestGuess,
				winState: parsedWinState || state.winState,
				isGameInfoCollapsed: savedIsGameInfoCollapsed,
			}));
		}

		// ----- STATS -----

		// load stats from localStorage
		const savedStats = localStorage.getItem('stats');
		let parsedStats: GameStats | undefined;

		if (savedStats) {
			try {
				parsedStats = JSON.parse(savedStats) as GameStats;

				// Check validity
				if (parsedStats.abandons == null) parsedStats.abandons = 0;
				if (parsedStats.giveUps == null) parsedStats.giveUps = 0;
				if (parsedStats.wins == null) parsedStats.wins = 0;

				const requiredTotalPlayDays = parsedStats.abandons + parsedStats.giveUps + parsedStats.wins;
				if (parsedStats.totalPlayDays == null || parsedStats.totalPlayDays < requiredTotalPlayDays) {
					parsedStats.totalPlayDays = requiredTotalPlayDays;
				}
			} catch (e) {
				console.error('Error parsing saved stats:', e);
			}
		}
		// if stats are missing, set them to default values
		if (!parsedStats) {
			parsedStats = createInitialStats(actualGameNumber);
		} else {
			// Otherwise, check whether the 'abandons' field needs to be updated
			// That is, if the actualGameNumber is something else than the savedGameNumber value AND the winState is 'playing'

			if (actualGameNumber !== savedGameNumberInt) {
				parsedStats.totalPlayDays++;
				if (parsedWinState === 'playing') {
					parsedStats.abandons++;
					parsedStats.winStreak = 0;
				}
			}
		}

		updateStatsStore(parsedStats);
	}
};
