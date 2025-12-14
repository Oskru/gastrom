// tests/auth.spec.ts
import { testWithoutMocks as test, expect } from './fixtures';

// All auth tests run unauthenticated - explicitly clear storage state
test.describe('Authentication Tests', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should display sign-in page correctly', async ({ signInPage }) => {
    await signInPage.goto();

    await signInPage.expectToBeOnSignInPage();
    await expect(signInPage.emailInput).toBeVisible();
    await expect(signInPage.passwordInput).toBeVisible();
    await expect(signInPage.signInButton).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({
    signInPage,
  }) => {
    await signInPage.goto();
    await signInPage.clickSignIn();

    await signInPage.expectEmailValidationError();
    await signInPage.expectPasswordValidationError();
  });

  test('should show validation error for invalid email format', async ({
    signInPage,
  }) => {
    await signInPage.goto();

    await signInPage.fillEmail('invalid-email');
    await signInPage.fillPassword('somepassword');
    await signInPage.clickSignIn();

    await signInPage.expectEmailValidationError();
  });

  test('should show login error for invalid credentials', async ({
    signInPage,
    page,
  }) => {
    await signInPage.goto();
    await signInPage.login('wrong@email.com', 'wrongpassword');

    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    expect(currentUrl).toContain('login');
  });

  test('should redirect to sign-in when not authenticated', async ({
    page,
  }) => {
    await page.goto('/inventory');
    await page.waitForURL(/login/);
  });

  test('should handle 404 gracefully', async ({ page }) => {
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
  });
});
