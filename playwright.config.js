// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'html',
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
     baseURL: 'https://qa-test-web-app.vercel.app/index.html',

    trace: 'on-first-retry',
    headless: false,
    permissions: [],
    geolocation: undefined,
    launchOptions: {
      args: [
        '--start-maximized',
        '--disable-geolocation',
        '--disable-notifications',
      ],
    },
    viewport: null,
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
