// tests/error-handling.spec.ts
import { testWithoutMocks as test, expect, setupApiMocks } from './fixtures';

// Unauthenticated tests - explicitly clear storage state
test.describe('Error Handling Tests - Unauthenticated', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('should redirect to login when not authenticated', async ({
    page,
    signInPage,
  }) => {
    await page.goto('/');
    await signInPage.expectToBeOnSignInPage();
  });

  test('should redirect protected routes to login', async ({
    page,
    signInPage,
  }) => {
    await page.goto('/inventory');
    await signInPage.expectToBeOnSignInPage();
  });

  test('should redirect account page to login when not authenticated', async ({
    page,
    signInPage,
  }) => {
    await page.goto('/account');
    await signInPage.expectToBeOnSignInPage();
  });

  test('should redirect employees page to login when not authenticated', async ({
    page,
    signInPage,
  }) => {
    await page.goto('/employees');
    await signInPage.expectToBeOnSignInPage();
  });

  test('should redirect fixed-costs page to login when not authenticated', async ({
    page,
    signInPage,
  }) => {
    await page.goto('/fixed-costs');
    await signInPage.expectToBeOnSignInPage();
  });

  test('should redirect sales-reports page to login when not authenticated', async ({
    page,
    signInPage,
  }) => {
    await page.goto('/sales-reports');
    await signInPage.expectToBeOnSignInPage();
  });
});

// Authenticated tests - inject token manually since this file runs in unauthenticated project
test.describe('Error Handling Tests - Authenticated', () => {
  const TEST_TOKEN =
    process.env.TEST_TOKEN ||
    'eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJpZCI6MSwidXNlclJvbGUiOiJBRE1JTiIsInN1YiI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTc2NTcxNDAzNSwiZXhwIjoxNzY3MTU0MDM1fQ.-wMofKQN0LQsSnMnXLDTbxqSFGdhhm7332JVPbhfaUw';

  test.beforeEach(async ({ page }) => {
    // Set up API mocks for authenticated tests
    await setupApiMocks(page);
    await page.addInitScript(token => {
      window.localStorage.setItem('token', token);
    }, TEST_TOKEN);
  });

  test('should handle non-existent route gracefully', async ({ page }) => {
    await page.goto('/non-existent-page');
    const url = page.url();
    expect(
      url.includes('/non-existent-page') ||
        url === 'http://localhost:5173/' ||
        url === 'http://localhost:5173/sign-in'
    ).toBeTruthy();
  });

  test('should stay authenticated across page navigation', async ({
    basePage,
    homePage,
    inventoryPage,
    page,
  }) => {
    await page.goto('/');
    await homePage.expectToBeOnHomePage();

    await basePage.navigateToInventory();
    await inventoryPage.expectToBeOnInventoryPage();

    await basePage.navigateToHome();
    await homePage.expectToBeOnHomePage();

    await expect(page).toHaveURL(/.*localhost:5173\/$/);
  });
});
