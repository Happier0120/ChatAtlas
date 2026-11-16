import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure', screenshot: 'only-on-failure',
    channel: process.env.PLAYWRIGHT_CHANNEL === 'chrome' ? 'chrome' : 'chromium',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
