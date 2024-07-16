import type { Guess, WinState } from '$lib/types';
import { getGameNumber } from './utils';
import { updateStat } from '$stores/stats';

export function getLocalStorage(): Storage | null {
	if (typeof window !== 'undefined') {
		return window.localStorage;
	}
	return null;
}

export function saveIsGameInfoCollapsed(isCollapsed: boolean): void {
	const storage = getLocalStorage();
	if (storage) {
		storage.setItem('isGameInfoCollapsed', isCollapsed.toString());
	}
}

export function saveGame(
	winState: WinState,
	guesses: Guess[],
	latestGuess: Guess | undefined,
	secretWord: string
) {
	const localStorage = getLocalStorage();
	if (!localStorage) return;

	const actualGameNumber = getGameNumber();
	const savedGameNumber = localStorage.getItem('gameNumber');

	if (localStorage.getItem('statsRecorded') === 'true') {
		return;
	}

	// If a previous game is still open in a tab, don't save the game state
	// to make sure not to mess up the stats of the most recent game
	if (savedGameNumber != null && parseInt(savedGameNumber, 10) != actualGameNumber) {
		return;
	}

	localStorage.setItem('winState', winState);

	const saveGuessesAndLatestGuess = () => {
		const cleanedGuesses = guesses.map(({ isNew, ...rest }) => rest);
		localStorage.setItem('guesses', JSON.stringify(cleanedGuesses));

		if (latestGuess) {
			localStorage.setItem('latestGuess', JSON.stringify(latestGuess));
		}
	};

	if (winState === 'playing') {
		saveGuessesAndLatestGuess();
	} else {
		localStorage.setItem('statsRecorded', 'true');

		// Save latestGuess and add to guesses if winState is 'won' and it is the winning guess
		if (winState === 'won' && latestGuess && latestGuess.word === secretWord) {
			saveGuessesAndLatestGuess();
			updateStat('wins', 'increment', 1);
			updateStat('winStreak', 'increment', 1);
			updateStat('lastWon', actualGameNumber);
		}

		if (winState === 'gaveUp') {
			updateStat('giveUps', 'increment', 1);
			updateStat('winStreak', 0);
		}
	}
}
