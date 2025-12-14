import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.po';

/**
 * Home/Dashboard Page Object
 */
export class HomePage extends BasePage {
  // Dashboard controls
  readonly viewModeButton: Locator;
  readonly customizeModeButton: Locator;
  readonly resetDashboardButton: Locator;
  readonly timeframeSelect: Locator;

  // Dashboard tiles container
  readonly dashboardTilesContainer: Locator;
  readonly tileToolbar: Locator;

  // Individual tile types
  readonly welcomeTile: Locator;
  readonly todaysSalesTile: Locator;
  readonly lowStockTile: Locator;
  readonly quickLinksTile: Locator;
  readonly revenueChartTile: Locator;
  readonly topProductsTile: Locator;

  constructor(page: Page) {
    super(page);

    // Dashboard controls
    this.viewModeButton = page.locator('[data-testid="view-mode-button"]');
    this.customizeModeButton = page.locator(
      '[data-testid="customize-mode-button"]'
    );
    this.resetDashboardButton = page.locator(
      '[data-testid="reset-dashboard-button"]'
    );
    this.timeframeSelect = page.locator('[data-testid="timeframe-select"]');

    // Dashboard tiles container
    this.dashboardTilesContainer = page.locator(
      '[data-testid="dashboard-tiles-container"]'
    );
    this.tileToolbar = page.locator('[data-testid="tile-toolbar"]');

    // Individual tiles
    this.welcomeTile = page.locator('[data-testid="tile-welcome"]');
    this.todaysSalesTile = page.locator('[data-testid="tile-todays-sales"]');
    this.lowStockTile = page.locator('[data-testid="tile-low-stock"]');
    this.quickLinksTile = page.locator('[data-testid="tile-quick-links"]');
    this.revenueChartTile = page.locator('[data-testid="tile-revenue-chart"]');
    this.topProductsTile = page.locator('[data-testid="tile-top-products"]');
  }

  async goto() {
    await super.goto('/');
  }

  async switchToCustomizeMode() {
    await this.customizeModeButton.click();
  }

  async switchToViewMode() {
    await this.viewModeButton.click();
  }

  async resetDashboard() {
    await this.resetDashboardButton.click();
  }

  async selectTimeframe(
    timeframe: 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'OVERALL'
  ) {
    await this.timeframeSelect.click();
    await this.page.locator(`[data-value="${timeframe}"]`).click();
  }

  async expectDashboardToBeVisible() {
    await expect(this.dashboardTilesContainer).toBeVisible();
  }

  async expectToBeOnHomePage() {
    await this.page.waitForURL('/');
    await this.expectDashboardToBeVisible();
  }

  async getTileCount(): Promise<number> {
    return await this.dashboardTilesContainer
      .locator('[data-testid^="tile-"]')
      .count();
  }

  async addTileFromToolbar(tileType: string) {
    await this.switchToCustomizeMode();
    await this.page.locator(`[data-testid="add-tile-${tileType}"]`).click();
  }

  async removeTile(tileTestId: string) {
    await this.switchToCustomizeMode();
    const tile = this.page.locator(`[data-testid="${tileTestId}"]`);
    await tile.locator('[data-testid="remove-tile-button"]').click();
  }
}
