import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.po';

/**
 * Inventory Page Object
 */
export class InventoryPage extends BasePage {
  // Page header
  readonly pageTitle: Locator;

  // Tabs
  readonly ingredientsTab: Locator;
  readonly productsTab: Locator;

  // Ingredients section
  readonly addIngredientButton: Locator;
  readonly ingredientsTable: Locator;
  readonly ingredientRows: Locator;
  readonly lowStockToggle: Locator;

  // Products section
  readonly addProductButton: Locator;
  readonly productsTable: Locator;
  readonly productRows: Locator;

  // Add Ingredient Dialog
  readonly ingredientDialog: Locator;
  readonly ingredientNameInput: Locator;
  readonly ingredientUnitSelect: Locator;
  readonly ingredientStockInput: Locator;
  readonly ingredientAlertInput: Locator;
  readonly ingredientCostInput: Locator;
  readonly ingredientDialogSubmitButton: Locator;
  readonly ingredientDialogCancelButton: Locator;

  // Add Product Dialog
  readonly productDialog: Locator;
  readonly productNameInput: Locator;
  readonly productPriceInput: Locator;
  readonly productTakeawaySwitch: Locator;
  readonly productDialogSubmitButton: Locator;
  readonly productDialogCancelButton: Locator;

  // Restock Dialog
  readonly restockDialog: Locator;
  readonly restockQuantityInput: Locator;
  readonly restockDialogSubmitButton: Locator;
  readonly restockDialogCancelButton: Locator;

  // Loading and error states
  readonly loadingIndicator: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);

    // Page header
    this.pageTitle = page.locator('[data-testid="inventory-page-title"]');

    // Tabs
    this.ingredientsTab = page.locator('[data-testid="ingredients-tab"]');
    this.productsTab = page.locator('[data-testid="products-tab"]');

    // Ingredients section
    this.addIngredientButton = page.locator(
      '[data-testid="add-ingredient-button"]'
    );
    this.ingredientsTable = page.locator('[data-testid="ingredients-table"]');
    this.ingredientRows = page.locator('[data-testid="ingredient-row"]');
    this.lowStockToggle = page.locator('[data-testid="low-stock-toggle"]');

    // Products section
    this.addProductButton = page.locator('[data-testid="add-product-button"]');
    this.productsTable = page.locator('[data-testid="products-table"]');
    this.productRows = page.locator('[data-testid="product-row"]');

    // Add Ingredient Dialog
    this.ingredientDialog = page.locator('[data-testid="ingredient-dialog"]');
    this.ingredientNameInput = page.locator(
      '[data-testid="ingredient-name-input"]'
    );
    this.ingredientUnitSelect = page.locator(
      '[data-testid="ingredient-unit-select"]'
    );
    this.ingredientStockInput = page.locator(
      '[data-testid="ingredient-stock-input"]'
    );
    this.ingredientAlertInput = page.locator(
      '[data-testid="ingredient-alert-input"]'
    );
    this.ingredientCostInput = page.locator(
      '[data-testid="ingredient-cost-input"]'
    );
    this.ingredientDialogSubmitButton = page.locator(
      '[data-testid="ingredient-dialog-submit"]'
    );
    this.ingredientDialogCancelButton = page.locator(
      '[data-testid="ingredient-dialog-cancel"]'
    );

    // Add Product Dialog
    this.productDialog = page.locator('[data-testid="product-dialog"]');
    this.productNameInput = page.locator('[data-testid="product-name-input"]');
    this.productPriceInput = page.locator(
      '[data-testid="product-price-input"]'
    );
    this.productTakeawaySwitch = page.locator(
      '[data-testid="product-takeaway-switch"]'
    );
    this.productDialogSubmitButton = page.locator(
      '[data-testid="product-dialog-submit"]'
    );
    this.productDialogCancelButton = page.locator(
      '[data-testid="product-dialog-cancel"]'
    );

    // Restock Dialog
    this.restockDialog = page.locator('[data-testid="restock-dialog"]');
    this.restockQuantityInput = page.locator(
      '[data-testid="restock-quantity-input"]'
    );
    this.restockDialogSubmitButton = page.locator(
      '[data-testid="restock-dialog-submit"]'
    );
    this.restockDialogCancelButton = page.locator(
      '[data-testid="restock-dialog-cancel"]'
    );

    // Loading and error states
    this.loadingIndicator = page.locator('[data-testid="inventory-loading"]');
    this.errorAlert = page.locator('[data-testid="inventory-error"]');
  }

  async goto() {
    await super.goto('/inventory');
  }

  async expectToBeOnInventoryPage() {
    await this.page.waitForURL('/inventory');
    await expect(
      this.page.getByLabel('breadcrumb').getByText('Inventory Management')
    ).toBeVisible();
    // Wait for the ingredients content to load (default tab)
    await expect(this.addIngredientButton).toBeVisible({ timeout: 10000 });
  }

  async switchToIngredientsTab() {
    await this.ingredientsTab.click();
    // Wait for the add button to be visible (indicates tab content loaded)
    await expect(this.addIngredientButton).toBeVisible({ timeout: 10000 });
  }

  async switchToProductsTab() {
    await this.productsTab.click();
    // Wait for the add button to be visible (indicates tab content loaded)
    await expect(this.addProductButton).toBeVisible({ timeout: 10000 });
  }

  async toggleLowStockFilter() {
    await this.lowStockToggle.click();
  }

  // Ingredient operations
  async openAddIngredientDialog() {
    await this.addIngredientButton.click();
    await expect(this.ingredientDialog).toBeVisible();
  }

  async fillIngredientForm(data: {
    name: string;
    unit?: string;
    stock: number;
    alertQuantity: number;
    unitCost: number;
  }) {
    await this.ingredientNameInput.fill(data.name);
    if (data.unit) {
      await this.ingredientUnitSelect.click();
      await this.page.locator(`[data-value="${data.unit}"]`).click();
    }
    await this.ingredientStockInput.fill(data.stock.toString());
    await this.ingredientAlertInput.fill(data.alertQuantity.toString());
    await this.ingredientCostInput.fill(data.unitCost.toString());
  }

  async submitIngredientForm() {
    await this.ingredientDialogSubmitButton.click();
  }

  async cancelIngredientForm() {
    await this.ingredientDialogCancelButton.click();
  }

  async createIngredient(data: {
    name: string;
    unit?: string;
    stock: number;
    alertQuantity: number;
    unitCost: number;
  }) {
    await this.openAddIngredientDialog();
    await this.fillIngredientForm(data);
    await this.submitIngredientForm();
  }

  async restockIngredient(ingredientName: string, quantity: number) {
    const row = this.page.locator(
      `[data-testid="ingredient-row"]:has-text("${ingredientName}")`
    );
    await row.locator('[data-testid="restock-button"]').click();
    await expect(this.restockDialog).toBeVisible();
    await this.restockQuantityInput.fill(quantity.toString());
    await this.restockDialogSubmitButton.click();
  }

  async deleteIngredient(ingredientName: string) {
    const row = this.page.locator(
      `[data-testid="ingredient-row"]:has-text("${ingredientName}")`
    );
    await row.locator('[data-testid="delete-ingredient-button"]').click();
  }

  // Product operations
  async openAddProductDialog() {
    await this.addProductButton.click();
    await expect(this.productDialog).toBeVisible();
  }

  async fillProductForm(data: {
    name: string;
    price: number;
    takeaway?: boolean;
  }) {
    await this.productNameInput.fill(data.name);
    await this.productPriceInput.fill(data.price.toString());
    if (data.takeaway) {
      await this.productTakeawaySwitch.click();
    }
  }

  async submitProductForm() {
    await this.productDialogSubmitButton.click();
  }

  async createProduct(data: {
    name: string;
    price: number;
    takeaway?: boolean;
  }) {
    await this.openAddProductDialog();
    await this.fillProductForm(data);
    await this.submitProductForm();
  }

  async deleteProduct(productName: string) {
    const row = this.page.locator(
      `[data-testid="product-row"]:has-text("${productName}")`
    );
    await row.locator('[data-testid="delete-product-button"]').click();
  }

  async getIngredientCount(): Promise<number> {
    return await this.ingredientRows.count();
  }

  async getProductCount(): Promise<number> {
    return await this.productRows.count();
  }
}
