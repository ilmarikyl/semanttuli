import type { RequestHandler } from '@sveltejs/kit';
import { getNearby1k } from '$lib/api';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { wordB64 } = params;

	if (!wordB64) {
		return json({ error: 'wordB64 parameter is missing' }, { status: 400 });
	}

	try {
		const result = await getNearby1k(wordB64);
		if (result) {
			return json(
				result.map((obj) => ({
					neighbor: obj.neighbor,
					percentile: obj.percentile,
					similarity: (obj.similarity * 100).toFixed(2)
				})),
				{ status: 200 }
			);
		} else {
			return json({ error: 'Nearby words not found' }, { status: 404 });
		}
	} catch (error) {
		console.error(error);
		return json({ error: 'Server error' }, { status: 500 });
	}
};
