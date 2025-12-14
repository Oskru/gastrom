// tests/employees.spec.ts
import { test, expect } from './fixtures';

test.beforeEach(async ({ employeePage }) => {
  await employeePage.goto();
  await employeePage.expectToBeOnEmployeePage();
});

test.describe('Employees Page Tests', () => {
  test('should display employees table', async ({ employeePage }) => {
    await expect(employeePage.employeesTable).toBeVisible();
  });

  test('should have add employee button', async ({ employeePage }) => {
    await expect(employeePage.addEmployeeButton).toBeVisible();
  });

  test('should open add employee dialog when button is clicked', async ({
    employeePage,
  }) => {
    await employeePage.openAddEmployeeDialog();

    await expect(employeePage.employeeDialog).toBeVisible();
    await expect(employeePage.employeeFirstNameInput).toBeVisible();
    await expect(employeePage.employeeLastNameInput).toBeVisible();
    await expect(employeePage.employeeEmailInput).toBeVisible();
  });

  test('should close dialog when cancel is clicked', async ({
    employeePage,
  }) => {
    await employeePage.openAddEmployeeDialog();
    await expect(employeePage.employeeDialog).toBeVisible();

    await employeePage.cancelEmployeeForm();

    await expect(employeePage.employeeDialog).not.toBeVisible();
  });
});
