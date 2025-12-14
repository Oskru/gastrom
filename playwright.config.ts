// playwright.config.ts
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config();

const AUTH_FILE = 'tests/.auth/user.json';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    screenshot: 'only-on-failure',
    // Reduced timeouts since API responses are mocked
    actionTimeout: 5000,
    navigationTimeout: 10000,
  },
  testDir: './tests',
  // Reduced overall timeout since API calls are mocked
  timeout: 30000,
  // Disable retries since mocked tests should be deterministic
  retries: 0,
  projects: [
    // Setup project - runs first to authenticate
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    // Unauthenticated tests - run without auth setup
    {
      name: 'unauthenticated',
      testMatch: /auth\.spec\.ts|error-handling\.spec\.ts/,
      testIgnore: /auth\.setup\.ts/,
    },
    // Main tests - depend on setup and use stored auth state
    {
      name: 'chromium',
      use: {
        storageState: AUTH_FILE,
      },
      dependencies: ['setup'],
      testIgnore: /auth\.setup\.ts|auth\.spec\.ts|error-handling\.spec\.ts/,
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
