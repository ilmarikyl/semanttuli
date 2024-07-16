export interface GameState {
	gameNumber: number;
	guesses: Guess[];
	isGameInfoCollapsed: boolean;
	latestGuess: Guess | null;
	secretWordVec: number[];
	similarityData: SimilarityData;
	sortBy: string;
	sortOrder: 'asc' | 'desc';
	yesterdayNearby10: string[];
	yesterdayWord: string;
	winState: 'won' | 'gaveUp' | 'playing';
}

export interface GameStats {
	abandons: number;
	firstPlay: number;
	giveUps: number;
	lastWon: number;
	lastPlay: number;
	playStreak: number;
	totalGuesses: number;
	totalPlayDays: number;
	totalHints: number;
	wins: number;
	winStreak: number;
}

export interface Guess {
	guessNumber: number;
	word: string;
	similarityScore: number;
	rank: number;
	wasHinted: boolean;
	isNew?: boolean;
}

export interface SimilarityData {
	top: number | null;
	top10: number | null;
	top1000: number | null;
}

export type WinState = 'won' | 'gaveUp' | 'playing';

export interface ModelResult {
	word?: string;
	neighbor?: string;
	vec?: string[];
}
