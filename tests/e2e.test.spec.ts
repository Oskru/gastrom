// tests/e2e.spec.ts
import { test, expect } from '@playwright/test';

// Replace this constant with a valid JWT token for your test user.
const jwtToken =
  'eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJJZ29yIiwibGFzdE5hbWUiOiJLb2hzaW4iLCJpZCI6NywidXNlclJvbGUiOiJNQU5BR0VSIiwic3ViIjoiaWdvcjJAZ21haWwuY29tIiwiaWF0IjoxNzM5NTYwMDE5LCJleHAiOjE3Mzk1NjE0NTl9.63FdIxREEi11PEkcmFgax8Fv7ufW09hqijrfVSWZvTQ';

test.describe('App Integration Tests with JWT Auth', () => {
  // Before each test, inject the JWT token into localStorage and navigate to the app.
  test.beforeEach(async ({ page }) => {
    // Inject the JWT token. Adjust the storage key if your app uses a different key.
    await page.addInitScript((token: string) => {
      window.localStorage.setItem('token', token);
    }, jwtToken);
    // Now navigate to the base URL.
    await page.goto('/');
  });

  test('Home page displays dashboard elements', async ({ page }) => {
    // Verify that the Home (Dashboard) page contains key elements.
    await expect(page.locator('text=Welcome Back!')).toBeVisible();
    await expect(page.locator("text=Today's Sales")).toBeVisible();
    await expect(page.locator('text=Low Stock Items')).toBeVisible();
    await expect(page.locator('text=Quick Links')).toBeVisible();
  });

  test('Navigate to About page', async ({ page }) => {
    // Assuming you have a navigation link with the text "About"
    await page.click('text=About');
    await expect(page.locator('text=About Our Application')).toBeVisible();
  });

  test('Navigate to My Account page', async ({ page }) => {
    // Assuming you have a navigation link with the text "My Account"
    await page.click('text=My Account');
    await expect(page.locator('text=My Account')).toBeVisible();
    await expect(page.locator('text=Change Password')).toBeVisible();
  });

  test('Navigate to Inventory page', async ({ page }) => {
    // Assuming your navigation has a link with "Inventory" or "Inventory Management"
    await page.click('text=Inventory');
    await expect(page.locator('text=Inventory Management')).toBeVisible();
  });

  test('Navigate to Employees page', async ({ page }) => {
    // Assuming your navigation has a link with "Employees" or "Employee Management"
    await page.click('text=Employees');
    await expect(page.locator('text=Employee Management')).toBeVisible();
  });

  test('Navigate to Sales Report page', async ({ page }) => {
    // Assuming your navigation has a link with "Sales Report"
    await page.click('text=Sales Report');
    await expect(page.locator('text=Sales Report')).toBeVisible();
  });

  test('Refresh Dashboard data from Home page', async ({ page }) => {
    // Locate and click the "Refresh Dashboard" button.
    await page.click('text=Refresh Dashboard');
    // Optionally, wait for updated content to appear.
    await expect(page.locator("text=Today's Sales")).toBeVisible();
  });
});
