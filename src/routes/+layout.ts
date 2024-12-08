import { locale, waitLocale } from 'svelte-i18n';
import { currentLanguage } from '$lib/config/language';
import { initializeSecretWords } from '$lib/utils/utils';
import { initI18n } from '$lib/i18n';

export const load = async () => {
	// Initialize i18n with the current language
	initI18n();
	await initializeSecretWords();
	locale.set(currentLanguage);

	// Wait for locale to be loaded before rendering
	await waitLocale();

	return {};
};
