import base64 from 'base-64';
import utf8 from 'utf8';
import { START_DAY } from './constants';
import { secretWordsEncoded } from '$lib/data/secretWords';
import type { Guess, RankThreshold } from '../types';

export function getGameNumber(): number {
	const now = Date.now() + 10800000; // add 10800000 for UTC+3
	const today = Math.floor(now / 86400000);
	const puzzleNumber = (today - START_DAY) % secretWordsEncoded.length;
	return puzzleNumber;
}

export function getSecretWord(puzzleNumber: number): string {
	return secretWordsEncoded[puzzleNumber];
}

export function decodeB64word(b64Secret: string): string {
	const bytes = base64.decode(b64Secret);
	return utf8.decode(bytes);
}

export function determineHintRank(highestRank: number): number {
	const rankThresholds: RankThreshold[] = [
		{ threshold: 990, increment: 1 },
		{ threshold: 984, increment: 5 },
		{ threshold: 974, increment: 10 },
		{ threshold: 965, increment: 15 },
		{ threshold: 950, increment: 25 },
		{ threshold: 900, increment: 35 },
		{ threshold: 850, increment: 50 },
		{ threshold: 1, increment: 100 },
	];

	if (highestRank < 1) return 1;

	for (const { threshold, increment } of rankThresholds) {
		if (highestRank >= threshold) {
			return highestRank + increment;
		}
	}

	return 1;
}

export function getSimilarityColor(similarityScore: number, darkMode: boolean): string {
	const similarityLevel = similarityScore * 2.55;
	if (darkMode) {
		return `rgb(255, ${255 - similarityLevel}, ${255 - similarityLevel})`;
	} else {
		return `rgb(${similarityLevel + 97}, 97, 97)`; // 97 comes from the RGB value of the light theme's text color (97, 97, 97)
	}
}

export function wrapWordsInBold(words: string[]) {
	if (words.length === 0) return 'N/A';

	const wrapWord = (word: string) => `"<span style='font-weight: 500'>${word}</span>"`;

	if (words.length === 1) return wrapWord(words[0]);

	const wrappedWords = words.map(wrapWord);
	const lastWord = wrappedWords.pop();

	return wrappedWords.join(', ') + ' ja ' + lastWord;
}

function getFirstTopGuess(guesses: Guess[]): Guess | undefined {
	const sortedGuesses = [...guesses].sort((a, b) => a.guessNumber - b.guessNumber);

	return sortedGuesses.find((guess) => guess.rank !== 0);
}

function getSecondToLastGuess(guesses: Guess[]): Guess | undefined {
	return guesses.sort((a, b) => b.guessNumber - a.guessNumber)[1];
}

function formatSimilarity(score: number | undefined, rank: number | undefined): string {
	if (score === undefined) return '';
	const formattedScore = score.toFixed(2);
	return rank ? `${formattedScore} (${rank}/1000)` : formattedScore;
}

export function getClipboardContent(winState: string, gameNumber: number, guesses: Guess[], hintsUsed: number): string {
	if (winState === 'gaveUp') {
		return `🚫 Semanttuli #${gameNumber} luovutettu ${guesses.length} arvauksen ja ${hintsUsed} vinkin jälkeen | semanttuli.fly.dev`;
	}

	if (guesses.length === 1) {
		return `✅ Semanttuli #${gameNumber} ratkaistu ensimmäisellä arvauksella! | semanttuli.fly.dev`;
	}

	const firstGuess = guesses.find((guess) => guess.guessNumber === 1);
	const firstTop1000Guess = getFirstTopGuess(guesses);
	const penultimateGuess = getSecondToLastGuess(guesses);

	let content = `✅ Semanttuli #${gameNumber} ratkaistu ${guesses.length} arvauksella ja ${hintsUsed} vinkillä.\n`;
	content += `▪️Ensimmäisen arvaukseni samankaltaisuus oli ${formatSimilarity(firstGuess?.similarityScore, firstGuess?.rank)}.\n`;

	if (firstTop1000Guess && firstTop1000Guess.guessNumber !== 1) {
		content += `▪️Ensimmäinen arvaukseni top 1000:ssa oli #${firstTop1000Guess.guessNumber}.\n`;
	}

	content += `▪️Toiseksi viimeisen arvaukseni samankaltaisuus oli ${formatSimilarity(penultimateGuess?.similarityScore, penultimateGuess?.rank)}.\n`;
	content += `\nsemanttuli.fly.dev`;

	return content;
}
