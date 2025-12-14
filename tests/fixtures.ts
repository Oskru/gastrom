// tests/fixtures.ts
import { test as base } from '@playwright/test';
import { HomePage } from './pages/home.po';
import { SignInPage } from './pages/sign-in.po';
import { InventoryPage } from './pages/inventory.po';
import { EmployeePage } from './pages/employee.po';
import { MyAccountPage } from './pages/my-account.po';
import { AboutPage } from './pages/about.po';
import { FixedCostsPage } from './pages/fixed-costs.po';
import { SalesReportsPage } from './pages/sales-reports.po';
import { UsersPage } from './pages/users.po';
import { BasePage } from './pages/base.po';
import { setupApiMocks } from './mocks';

// Declare the types for fixtures
type PageFixtures = {
  homePage: HomePage;
  signInPage: SignInPage;
  inventoryPage: InventoryPage;
  employeePage: EmployeePage;
  myAccountPage: MyAccountPage;
  aboutPage: AboutPage;
  fixedCostsPage: FixedCostsPage;
  salesReportsPage: SalesReportsPage;
  usersPage: UsersPage;
  basePage: BasePage;
};

// Base page object fixtures (shared between authenticated and unauthenticated tests)
const pageObjectFixtures = {
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  signInPage: async ({ page }, use) => {
    const signInPage = new SignInPage(page);
    await use(signInPage);
  },

  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  employeePage: async ({ page }, use) => {
    const employeePage = new EmployeePage(page);
    await use(employeePage);
  },

  myAccountPage: async ({ page }, use) => {
    const myAccountPage = new MyAccountPage(page);
    await use(myAccountPage);
  },

  aboutPage: async ({ page }, use) => {
    const aboutPage = new AboutPage(page);
    await use(aboutPage);
  },

  fixedCostsPage: async ({ page }, use) => {
    const fixedCostsPage = new FixedCostsPage(page);
    await use(fixedCostsPage);
  },

  salesReportsPage: async ({ page }, use) => {
    const salesReportsPage = new SalesReportsPage(page);
    await use(salesReportsPage);
  },

  usersPage: async ({ page }, use) => {
    const usersPage = new UsersPage(page);
    await use(usersPage);
  },

  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },
} as const;

// Extend base test with page object fixtures and automatic API mocking
// This is the main test export for authenticated tests with mocked API
export const test = base.extend<PageFixtures & { mockApi: void }>({
  // API mocking fixture - sets up all API mocks before tests
  mockApi: [
    async ({ page }, use) => {
      await setupApiMocks(page);
      await use();
    },
    { auto: true },
  ],

  ...pageObjectFixtures,
});

// Test export for unauthenticated tests (no auto API mocking)
// Use this for auth.spec.ts and error-handling.spec.ts
export const testWithoutMocks = base.extend<PageFixtures>({
  ...pageObjectFixtures,
});

export { expect } from '@playwright/test';

// Re-export mocks for tests that need custom mock data
export {
  setupApiMocks,
  mockEndpoint,
  mockEndpointError,
  mockEndpointWithDelay,
} from './mocks';
export * from './mocks/data';
