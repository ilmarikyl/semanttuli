// import { languageConfigs } from './language';

export const metadataConfig = {
	fi: {
		title: 'Semanttuli',
		description: 'Semanttuli - Selvitä salainen sana',
		ogTitle: 'Semanttuli',
		ogDescription: 'Semanttuli - Selvitä salainen sana',
	},
	en: {
		title: 'Meaningle',
		description: 'Meaningle - Find the secret word',
		ogTitle: 'Meaningle',
		ogDescription: 'Meaningle - Find the secret word',
	},
};

export const currentMetadata = metadataConfig[import.meta.env.VITE_LANGUAGE || 'fi'];
