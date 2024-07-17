import type { RequestHandler } from '@sveltejs/kit';
import { getModel } from '$lib/api';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { secret, word } = params;

	if (!secret || !word) {
		return json({ error: 'Secret or word parameter is missing' }, { status: 400 });
	}

	try {
		const result = await getModel(secret, word);
		if (result) {
			return json(result, { status: 200 });
		} else {
			return json({ error: 'Word not found' }, { status: 404 });
		}
	} catch (error) {
		console.error(error);
		return json({ error: 'Server error' }, { status: 500 });
	}
};
