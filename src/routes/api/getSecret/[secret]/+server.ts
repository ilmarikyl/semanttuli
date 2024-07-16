// src/routes/api/getSecret/[secret].ts
import type { RequestHandler } from '@sveltejs/kit';
// import { getSecret } from '$lib/api';
import { getWordVector } from '$lib/api';
import { decodeB64word } from '$lib/utils/utils';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { secret } = params;

	if (!secret) {
		return json({ error: 'Secret parameter is missing' }, { status: 400 });
	}

	try {
		const decodedSecret = decodeB64word(secret);
		const result = await getWordVector(decodedSecret);
		if (result) {
			return json(result, { status: 200 });
		} else {
			return json({ error: 'Secret not found' }, { status: 404 });
		}
	} catch (error) {
		console.error(error);
		return json({ error: 'Server error' }, { status: 500 });
	}
};
