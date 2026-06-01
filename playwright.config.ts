import { defineConfig, devices } from '@playwright/test';
import { environment } from './src/config/environment';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'reports/html' }],
    ['list'],
    ['allure-playwright', { outputFolder: 'allure-results', suiteTitle: false }],
  ],
  use: {
    baseURL: environment.odooUrl,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: 'tests/ui/**/*.spec.ts',
    },
    {
      name: 'api',
      testMatch: 'tests/api/**/*.spec.ts',
    },
  ],
  outputDir: 'test-results',
});
