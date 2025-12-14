import { Page, Locator, expect } from '@playwright/test';

/**
 * About Page Object
 */
export class AboutPage {
  readonly page: Page;

  // Page elements
  readonly backButton: Locator;
  readonly pageTitle: Locator;
  readonly heroSection: Locator;
  readonly featuresSection: Locator;
  readonly statsSection: Locator;

  // Feature cards
  readonly featureCards: Locator;
  readonly smartInventoryCard: Locator;
  readonly teamManagementCard: Locator;
  readonly salesAnalyticsCard: Locator;
  readonly transactionHubCard: Locator;
  readonly securityCard: Locator;
  readonly performanceCard: Locator;

  constructor(page: Page) {
    this.page = page;

    // Page elements
    this.backButton = page.locator('[data-testid="about-back-button"]');
    this.pageTitle = page.locator('[data-testid="about-title"]');
    this.heroSection = page.locator('[data-testid="about-hero"]');
    this.featuresSection = page.locator('[data-testid="about-features"]');
    this.statsSection = page.locator('[data-testid="about-stats"]');

    // Feature cards
    this.featureCards = page.locator('[data-testid="feature-card"]');
    this.smartInventoryCard = page.locator(
      '[data-testid="feature-smart-inventory"]'
    );
    this.teamManagementCard = page.locator(
      '[data-testid="feature-team-management"]'
    );
    this.salesAnalyticsCard = page.locator(
      '[data-testid="feature-sales-analytics"]'
    );
    this.transactionHubCard = page.locator(
      '[data-testid="feature-transaction-hub"]'
    );
    this.securityCard = page.locator('[data-testid="feature-security"]');
    this.performanceCard = page.locator('[data-testid="feature-performance"]');
  }

  async goto() {
    await this.page.goto('/about');
  }

  async goBack() {
    await this.backButton.click();
  }

  async expectToBeOnAboutPage() {
    await this.page.waitForURL('/about');
    await expect(this.page.getByText('Elevate Your Restaurant')).toBeVisible();
  }

  async getFeatureCardCount(): Promise<number> {
    return await this.featureCards.count();
  }
}
