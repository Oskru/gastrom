// tests/inventory.spec.ts
import { test, expect } from './fixtures';

test.beforeEach(async ({ inventoryPage }) => {
  await inventoryPage.goto();
  await inventoryPage.expectToBeOnInventoryPage();
});

test.describe('Inventory Page Tests', () => {
  test('should display ingredients tab by default', async ({
    inventoryPage,
  }) => {
    await expect(inventoryPage.ingredientsTab).toBeVisible();
    await expect(inventoryPage.addIngredientButton).toBeVisible();
  });

  test('should switch between ingredients and products tabs', async ({
    inventoryPage,
  }) => {
    await inventoryPage.switchToProductsTab();
    await expect(inventoryPage.addProductButton).toBeVisible();

    await inventoryPage.switchToIngredientsTab();
    await expect(inventoryPage.addIngredientButton).toBeVisible();
  });

  test('should have low stock toggle filter', async ({ inventoryPage }) => {
    await expect(inventoryPage.lowStockToggle).toBeVisible();
  });

  test('should display ingredients table', async ({ inventoryPage }) => {
    // With mocked API, no need for extended timeout
    await expect(inventoryPage.ingredientsTable).toBeVisible();
  });

  test('should display products table when on products tab', async ({
    inventoryPage,
  }) => {
    await inventoryPage.switchToProductsTab();
    // With mocked API, no need for extended timeout
    await expect(inventoryPage.productsTable).toBeVisible();
  });
});
