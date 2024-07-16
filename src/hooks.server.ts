import { updateConnectionDetails } from '$lib/services/dbService';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	if (process.env.MONGO_CONNECTION_STRING && process.env.DB_NAME) {
		updateConnectionDetails(process.env.MONGO_CONNECTION_STRING, process.env.DB_NAME);
	}
	return resolve(event);
}
