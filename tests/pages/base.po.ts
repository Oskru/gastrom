import { Page, Locator } from '@playwright/test';

/**
 * Base Page Object class with common functionality
 */
export class BasePage {
  readonly page: Page;

  // Common navigation selectors
  readonly sideMenu: Locator;
  readonly navHome: Locator;
  readonly navInventory: Locator;
  readonly navEmployees: Locator;
  readonly navFixedCosts: Locator;
  readonly navSalesReports: Locator;
  readonly navUsers: Locator;
  readonly navAbout: Locator;
  readonly navFeedback: Locator;

  // User menu
  readonly userAvatar: Locator;
  readonly optionsMenuButton: Locator;
  readonly myAccountOption: Locator;
  readonly logoutOption: Locator;

  // Common UI elements
  readonly mainContainer: Locator;
  readonly loadingSpinner: Locator;
  readonly snackbar: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation
    this.sideMenu = page.locator('[data-testid="side-menu"]');
    this.navHome = page.locator('[data-testid="nav-home"]');
    this.navInventory = page.locator('[data-testid="nav-inventory"]');
    this.navEmployees = page.locator('[data-testid="nav-employees"]');
    this.navFixedCosts = page.locator('[data-testid="nav-fixed-costs"]');
    this.navSalesReports = page.locator('[data-testid="nav-sales-reports"]');
    this.navUsers = page.locator('[data-testid="nav-users"]');
    this.navAbout = page.locator('[data-testid="nav-about"]');
    this.navFeedback = page.locator('[data-testid="nav-feedback"]');

    // User menu
    this.userAvatar = page.locator('[data-testid="user-avatar"]');
    this.optionsMenuButton = page.locator(
      '[data-testid="options-menu-button"]'
    );
    this.myAccountOption = page.locator(
      '[data-testid="menu-option-my-account"]'
    );
    this.logoutOption = page.locator('[data-testid="menu-option-logout"]');

    // Common elements
    this.mainContainer = page.locator('[data-testid="main-container"]');
    this.loadingSpinner = page.locator('[role="progressbar"]');
    this.snackbar = page.locator('.notistack-SnackbarContainer');
  }

  async goto(path: string = '/') {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  async navigateToHome() {
    await this.navHome.click();
    await this.page.waitForURL('/');
  }

  async navigateToInventory() {
    await this.navInventory.click();
    await this.page.waitForURL('/inventory');
  }

  async navigateToEmployees() {
    await this.navEmployees.click();
    await this.page.waitForURL('/employees');
  }

  async navigateToFixedCosts() {
    await this.navFixedCosts.click();
    await this.page.waitForURL('/fixed-costs');
  }

  async navigateToSalesReports() {
    await this.navSalesReports.click();
    await this.page.waitForURL('/sales-reports');
  }

  async navigateToUsers() {
    await this.navUsers.click();
    await this.page.waitForURL('/users');
  }

  async navigateToAbout() {
    await this.navAbout.click();
    await this.page.waitForURL('/about');
  }

  async navigateToFeedback() {
    await this.navFeedback.click();
    await this.page.waitForURL('/feedback');
  }

  async openOptionsMenu() {
    await this.optionsMenuButton.click();
  }

  async navigateToMyAccount() {
    await this.openOptionsMenu();
    await this.myAccountOption.click();
    await this.page.waitForURL('/account');
  }

  async logout() {
    await this.openOptionsMenu();
    await this.logoutOption.click();
    await this.page.waitForURL(/login/);
  }

  async waitForSnackbar(message?: string) {
    if (message) {
      await this.page
        .locator(`.notistack-SnackbarContainer >> text=${message}`)
        .waitFor();
    } else {
      await this.snackbar.waitFor();
    }
  }

  async getPageTitle(): Promise<string> {
    return (
      (await this.page.locator('[data-testid="page-title"]').textContent()) ||
      ''
    );
  }
}
