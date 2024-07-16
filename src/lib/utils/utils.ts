import base64 from 'base-64';
import utf8 from 'utf8';
import { START_DAY } from './constants';
import { secretWordsEncoded } from '../data/secretWords';
import type { Guess } from '../types';

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
	if (highestRank >= 990) {
		return highestRank + 1;
	} else if (highestRank >= 984) {
		return highestRank + 5;
	} else if (highestRank >= 965) {
		return highestRank + 15;
	} else if (highestRank >= 950) {
		return highestRank + 25;
	} else if (highestRank >= 850) {
		return highestRank + 50;
	} else if (highestRank >= 1) {
		return highestRank + 100;
	} else {
		return 1;
	}
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
	return guesses
		.filter((guess) => guess.rank > 0 && guess.rank <= 1000)
		.sort((a, b) => a.rank - b.rank)[0];
}

function getSecondToLastGuess(guesses: Guess[]): Guess | undefined {
	return guesses.sort((a, b) => b.guessNumber - a.guessNumber)[1];
}

function formatSimilarity(score: number | undefined, rank: number | undefined): string {
	if (score === undefined) return '';
	const formattedScore = score.toFixed(2);
	return rank ? `${formattedScore} (${rank}/1000)` : formattedScore;
}

export function getClipboardContent(
	winState: string,
	gameNumber: number,
	guesses: Guess[],
	hintsUsed: number
): string {

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
	content += `\nhttps://semanttuli.fly.dev`;

	return content;
}
