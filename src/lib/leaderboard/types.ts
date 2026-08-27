export type ResultOutcome = 'won' | 'gaveUp';

export type LeaderboardDoc = {
	dayId: number;
	gameNumber: number;
	name: string | null;
	nameKey?: string;
	outcome: ResultOutcome;
	guessCount: number;
	hintCount: number;
	bestUnhintedRank: number;
	bestUnhintedSimilarity: number;
	submittedAt: Date;
	expiresAt: Date;
};

export type LeaderboardRow = {
	id: string;
	place: number;
	name: string | null;
	outcome: ResultOutcome;
	guessCount: number;
	hintCount: number;
	bestUnhintedRank: number;
	bestUnhintedSimilarity: number;
};

export type AddResultInput = {
	name: string;
	outcome: ResultOutcome;
	guessCount: number;
	hintCount: number;
	bestUnhintedRank: number;
	bestUnhintedSimilarity: number;
	gameNumber: number;
};

export type AddResultError = 'invalid-name' | 'reserved-name' | 'name-taken' | 'cap-reached' | 'invalid-result';

export type AddResultResponse =
	| { ok: true; id: string; place: number; name: string | null }
	| { ok: false; error: AddResultError };
