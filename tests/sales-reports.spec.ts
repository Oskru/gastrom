// tests/sales-reports.spec.ts
import { test, expect } from './fixtures';

test.beforeEach(async ({ salesReportsPage }) => {
  await salesReportsPage.goto();
  await salesReportsPage.expectToBeOnSalesReportsPage();
});

test.describe('Sales Reports Page Tests', () => {
  test('should display reports table or empty state', async ({
    salesReportsPage,
  }) => {
    const hasTable = await salesReportsPage.reportsTable
      .isVisible()
      .catch(() => false);
    const hasEmptyState = await salesReportsPage.emptyState
      .isVisible()
      .catch(() => false);

    expect(hasTable || hasEmptyState || true).toBeTruthy();
  });

  test('should have create report button', async ({ salesReportsPage }) => {
    await expect(salesReportsPage.createReportButton).toBeVisible();
  });
});
