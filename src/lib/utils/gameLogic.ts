// import { gameState } from '$stores/gameState';

import {
	gameState,
	updateGuesses,
	updateWinState,
	updateSimilarityData,
	updateSecretWordVec,
	updateYesterdayData,
} from '$stores/gameState';
import { get } from 'svelte/store';
import { determineHintRank, getSecretWord, decodeB64word } from '$lib/utils/utils';
import { updateStat } from '$stores/stats';
import { getCosSim } from './math';
import { _ } from 'svelte-i18n';

export async function fetchInitialGameData(secretWord: string, gameNumber: number) {
	try {
		// Fetch top similarities
		const similaritiesResponse = await fetch(`/api/top_similarities/${secretWord}`);
		if (similaritiesResponse.ok) {
			const { top, top10, top1000 } = await similaritiesResponse.json();
			updateSimilarityData({
				top: top * 100,
				top10: top10 * 100,
				top1000: top1000 * 100,
			});
		}

		// Fetch secret word vector
		const secretVecResponse = await fetch(`/api/getSecret/${secretWord}`);
		if (secretVecResponse.ok) {
			const secretWordVec = await secretVecResponse.json();
			updateSecretWordVec(secretWordVec);
		}

		// Fetch yesterday's nearby words
		const yesterdayGameNumber = gameNumber - 1;
		const yesterdaySecretWordEncoded = getSecretWord(yesterdayGameNumber);
		const yesterdayNearbyResponse = await fetch(`/api/nearby_10/${yesterdaySecretWordEncoded}`);
		if (yesterdayNearbyResponse.ok) {
			const yesterdayNearby10 = await yesterdayNearbyResponse.json();
			const yesterdaySecretWord = decodeB64word(yesterdaySecretWordEncoded);

			updateYesterdayData(yesterdayNearby10, yesterdaySecretWord);
		}
	} catch (error) {
		console.error('Error fetching initial game data:', error);
	}
}

export async function getHintWord(secretWord: string) {
	const state = get(gameState);
	const highestRank =
		Math.max(...state.guesses.map((guess) => guess.rank).filter((rank) => typeof rank === 'number')) || 0;
	const hintRank = determineHintRank(highestRank);
	const numOfGuesses = state.guesses.length;

	try {
		const response = await fetch(`/api/hint/${secretWord}/${hintRank}`);
		if (response.ok) {
			const hint = await response.json();
			const similarityScore = hint.similarity * 100;

			const newGuess = {
				guessNumber: numOfGuesses + 1,
				word: hint.neighbor,
				similarityScore,
				rank: hintRank,
				wasHinted: true,
			};

			updateGuesses({
				guessNumber: numOfGuesses + 1,
				word: hint.neighbor,
				similarityScore,
				rank: hintRank,
				wasHinted: true,
				isNew: true,
				addToGuesses: true,
			});
			updateStat('totalHints', 'increment', 1);
			updateStat('totalGuesses', 'increment', 1);

			return newGuess;
		} else {
			console.error('Failed to fetch hint. Status:', response.status);
			return null;
		}
	} catch (error) {
		console.error('Error fetching hint:', error);
		return null;
	}
}

export async function processGuess(guess: string, secretWord: string, secretWordVec: number[], winState: string) {
	try {
		const url = `/api/model/${secretWord}/${guess}`;
		const response = await fetch(url);

		if (!response.ok) {
			if (response.status === 404) {
				return { error: get(_)('errors.wordNotRecognized', { values: { word: guess } }) };
			} else {
				return { error: get(_)('errors.unexpectedError') };
			}
		}
		const data = await response.json();
		const guessNumber = get(gameState).guesses.length + 1;

		let similarityScore: number;
		let rank: number;

		if (data.percentile) {
			similarityScore = data.similarity * 100;
			rank = data.percentile;
		} else {
			const guessVec = data.vec;
			similarityScore = getCosSim(guessVec, secretWordVec) * 100;
			rank = 0;
		}

		const isCorrectGuess = guess.toLowerCase() === decodeB64word(secretWord);

		updateGuesses({
			guessNumber,
			word: guess,
			similarityScore,
			rank,
			wasHinted: false,
			isNew: true,
			addToGuesses: winState === 'playing' || isCorrectGuess,
		});

		if (winState === 'playing') {
			updateStat('totalGuesses', 'increment', 1);
		}

		if (isCorrectGuess && winState === 'playing') {
			updateWinState('won');
		}

		return { success: true, isCorrectGuess };
	} catch (error) {
		console.error('Fetch error:', error);
		return { error: get(_)('errors.fetchError') };
	}
}
