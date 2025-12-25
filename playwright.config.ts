import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    testDir: './tests/e2e',
    testMatch: '**/*.e2e.ts',
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
        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: 'http://localhost:8080',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',

        /* HTTP Basic Auth credentials */
        httpCredentials: {
            username: 'admin',
            password: process.env.BASIC_AUTH_PASSWORD || 'rLlFRXXQ5U3HKllL1gaw3qkMR6b9f5X0',
        },
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
    ],

    /* Run your local dev server before starting the tests */
    webServer: {
        command: '/Users/mike/.bun/bin/bun run server.ts',
        url: 'http://localhost:8080',
        reuseExistingServer: !process.env.CI,
        env: {
            BASIC_AUTH_USER: 'admin',
            BASIC_AUTH_PASSWORD: 'rLlFRXXQ5U3HKllL1gaw3qkMR6b9f5X0',
            PORT: '8080'
        }
    },
});
