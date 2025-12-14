// tests/about.spec.ts
import { test, expect } from './fixtures';

test.describe('About Page Tests', () => {
  test('should display about page content', async ({ aboutPage }) => {
    await aboutPage.goto();
    await aboutPage.expectToBeOnAboutPage();
  });

  test('should have back navigation button', async ({ aboutPage }) => {
    await aboutPage.goto();
    await expect(aboutPage.backButton).toBeVisible();
  });

  test('should navigate back when back button is clicked', async ({
    basePage,
    aboutPage,
    homePage,
    page,
  }) => {
    await page.goto('/');
    await homePage.expectDashboardToBeVisible();

    await basePage.navigateToAbout();
    await aboutPage.expectToBeOnAboutPage();

    await aboutPage.goBack();

    await homePage.expectToBeOnHomePage();
  });
});
