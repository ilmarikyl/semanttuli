const storageKey = (gameNumber: number) => `leaderboardPosted:${gameNumber}`;

export type PostedResult = { id: string; name: string | null };

export function getPostedResult(gameNumber: number): PostedResult | null {
	if (typeof window === 'undefined') return null;
	const raw = localStorage.getItem(storageKey(gameNumber));
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as PostedResult;
		if (typeof parsed.id !== 'string') return null;
		return parsed;
	} catch {
		return null;
	}
}

export function savePostedResult(gameNumber: number, posted: PostedResult): void {
	if (typeof window === 'undefined') return;
	localStorage.setItem(storageKey(gameNumber), JSON.stringify(posted));
}
