import { defineConfig, devices } from '@playwright/experimental-ct-svelte';
import { resolve } from 'node:path';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: 'tests/component',
	/* The base directory, relative to the config file, for snapshot files created with toMatchSnapshot and toHaveScreenshot. */
	snapshotDir: 'tests/component/__snapshots__',
	/* Maximum time one test can run for. */
	timeout: 10 * 1000,
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: 'on-first-retry',

		/* Port to use for Playwright component endpoint. */
		ctPort: 3100,

		/* Replicate vite config */
		ctViteConfig: {
			// Loading the sveltekit plugin here sounds like the best option to me, e.g.:
			//     plugins: [sveltekit()],
			// But this doesn't quite work. The tests still pass but I see logs like this that sound like something isn't quite right:
			//     The following Vite config options will be overridden by SvelteKit:
			//       - build.rollupOptions.input
			//     [3/6] [firefox] › PaginationControls.spec.ts:6:1 › shows next link
			//     Error: Not found: /favicon.ico
			//         at resolve (file:///workspaces/wfps-2023/.svelte-kit/output/server/index.js:2695:18)
			//         at resolve (file:///workspaces/wfps-2023/.svelte-kit/output/server/index.js:2570:34)
			//         at Object.handle (file:///workspaces/wfps-2023/.svelte-kit/output/server/index.js:2761:61)
			//         at respond (file:///workspaces/wfps-2023/.svelte-kit/output/server/index.js:2568:43)
			resolve: {
				alias: {
					// Setup the built-in $lib alias in SvelteKit
					$lib: resolve('src/lib')
				}
			}
		}
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] }
		},
		{
			name: 'webkit',
			use: { ...devices['Desktop Safari'] }
		}
	]
});
