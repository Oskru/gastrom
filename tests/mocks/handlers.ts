// tests/mocks/handlers.ts
// API mock handlers for Playwright tests

import { Page, Route } from '@playwright/test';
import {
  mockEmployees,
  mockIngredients,
  mockLowStockIngredients,
  mockProducts,
  mockFixedCosts,
  mockReports,
  mockStatistics,
  mockExpandedStatistics,
  mockUsers,
  mockProductComponents,
} from './data';

const API_BASE_URL = 'https://management-api-irsm.onrender.com/api/v1';

type MockHandler = (route: Route) => Promise<void>;

interface MockConfig {
  employees?: typeof mockEmployees;
  ingredients?: typeof mockIngredients;
  products?: typeof mockProducts;
  fixedCosts?: typeof mockFixedCosts;
  reports?: typeof mockReports;
  statistics?: typeof mockStatistics;
  expandedStatistics?: typeof mockExpandedStatistics;
  users?: typeof mockUsers;
  lowStockIngredients?: typeof mockIngredients;
}

/**
 * Sets up API mocking for all endpoints.
 * Call this in beforeEach or at the start of each test.
 */
export async function setupApiMocks(
  page: Page,
  config: MockConfig = {}
): Promise<void> {
  const employees = config.employees ?? mockEmployees;
  const ingredients = config.ingredients ?? mockIngredients;
  const products = config.products ?? mockProducts;
  const fixedCosts = config.fixedCosts ?? mockFixedCosts;
  const reports = config.reports ?? mockReports;
  const statistics = config.statistics ?? mockStatistics;
  const expandedStatistics =
    config.expandedStatistics ?? mockExpandedStatistics;
  const users = config.users ?? mockUsers;
  const lowStockIngredients =
    config.lowStockIngredients ?? mockLowStockIngredients;

  // Mock Employees endpoints
  await page.route(`${API_BASE_URL}/employees`, async route => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(employees),
      });
    } else if (method === 'POST') {
      const body = route.request().postDataJSON();
      const newEmployee = {
        id: Date.now(),
        ...body,
        hoursWorked: 0,
      };
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(newEmployee),
      });
    } else {
      await route.continue();
    }
  });

  await page.route(`${API_BASE_URL}/employees/*`, async route => {
    const method = route.request().method();
    if (
      method === 'GET' ||
      method === 'PUT' ||
      method === 'PATCH' ||
      method === 'DELETE'
    ) {
      const url = route.request().url();
      const idMatch = url.match(/\/employees\/(\d+)/);
      const id = idMatch ? parseInt(idMatch[1]) : 1;
      const employee = employees.find(e => e.id === id) ?? employees[0];

      if (method === 'DELETE') {
        await route.fulfill({ status: 204 });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(employee),
        });
      }
    } else {
      await route.continue();
    }
  });

  // Mock Ingredients endpoints
  await page.route(`${API_BASE_URL}/ingredients`, async route => {
    const method = route.request().method();
    const url = new URL(route.request().url());
    const lowStock = url.searchParams.get('lowStock');

    if (method === 'GET') {
      const data = lowStock === 'true' ? lowStockIngredients : ingredients;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data),
      });
    } else if (method === 'POST') {
      const body = route.request().postDataJSON();
      const newIngredient = {
        id: Date.now(),
        ...body,
      };
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(newIngredient),
      });
    } else {
      await route.continue();
    }
  });

  await page.route(`${API_BASE_URL}/ingredients/*`, async route => {
    const method = route.request().method();
    if (method === 'DELETE') {
      await route.fulfill({ status: 204 });
    } else {
      const url = route.request().url();
      const idMatch = url.match(/\/ingredients\/(\d+)/);
      const id = idMatch ? parseInt(idMatch[1]) : 1;
      const ingredient = ingredients.find(i => i.id === id) ?? ingredients[0];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(ingredient),
      });
    }
  });

  // Mock Products endpoints
  await page.route(`${API_BASE_URL}/products`, async route => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(products),
      });
    } else if (method === 'POST') {
      const body = route.request().postDataJSON();
      const newProduct = {
        id: Date.now(),
        ...body,
        productComponentIds: [],
      };
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(newProduct),
      });
    } else {
      await route.continue();
    }
  });

  await page.route(`${API_BASE_URL}/products/*`, async route => {
    const method = route.request().method();
    if (method === 'DELETE') {
      await route.fulfill({ status: 204 });
    } else {
      const url = route.request().url();
      const idMatch = url.match(/\/products\/(\d+)/);
      const id = idMatch ? parseInt(idMatch[1]) : 1;
      const product = products.find(p => p.id === id) ?? products[0];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(product),
      });
    }
  });

  // Mock Product Components endpoint
  await page.route(`${API_BASE_URL}/product-components`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockProductComponents),
    });
  });

  // Mock Fixed Costs endpoints
  await page.route(`${API_BASE_URL}/fixed-costs`, async route => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fixedCosts),
      });
    } else if (method === 'POST') {
      const body = route.request().postDataJSON();
      const newCost = {
        id: Date.now(),
        ...body,
        costType: 'BILLING',
        createdAt: new Date().toISOString(),
      };
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(newCost),
      });
    } else {
      await route.continue();
    }
  });

  await page.route(`${API_BASE_URL}/fixed-costs/*`, async route => {
    const method = route.request().method();
    if (method === 'DELETE') {
      await route.fulfill({ status: 204 });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(fixedCosts[0]),
      });
    }
  });

  // Mock Reports endpoints
  await page.route(`${API_BASE_URL}/reports`, async route => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(reports),
      });
    } else if (method === 'POST') {
      // Return a mock PDF as ArrayBuffer
      const mockPdfContent = 'Mock PDF Content';
      await route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from(mockPdfContent),
      });
    } else {
      await route.continue();
    }
  });

  await page.route(`${API_BASE_URL}/reports/*`, async route => {
    // Return mock PDF for download
    await route.fulfill({
      status: 200,
      contentType: 'application/pdf',
      body: Buffer.from('Mock PDF Content'),
    });
  });

  // Mock Statistics endpoints
  await page.route(`${API_BASE_URL}/statistics`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(statistics),
    });
  });

  await page.route(`${API_BASE_URL}/statistics/expanded`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(expandedStatistics),
    });
  });

  await page.route(`${API_BASE_URL}/statistics/low-stock`, async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(lowStockIngredients),
    });
  });

  // Mock Users endpoints
  await page.route(`${API_BASE_URL}/users`, async route => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(users),
      });
    } else if (method === 'POST') {
      const body = route.request().postDataJSON();
      const newUser = {
        id: Date.now(),
        ...body,
        enabled: true,
      };
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(newUser),
      });
    } else {
      await route.continue();
    }
  });

  await page.route(`${API_BASE_URL}/users/*`, async route => {
    const method = route.request().method();
    if (method === 'DELETE') {
      await route.fulfill({ status: 204 });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(users[0]),
      });
    }
  });

  // Mock Auth endpoints
  await page.route(`${API_BASE_URL}/auth/**`, async route => {
    const url = route.request().url();

    if (url.includes('/change-password')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Password changed successfully' }),
      });
    } else if (url.includes('/authenticate')) {
      // Return a mock JWT token for valid credentials
      const mockToken =
        'eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJhZG1pbiIsImxhc3ROYW1lIjoiYWRtaW4iLCJpZCI6MSwidXNlclJvbGUiOiJBRE1JTiIsInN1YiI6ImFkbWluQGFkbWluLmNvbSIsImlhdCI6MTc2NTcxNDAzNSwiZXhwIjoxOTk5OTk5OTk5fQ.mockSignature';
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ token: mockToken }),
      });
    } else {
      await route.continue();
    }
  });

  // Mock Dashboard Config endpoint (if exists)
  await page.route(`${API_BASE_URL}/dashboard-config**`, async route => {
    const method = route.request().method();
    if (method === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ tiles: [] }),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    }
  });
}

/**
 * Mock a specific endpoint with custom response
 */
export async function mockEndpoint(
  page: Page,
  urlPattern: string | RegExp,
  response: unknown,
  options: { status?: number; method?: string } = {}
): Promise<void> {
  const { status = 200, method } = options;

  await page.route(urlPattern, async route => {
    if (method && route.request().method() !== method) {
      await route.continue();
      return;
    }

    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

/**
 * Mock an endpoint to return an error
 */
export async function mockEndpointError(
  page: Page,
  urlPattern: string | RegExp,
  errorMessage: string = 'Internal Server Error',
  status: number = 500
): Promise<void> {
  await page.route(urlPattern, async route => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error: errorMessage, message: errorMessage }),
    });
  });
}

/**
 * Mock an endpoint with network delay
 */
export async function mockEndpointWithDelay(
  page: Page,
  urlPattern: string | RegExp,
  response: unknown,
  delayMs: number = 1000
): Promise<void> {
  await page.route(urlPattern, async route => {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}
