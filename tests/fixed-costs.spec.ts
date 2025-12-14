// tests/fixed-costs.spec.ts
import { test, expect } from './fixtures';

test.beforeEach(async ({ fixedCostsPage }) => {
  await fixedCostsPage.goto();
  await fixedCostsPage.expectToBeOnFixedCostsPage();
});

test.describe('Fixed Costs Page Tests', () => {
  test('should display fixed costs table', async ({ fixedCostsPage }) => {
    await expect(fixedCostsPage.fixedCostsTable).toBeVisible();
  });

  test('should have add fixed cost button', async ({ fixedCostsPage }) => {
    await expect(fixedCostsPage.addFixedCostButton).toBeVisible();
  });
});
