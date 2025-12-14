import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.po';

/**
 * Sales Reports Page Object
 */
export class SalesReportsPage extends BasePage {
  // Page elements
  readonly pageTitle: Locator;
  readonly createReportButton: Locator;
  readonly reportsTable: Locator;
  readonly reportRows: Locator;

  // Create Report Dialog
  readonly createReportDialog: Locator;
  readonly reportTitleInput: Locator;
  readonly reportFromDateInput: Locator;
  readonly reportToDateInput: Locator;
  readonly dialogSubmitButton: Locator;
  readonly dialogCancelButton: Locator;

  // Loading and error states
  readonly loadingIndicator: Locator;
  readonly errorAlert: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    super(page);

    // Page elements
    this.pageTitle = page.locator('[data-testid="sales-reports-page-title"]');
    this.createReportButton = page.locator(
      '[data-testid="create-report-button"]'
    );
    this.reportsTable = page.locator('[data-testid="reports-table"]');
    this.reportRows = page.locator('[data-testid="report-row"]');

    // Create Report Dialog
    this.createReportDialog = page.locator(
      '[data-testid="create-report-dialog"]'
    );
    this.reportTitleInput = page.locator('[data-testid="report-title-input"]');
    this.reportFromDateInput = page.locator(
      '[data-testid="report-from-date-input"]'
    );
    this.reportToDateInput = page.locator(
      '[data-testid="report-to-date-input"]'
    );
    this.dialogSubmitButton = page.locator(
      '[data-testid="report-dialog-submit"]'
    );
    this.dialogCancelButton = page.locator(
      '[data-testid="report-dialog-cancel"]'
    );

    // Loading and error states
    this.loadingIndicator = page.locator('[data-testid="reports-loading"]');
    this.errorAlert = page.locator('[data-testid="reports-error"]');
    this.emptyState = page.locator('[data-testid="reports-empty"]');
  }

  async goto() {
    await super.goto('/sales-reports');
  }

  async expectToBeOnSalesReportsPage() {
    await this.page.waitForURL('/sales-reports');
    await expect(
      this.page.getByLabel('breadcrumb').getByText('Sales Reports')
    ).toBeVisible();
    // Wait for the page to fully load
    await expect(this.createReportButton).toBeVisible({ timeout: 10000 });
  }

  async openCreateReportDialog() {
    await this.createReportButton.click();
    await expect(this.createReportDialog).toBeVisible();
  }

  async fillReportForm(title: string, fromDate: string, toDate: string) {
    await this.reportTitleInput.fill(title);
    await this.reportFromDateInput.fill(fromDate);
    await this.reportToDateInput.fill(toDate);
  }

  async submitReportForm() {
    await this.dialogSubmitButton.click();
  }

  async cancelReportForm() {
    await this.dialogCancelButton.click();
  }

  async createReport(title: string, fromDate: string, toDate: string) {
    await this.openCreateReportDialog();
    await this.fillReportForm(title, fromDate, toDate);
    await this.submitReportForm();
  }

  async downloadReport(reportTitle: string) {
    const row = this.page.locator(
      `[data-testid="report-row"]:has-text("${reportTitle}")`
    );
    await row.locator('[data-testid="download-report-button"]').click();
  }

  async getReportCount(): Promise<number> {
    return await this.reportRows.count();
  }
}
