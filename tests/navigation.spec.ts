// tests/navigation.spec.ts
import { test, expect } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Navigation Tests', () => {
  test('should navigate to Inventory page', async ({
    basePage,
    inventoryPage,
  }) => {
    await basePage.navigateToInventory();
    await inventoryPage.expectToBeOnInventoryPage();
  });

  test('should navigate to Employees page', async ({
    basePage,
    employeePage,
  }) => {
    await basePage.navigateToEmployees();
    await employeePage.expectToBeOnEmployeePage();
  });

  test('should navigate to Fixed Costs page', async ({
    basePage,
    fixedCostsPage,
  }) => {
    await basePage.navigateToFixedCosts();
    await fixedCostsPage.expectToBeOnFixedCostsPage();
  });

  test('should navigate to Sales Reports page', async ({
    basePage,
    salesReportsPage,
  }) => {
    await basePage.navigateToSalesReports();
    await salesReportsPage.expectToBeOnSalesReportsPage();
  });

  test('should navigate to About page', async ({ basePage, aboutPage }) => {
    await basePage.navigateToAbout();
    await aboutPage.expectToBeOnAboutPage();
  });

  test('should navigate to My Account page via options menu', async ({
    basePage,
    myAccountPage,
  }) => {
    await basePage.navigateToMyAccount();
    await myAccountPage.expectToBeOnMyAccountPage();
  });

  test('should navigate back to Home from any page', async ({
    basePage,
    homePage,
    inventoryPage,
  }) => {
    await basePage.navigateToInventory();
    await inventoryPage.expectToBeOnInventoryPage();

    await basePage.navigateToHome();
    await homePage.expectToBeOnHomePage();
  });
});

test.describe('Side Menu Tests', () => {
  test('should display side menu', async ({ basePage }) => {
    await expect(basePage.sideMenu).toBeVisible();
  });

  test('should display user avatar', async ({ basePage }) => {
    await expect(basePage.userAvatar).toBeVisible();
  });

  test('should display options menu button', async ({ basePage }) => {
    await expect(basePage.optionsMenuButton).toBeVisible();
  });

  test('should open options menu when button is clicked', async ({
    basePage,
  }) => {
    await basePage.openOptionsMenu();

    await expect(basePage.myAccountOption).toBeVisible();
    await expect(basePage.logoutOption).toBeVisible();
  });

  test('should have all navigation items visible', async ({ basePage }) => {
    await expect(basePage.navHome).toBeVisible();
    await expect(basePage.navInventory).toBeVisible();
    await expect(basePage.navEmployees).toBeVisible();
    await expect(basePage.navFixedCosts).toBeVisible();
    await expect(basePage.navSalesReports).toBeVisible();
    await expect(basePage.navAbout).toBeVisible();
    await expect(basePage.navFeedback).toBeVisible();
  });
});
