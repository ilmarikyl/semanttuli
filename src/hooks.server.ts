import type { Handle } from '@sveltejs/kit';
import { currentLanguage } from '$lib/config/language';
import { currentMetadata } from '$lib/config/metadata';
import { locale } from 'svelte-i18n';

/**
 * SvelteKit server hook that handles HTML transformations and i18n setup
 * - Replaces template variables in app.html with localized content
 * - Sets locale based on configured language
 *
 * Template variables:
 * - %lang%: Current language code (e.g. 'fi' or 'en')
 * - %title%: Page title
 * - %description%: Meta description
 * - %ogTitle%: OpenGraph title
 * - %ogDescription%: OpenGraph description
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Set locale based on configured language
	locale.set(currentLanguage);

	// Transform HTML and replace template variables
	const response = await resolve(event, {
		transformPageChunk: ({ html }) => {
			return html
				.replace(/%lang%/g, currentLanguage)
				.replace(/%title%/g, currentMetadata.title)
				.replace(/%description%/g, currentMetadata.description)
				.replace(/%ogTitle%/g, currentMetadata.ogTitle)
				.replace(/%ogDescription%/g, currentMetadata.ogDescription);
		},
	});

	return response;
};
