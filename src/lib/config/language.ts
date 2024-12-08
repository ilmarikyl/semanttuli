export type LanguageConfig = {
	dbName: string;
	gaId: string;
	defaultTitle: string;
	defaultDescription: string;
};

export const languageConfigs: Record<string, LanguageConfig> = {
	fi: {
		dbName: import.meta.env.VITE_FI_DB_NAME,
		gaId: import.meta.env.VITE_FI_GA_ID,
		defaultTitle: 'Semanttuli - Selvitä salainen sana',
		defaultDescription: 'Semanttuli - Selvitä salainen sana',
	},
	en: {
		dbName: import.meta.env.VITE_EN_DB_NAME,
		gaId: import.meta.env.VITE_EN_GA_ID,
		defaultTitle: 'Meaningle - Find the secret word',
		defaultDescription: 'Meaningle - Find the secret word',
	},
};

export const currentLanguage = import.meta.env.VITE_LANGUAGE || 'fi';
export const currentConfig = languageConfigs[currentLanguage];
