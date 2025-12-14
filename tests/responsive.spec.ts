// tests/responsive.spec.ts
import { test, expect } from './fixtures';

test.describe('Responsive Design Tests', () => {
  test('should display mobile view correctly', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    await homePage.goto();
    await homePage.expectToBeOnHomePage();
    await homePage.expectDashboardToBeVisible();
  });

  test('should display tablet view correctly', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await homePage.goto();
    await homePage.expectToBeOnHomePage();
    await homePage.expectDashboardToBeVisible();
  });

  test('should display desktop view correctly', async ({ homePage, page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 }); // Full HD
    await homePage.goto();
    await homePage.expectToBeOnHomePage();
    await homePage.expectDashboardToBeVisible();
  });

  test('should navigate correctly on mobile viewport', async ({
    basePage,
    homePage,
    inventoryPage,
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await homePage.goto();
    await homePage.expectToBeOnHomePage();

    await basePage.navigateToInventory();
    await inventoryPage.expectToBeOnInventoryPage();

    await basePage.navigateToHome();
    await homePage.expectToBeOnHomePage();
  });

  test('should handle orientation change simulation', async ({
    homePage,
    page,
  }) => {
    // Portrait
    await page.setViewportSize({ width: 375, height: 812 });
    await homePage.goto();
    await homePage.expectDashboardToBeVisible();

    // Landscape
    await page.setViewportSize({ width: 812, height: 375 });
    await homePage.expectDashboardToBeVisible();
  });
});
