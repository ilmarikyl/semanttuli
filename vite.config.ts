import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		'process.env.MONGO_CONNECTION_STRING': JSON.stringify('MONGO_CONNECTION_STRING_PLACEHOLDER'),
		'process.env.DB_NAME': JSON.stringify('DB_NAME_PLACEHOLDER')
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
