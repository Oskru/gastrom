// tests/dashboard.spec.ts
import { test, expect } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Dashboard Tests', () => {
  test('should display dashboard with tiles', async ({ homePage }) => {
    await homePage.expectDashboardToBeVisible();
    await expect(homePage.dashboardTilesContainer).toBeVisible();
  });

  test('should have view and customize mode toggle buttons', async ({
    homePage,
  }) => {
    await expect(homePage.viewModeButton).toBeVisible();
    await expect(homePage.customizeModeButton).toBeVisible();
  });

  test('should switch to customize mode and show reset button', async ({
    homePage,
  }) => {
    await homePage.switchToCustomizeMode();
    await expect(homePage.resetDashboardButton).toBeVisible();
  });

  test('should have timeframe selector', async ({ homePage }) => {
    await expect(homePage.timeframeSelect).toBeVisible();
  });

  test('should reset dashboard when reset button is clicked', async ({
    homePage,
  }) => {
    await homePage.switchToCustomizeMode();
    await homePage.resetDashboard();
    await homePage.expectDashboardToBeVisible();
  });
});
