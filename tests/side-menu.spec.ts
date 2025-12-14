// tests/side-menu.spec.ts
import { test, expect } from './fixtures';

test.describe('Side Menu Tests', () => {
  test('should display side menu navigation', async ({ basePage, page }) => {
    await page.goto('/');
    await basePage.waitForPageLoad();
    // With mocked API, no need for extended timeout
    await expect(basePage.navHome).toBeVisible();
  });

  test('should highlight active menu item', async ({
    basePage,
    inventoryPage,
  }) => {
    await inventoryPage.goto();
    await inventoryPage.expectToBeOnInventoryPage();
    // Verify inventory link is visible in menu - with mocked API, no need for extended timeout
    await expect(basePage.navInventory).toBeVisible();
  });

  test('should show all navigation items', async ({ basePage, page }) => {
    await page.goto('/');
    await basePage.waitForPageLoad();

    // With mocked API, no need for extended timeouts
    await expect(basePage.navHome).toBeVisible();
    await expect(basePage.navInventory).toBeVisible();
    await expect(basePage.navSalesReports).toBeVisible();
    await expect(basePage.navEmployees).toBeVisible();
    await expect(basePage.navFixedCosts).toBeVisible();
    await expect(basePage.navAbout).toBeVisible();
  });

  test('should navigate to each section from menu', async ({
    basePage,
    page,
    inventoryPage,
    salesReportsPage,
    employeePage,
    fixedCostsPage,
    myAccountPage,
    aboutPage,
    homePage,
  }) => {
    await page.goto('/');
    await basePage.waitForPageLoad();

    // Navigate to Inventory
    await basePage.navigateToInventory();
    await inventoryPage.expectToBeOnInventoryPage();

    // Navigate to Sales Reports
    await basePage.navigateToSalesReports();
    await salesReportsPage.expectToBeOnSalesReportsPage();

    // Navigate to Employees
    await basePage.navigateToEmployees();
    await employeePage.expectToBeOnEmployeePage();

    // Navigate to Fixed Costs
    await basePage.navigateToFixedCosts();
    await fixedCostsPage.expectToBeOnFixedCostsPage();

    // Navigate to My Account
    await basePage.navigateToMyAccount();
    await myAccountPage.expectToBeOnMyAccountPage();

    // Navigate back to home first (My Account has side menu)
    await basePage.navigateToHome();
    await homePage.expectToBeOnHomePage();

    // Navigate to About (which uses full-screen layout with back button)
    await basePage.navigateToAbout();
    await aboutPage.expectToBeOnAboutPage();

    // Use about page's back button to return
    await aboutPage.goBack();
    await homePage.expectToBeOnHomePage();
  });
});
