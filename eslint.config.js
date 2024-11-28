import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';

// Prettier configuration
const prettierConfig = {
	// Basic formatting
	printWidth: 120,
	tabWidth: 2,
	useTabs: true,
	endOfLine: 'auto',

	// Quotes and punctuation
	singleQuote: true,
	quoteProps: 'consistent',
	semi: true,
	trailingComma: 'all',
	bracketSpacing: true,

	// Special formatting
	maxEmptyLines: 1,
	proseWrap: 'always',
	embeddedLanguageFormatting: 'auto',

	// Plugins
	plugins: ['prettier-plugin-tailwindcss'],
};

const sourceFiles = ['src/**/*.{js,ts}', '*.{js,ts,cjs,mjs}', '.*.{js,ts,cjs,mjs}', 'tests/**/*.{js,ts}'];

const jsonFiles = ['**/*.json', '**/*.yaml', '**/*.yml'];

const ignoredPaths = [
	'**/node_modules/**',
	'**/build/**',
	'**/.svelte-kit/**',
	'**/package/**',
	'**/.env*',
	'**/dist/**',
	'**/coverage/**',
	'**/.git/**',
];

// Base config
const baseConfig = {
	files: sourceFiles,
	ignores: ignoredPaths,
	languageOptions: {
		ecmaVersion: 2024,
		sourceType: 'module',
		parser: tsParser,
		globals: {
			...globals.browser,
			...globals.es2021,
			NodeJS: true,
			process: true,
			console: true,
			Buffer: true,
			require: true,
		},
	},
	plugins: {
		'prettier': eslintPluginPrettier,
		'@typescript-eslint': (await import('@typescript-eslint/eslint-plugin')).default,
	},
	rules: {
		...eslint.configs.recommended.rules,
		'prettier/prettier': ['error', prettierConfig],
		'@typescript-eslint/no-unused-vars': ['warn'],
		'no-debugger': 'warn',
		'no-duplicate-imports': 'error',
		'no-template-curly-in-string': 'warn',
	},
};

const prettierOnlyConfig = {
	...prettier,
};

const jsonConfig = {
	files: jsonFiles,
	...baseConfig,
	rules: {
		'prettier/prettier': [
			'error',
			{
				...prettierConfig,
				parser: 'json',
			},
		],
	},
};

const configs = [prettierOnlyConfig, jsonConfig, baseConfig];

export default configs;
