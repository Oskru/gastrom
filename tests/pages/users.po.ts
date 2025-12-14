import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.po';

/**
 * Users Management Page Object (Admin only)
 */
export class UsersPage extends BasePage {
  // Page elements
  readonly pageTitle: Locator;
  readonly addUserButton: Locator;
  readonly usersTable: Locator;
  readonly userRows: Locator;

  // Add User Dialog
  readonly userDialog: Locator;
  readonly usernameInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly passwordInput: Locator;
  readonly roleSelect: Locator;
  readonly dialogSubmitButton: Locator;
  readonly dialogCancelButton: Locator;

  // Loading and error states
  readonly loadingIndicator: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);

    // Page elements
    this.pageTitle = page.locator('[data-testid="users-page-title"]');
    this.addUserButton = page.locator('[data-testid="add-user-button"]');
    this.usersTable = page.locator('[data-testid="users-table"]');
    this.userRows = page.locator('[data-testid="user-row"]');

    // Add User Dialog
    this.userDialog = page.locator('[data-testid="user-dialog"]');
    this.usernameInput = page.locator('[data-testid="user-username-input"]');
    this.firstNameInput = page.locator('[data-testid="user-firstname-input"]');
    this.lastNameInput = page.locator('[data-testid="user-lastname-input"]');
    this.passwordInput = page.locator('[data-testid="user-password-input"]');
    this.roleSelect = page.locator('[data-testid="user-role-select"]');
    this.dialogSubmitButton = page.locator(
      '[data-testid="user-dialog-submit"]'
    );
    this.dialogCancelButton = page.locator(
      '[data-testid="user-dialog-cancel"]'
    );

    // Loading and error states
    this.loadingIndicator = page.locator('[data-testid="users-loading"]');
    this.errorAlert = page.locator('[data-testid="users-error"]');
  }

  async goto() {
    await super.goto('/users');
  }

  async expectToBeOnUsersPage() {
    await this.page.waitForURL('/users');
    await expect(
      this.page.getByLabel('breadcrumb').getByText('User Management')
    ).toBeVisible();
  }

  async openAddUserDialog() {
    await this.addUserButton.click();
    await expect(this.userDialog).toBeVisible();
  }

  async fillUserForm(data: {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    role: 'ADMIN' | 'MANAGER';
  }) {
    await this.usernameInput.fill(data.username);
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.passwordInput.fill(data.password);
    await this.roleSelect.click();
    await this.page.locator(`[data-value="${data.role}"]`).click();
  }

  async submitUserForm() {
    await this.dialogSubmitButton.click();
  }

  async cancelUserForm() {
    await this.dialogCancelButton.click();
  }

  async createUser(data: {
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    role: 'ADMIN' | 'MANAGER';
  }) {
    await this.openAddUserDialog();
    await this.fillUserForm(data);
    await this.submitUserForm();
  }

  async deleteUser(username: string) {
    const row = this.page.locator(
      `[data-testid="user-row"]:has-text("${username}")`
    );
    await row.locator('[data-testid="delete-user-button"]').click();
  }

  async getUserCount(): Promise<number> {
    return await this.userRows.count();
  }
}
