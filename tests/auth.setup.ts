// tests/auth.setup.ts
import { test as setup } from '@playwright/test';

const AUTH_FILE = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const token = process.env.TEST_TOKEN;

  if (!token) {
    throw new Error(
      'TEST_TOKEN environment variable is required. Set it before running tests.'
    );
  }

  // Navigate to app and inject token into localStorage
  await page.goto('/');
  await page.evaluate(authToken => {
    window.localStorage.setItem('token', authToken);
  }, token);

  // Save storage state for reuse in all tests
  await page.context().storageState({ path: AUTH_FILE });
});
