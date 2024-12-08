import { init, register } from 'svelte-i18n';
import { currentLanguage } from '$lib/config/language';

import en from './locales/en';
import fi from './locales/fi';

// Register locales with Promise-wrapped dictionaries
register('en', () => Promise.resolve(en));
register('fi', () => Promise.resolve(fi));

export function initI18n() {
	init({
		fallbackLocale: 'fi',
		initialLocale: currentLanguage,
	});
}
