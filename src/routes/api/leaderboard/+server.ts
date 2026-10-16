import { json, type RequestHandler } from '@sveltejs/kit';
import { addResult, listBoards } from '$lib/leaderboard/store';
import type { AddResultError } from '$lib/leaderboard/types';

const errorStatus: Record<AddResultError, number> = {
	'invalid-name': 400,
	'reserved-name': 400,
	'invalid-result': 400,
	'name-taken': 409,
	'cap-reached': 429,
};

export const GET: RequestHandler = async () => {
	try {
		const { today, yesterday } = await listBoards();
		return json({ today, yesterday, results: today });
	} catch (error) {
		console.error(error);
		return json({ error: 'Server error' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const result = await addResult({
			name: typeof body.name === 'string' ? body.name : '',
			outcome: body.outcome,
			guessCount: body.guessCount,
			hintCount: body.hintCount,
			bestUnhintedRank: body.bestUnhintedRank,
			bestUnhintedSimilarity: body.bestUnhintedSimilarity,
			gameNumber: body.gameNumber,
		});

		if (!result.ok) {
			return json({ error: result.error }, { status: errorStatus[result.error] });
		}

		return json(result, { status: 201 });
	} catch (error) {
		console.error(error);
		return json({ error: 'Server error' }, { status: 500 });
	}
};
