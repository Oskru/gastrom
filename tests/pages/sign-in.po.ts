import { Page, Locator, expect } from '@playwright/test';

/**
 * Sign In Page Object
 */
export class SignInPage {
  readonly page: Page;

  // Form elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly loadingSpinner: Locator;

  // Labels and text
  readonly welcomeTitle: Locator;
  readonly subtitle: Locator;

  // Error states
  readonly loginErrorAlert: Locator;
  readonly emailErrorText: Locator;
  readonly passwordErrorText: Locator;

  // Theme toggle
  readonly colorModeSelect: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form elements
    this.emailInput = page.locator('[data-testid="email-input"]');
    this.passwordInput = page.locator('[data-testid="password-input"]');
    this.signInButton = page.locator('[data-testid="sign-in-button"]');
    this.loadingSpinner = page.locator(
      '[data-testid="sign-in-button"] [role="progressbar"]'
    );

    // Labels and text
    this.welcomeTitle = page.locator('[data-testid="sign-in-title"]');
    this.subtitle = page.locator('[data-testid="sign-in-subtitle"]');

    // Error states
    this.loginErrorAlert = page.locator('[data-testid="login-error-alert"]');
    this.emailErrorText = page.locator('#email-helper-text');
    this.passwordErrorText = page.locator('#password-helper-text');

    // Theme toggle
    this.colorModeSelect = page.locator('[data-testid="color-mode-select"]');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async expectToBeOnSignInPage() {
    await expect(this.welcomeTitle).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async expectLoginError() {
    await expect(this.loginErrorAlert).toBeVisible();
  }

  async expectEmailValidationError() {
    await expect(this.emailErrorText).toBeVisible();
  }

  async expectPasswordValidationError() {
    await expect(this.passwordErrorText).toBeVisible();
  }

  async expectNoValidationErrors() {
    await expect(this.emailErrorText).not.toBeVisible();
    await expect(this.passwordErrorText).not.toBeVisible();
  }

  async waitForLoginComplete() {
    // Wait for either redirect to home or error to appear
    await this.page.waitForURL('/', { timeout: 10000 }).catch(() => {});
  }
}
