import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				generate: 'dom'
			}
		})
	],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		globals: true,
		environment: 'jsdom',
		setupFiles: ['src/setupTests.ts'], // This file will contain the jest-dom setup
		alias: {
			$lib: './src/lib'
		},
		environmentMatchGlobs: [['src/**/*.svelte', 'jsdom']]
	},
	resolve: {
		conditions: ['browser']
	}
});
