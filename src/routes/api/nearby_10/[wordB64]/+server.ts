import { type RequestHandler, json } from '@sveltejs/kit';
import { getNearby10 } from '$lib/api';

export const GET: RequestHandler = async ({ params }) => {
	const { wordB64 } = params;

	if (!wordB64) {
		return json({ error: 'wordB64 parameter is missing' }, { status: 400 });
	}

	try {
		const result = await getNearby10(wordB64);
		if (result) {
			return json(
				result.map((obj) => obj.neighbor),
				{ status: 200 },
			);
		} else {
			return json({ error: 'Nearby words not found' }, { status: 404 });
		}
	} catch (error) {
		console.error(error);
		return json({ error: 'Server error' }, { status: 500 });
	}
};
