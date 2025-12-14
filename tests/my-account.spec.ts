// tests/my-account.spec.ts
import { test, expect } from './fixtures';

test.beforeEach(async ({ myAccountPage }) => {
  await myAccountPage.goto();
  await myAccountPage.expectToBeOnMyAccountPage();
});

test.describe('My Account Page Tests', () => {
  test('should display user information section', async ({ page }) => {
    await expect(
      page.locator('[data-testid="user-info-section"]')
    ).toBeVisible();
  });

  test('should display change password section', async ({ page }) => {
    await expect(
      page.locator('[data-testid="change-password-section"]')
    ).toBeVisible();
  });

  test('should have password change form fields', async ({ myAccountPage }) => {
    await expect(myAccountPage.oldPasswordInput).toBeVisible();
    await expect(myAccountPage.newPasswordInput).toBeVisible();
    await expect(myAccountPage.confirmPasswordInput).toBeVisible();
    await expect(myAccountPage.changePasswordButton).toBeVisible();
  });
});
