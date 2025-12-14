import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.po';

/**
 * Fixed Costs Page Object
 */
export class FixedCostsPage extends BasePage {
  // Page elements
  readonly pageTitle: Locator;
  readonly addFixedCostButton: Locator;
  readonly fixedCostsTable: Locator;
  readonly fixedCostRows: Locator;
  readonly totalCostsDisplay: Locator;

  // Add Fixed Cost Dialog
  readonly fixedCostDialog: Locator;
  readonly descriptionInput: Locator;
  readonly costInput: Locator;
  readonly dialogSubmitButton: Locator;
  readonly dialogCancelButton: Locator;

  // Loading and error states
  readonly loadingIndicator: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);

    // Page elements
    this.pageTitle = page.locator('[data-testid="fixed-costs-page-title"]');
    this.addFixedCostButton = page.locator(
      '[data-testid="add-fixed-cost-button"]'
    );
    this.fixedCostsTable = page.locator('[data-testid="fixed-costs-table"]');
    this.fixedCostRows = page.locator('[data-testid="fixed-cost-row"]');
    this.totalCostsDisplay = page.locator('[data-testid="total-costs"]');

    // Add Fixed Cost Dialog
    this.fixedCostDialog = page.locator('[data-testid="fixed-cost-dialog"]');
    this.descriptionInput = page.locator(
      '[data-testid="fixed-cost-description-input"]'
    );
    this.costInput = page.locator('[data-testid="fixed-cost-amount-input"]');
    this.dialogSubmitButton = page.locator(
      '[data-testid="fixed-cost-dialog-submit"]'
    );
    this.dialogCancelButton = page.locator(
      '[data-testid="fixed-cost-dialog-cancel"]'
    );

    // Loading and error states
    this.loadingIndicator = page.locator('[data-testid="fixed-costs-loading"]');
    this.errorAlert = page.locator('[data-testid="fixed-costs-error"]');
  }

  async goto() {
    await super.goto('/fixed-costs');
  }

  async expectToBeOnFixedCostsPage() {
    await this.page.waitForURL('/fixed-costs');
    await expect(
      this.page.getByLabel('breadcrumb').getByText('Fixed Costs')
    ).toBeVisible();
    // Wait for the table or add button to load
    await expect(this.addFixedCostButton).toBeVisible({ timeout: 10000 });
  }

  async openAddFixedCostDialog() {
    await this.addFixedCostButton.click();
    await expect(this.fixedCostDialog).toBeVisible();
  }

  async fillFixedCostForm(description: string, cost: number) {
    await this.descriptionInput.fill(description);
    await this.costInput.fill(cost.toString());
  }

  async submitFixedCostForm() {
    await this.dialogSubmitButton.click();
  }

  async cancelFixedCostForm() {
    await this.dialogCancelButton.click();
  }

  async createFixedCost(description: string, cost: number) {
    await this.openAddFixedCostDialog();
    await this.fillFixedCostForm(description, cost);
    await this.submitFixedCostForm();
  }

  async deleteFixedCost(description: string) {
    const row = this.page.locator(
      `[data-testid="fixed-cost-row"]:has-text("${description}")`
    );
    await row.locator('[data-testid="delete-fixed-cost-button"]').click();
  }

  async getFixedCostCount(): Promise<number> {
    return await this.fixedCostRows.count();
  }
}
