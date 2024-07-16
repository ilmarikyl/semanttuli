import type { RequestHandler } from '@sveltejs/kit';
import { getSimilarity } from '$lib/api';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { wordB64 } = params;

	if (!wordB64) {
		return json({ error: 'wordB64 parameter is missing' }, { status: 400 });
	}

	try {
		const result = await getSimilarity(wordB64);
		if (result) {
			return json(result, { status: 200 });
		} else {
			return json({ error: 'Similarity data not found' }, { status: 404 });
		}
	} catch (error) {
		console.error(error);
		return json({ error: 'Server error' }, { status: 500 });
	}
};
