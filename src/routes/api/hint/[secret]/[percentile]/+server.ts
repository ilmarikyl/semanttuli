// src/routes/api/hint/[secret]/[percentile].ts
import type { RequestHandler } from '@sveltejs/kit';
import { getHint } from '$lib/api';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { secret, percentile } = params;

	if (!secret || !percentile) {
		return json({ error: 'Secret or percentile parameter is missing' }, { status: 400 });
	}

	try {
		const result = await getHint(secret, parseInt(percentile));

		if (result) {
			return json(result, { status: 200 });
		} else {
			return json({ error: 'Hint not found' }, { status: 404 });
		}
	} catch (error) {
		console.error(error);
		return json({ error: 'Server error' }, { status: 500 });
	}
};
