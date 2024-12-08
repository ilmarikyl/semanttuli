import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';

export const getGameDescription = () => get(_)('description');

export function faqItems() {
	const t = get(_);
	return [
		{
			title: t('faq.howCalculated.title'),
			content: t('faq.howCalculated.content'),
		},
		{
			title: t('faq.whatData.title'),
			content: t('faq.whatData.content'),
		},
		{
			title: t('faq.yesterdayWord.title'),
			content: t('faq.yesterdayWord.content'),
		},
		{
			title: t('faq.wordSelection.title'),
			content: t('faq.wordSelection.content'),
		},
		{
			title: t('faq.sortGuesses.title'),
			content: t('faq.sortGuesses.content'),
		},
		{
			title: t('faq.multipleGames.title'),
			content: t('faq.multipleGames.content'),
		},
		{
			title: t('faq.otherLanguages.title'),
			content: t('faq.otherLanguages.content'),
		},
		{
			title: t('faq.sourceCode.title'),
			content: t('faq.sourceCode.content'),
		},
	];
}
