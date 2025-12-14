import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.po';

/**
 * My Account Page Object
 */
export class MyAccountPage extends BasePage {
  // User info section
  readonly userInfoSection: Locator;
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly email: Locator;
  readonly role: Locator;

  // Change password section
  readonly changePasswordSection: Locator;
  readonly oldPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly changePasswordButton: Locator;

  // Error and success states
  readonly errorAlert: Locator;
  readonly successSnackbar: Locator;

  constructor(page: Page) {
    super(page);

    // User info section
    this.userInfoSection = page.locator('[data-testid="user-info-section"]');
    this.firstName = page.locator('[data-testid="user-first-name"]');
    this.lastName = page.locator('[data-testid="user-last-name"]');
    this.email = page.locator('[data-testid="user-email"]');
    this.role = page.locator('[data-testid="user-role"]');

    // Change password section
    this.changePasswordSection = page.locator(
      '[data-testid="change-password-section"]'
    );
    this.oldPasswordInput = page.locator('[data-testid="old-password-input"]');
    this.newPasswordInput = page.locator('[data-testid="new-password-input"]');
    this.confirmPasswordInput = page.locator(
      '[data-testid="confirm-password-input"]'
    );
    this.changePasswordButton = page.locator(
      '[data-testid="change-password-button"]'
    );

    // Error and success states
    this.errorAlert = page.locator('[data-testid="password-error"]');
    this.successSnackbar = page.locator('.notistack-SnackbarContainer');
  }

  async goto() {
    await super.goto('/account');
  }

  async expectToBeOnMyAccountPage() {
    await this.page.waitForURL('/account');
    await expect(
      this.page.getByLabel('breadcrumb').getByText('Profile information')
    ).toBeVisible();
  }

  async fillChangePasswordForm(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    await this.oldPasswordInput.fill(oldPassword);
    await this.newPasswordInput.fill(newPassword);
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async submitChangePassword() {
    await this.changePasswordButton.click();
  }

  async changePassword(
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    await this.fillChangePasswordForm(
      oldPassword,
      newPassword,
      confirmPassword
    );
    await this.submitChangePassword();
  }

  async expectUserInfo(firstName: string, lastName: string, email: string) {
    await expect(this.page.locator(`text=${firstName}`)).toBeVisible();
    await expect(this.page.locator(`text=${lastName}`)).toBeVisible();
    await expect(this.page.locator(`text=${email}`)).toBeVisible();
  }
}
