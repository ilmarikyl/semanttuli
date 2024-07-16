// src/stores/theme.ts
import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

const getInitialTheme = (): string => {
	if (browser) {
		const storedTheme = localStorage.getItem('theme');
		const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
		return initialTheme;
	}
	return 'light';
};

const applyTheme = (theme: string) => {
	document.documentElement.classList.toggle('dark', theme === 'dark');
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem('theme', theme);
};

const initialTheme = getInitialTheme();
export const theme = writable<string>(initialTheme);

export const isDarkMode = derived(theme, ($theme) => $theme === 'dark');

theme.subscribe((value) => {
	if (browser) {
		applyTheme(value);
	}
});
