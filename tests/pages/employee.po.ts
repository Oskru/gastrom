import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.po';

/**
 * Employees Page Object
 */
export class EmployeePage extends BasePage {
  // Page header
  readonly pageTitle: Locator;

  // Employee table
  readonly employeesTable: Locator;
  readonly employeeRows: Locator;
  readonly addEmployeeButton: Locator;
  readonly clearFilterButton: Locator;

  // Add/Edit Employee Dialog
  readonly employeeDialog: Locator;
  readonly employeeEmailInput: Locator;
  readonly employeeFirstNameInput: Locator;
  readonly employeeLastNameInput: Locator;
  readonly employeePhoneInput: Locator;
  readonly employeeSalaryInput: Locator;
  readonly employeeDialogSubmitButton: Locator;
  readonly employeeDialogCancelButton: Locator;

  // Update Hours Dialog
  readonly hoursDialog: Locator;
  readonly hoursInput: Locator;
  readonly hoursDialogSubmitButton: Locator;
  readonly hoursDialogCancelButton: Locator;

  // Loading and error states
  readonly loadingIndicator: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);

    // Page header
    this.pageTitle = page.locator('[data-testid="employees-page-title"]');

    // Employee table
    this.employeesTable = page.locator('[data-testid="employees-table"]');
    this.employeeRows = page.locator('[data-testid="employee-row"]');
    this.addEmployeeButton = page.locator(
      '[data-testid="add-employee-button"]'
    );
    this.clearFilterButton = page.locator(
      '[data-testid="clear-filter-button"]'
    );

    // Add/Edit Employee Dialog
    this.employeeDialog = page.locator('[data-testid="employee-dialog"]');
    this.employeeEmailInput = page.locator(
      '[data-testid="employee-email-input"]'
    );
    this.employeeFirstNameInput = page.locator(
      '[data-testid="employee-firstname-input"]'
    );
    this.employeeLastNameInput = page.locator(
      '[data-testid="employee-lastname-input"]'
    );
    this.employeePhoneInput = page.locator(
      '[data-testid="employee-phone-input"]'
    );
    this.employeeSalaryInput = page.locator(
      '[data-testid="employee-salary-input"]'
    );
    this.employeeDialogSubmitButton = page.locator(
      '[data-testid="employee-dialog-submit"]'
    );
    this.employeeDialogCancelButton = page.locator(
      '[data-testid="employee-dialog-cancel"]'
    );

    // Update Hours Dialog
    this.hoursDialog = page.locator('[data-testid="hours-dialog"]');
    this.hoursInput = page.locator('[data-testid="hours-input"]');
    this.hoursDialogSubmitButton = page.locator(
      '[data-testid="hours-dialog-submit"]'
    );
    this.hoursDialogCancelButton = page.locator(
      '[data-testid="hours-dialog-cancel"]'
    );

    // Loading and error states
    this.loadingIndicator = page.locator('[data-testid="employees-loading"]');
    this.errorAlert = page.locator('[data-testid="employees-error"]');
  }

  async goto() {
    await super.goto('/employees');
  }

  async expectToBeOnEmployeePage() {
    await this.page.waitForURL('/employees');
    await expect(
      this.page.getByLabel('breadcrumb').getByText('Employee Management')
    ).toBeVisible();
    // Wait for the table to load
    await expect(this.employeesTable).toBeVisible({ timeout: 10000 });
  }

  async openAddEmployeeDialog() {
    await this.addEmployeeButton.click();
    await expect(this.employeeDialog).toBeVisible();
  }

  async fillEmployeeForm(data: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    salary: number;
  }) {
    await this.employeeEmailInput.fill(data.email);
    await this.employeeFirstNameInput.fill(data.firstName);
    await this.employeeLastNameInput.fill(data.lastName);
    if (data.phone) {
      await this.employeePhoneInput.fill(data.phone);
    }
    await this.employeeSalaryInput.fill(data.salary.toString());
  }

  async submitEmployeeForm() {
    await this.employeeDialogSubmitButton.click();
  }

  async cancelEmployeeForm() {
    await this.employeeDialogCancelButton.click();
  }

  async createEmployee(data: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    salary: number;
  }) {
    await this.openAddEmployeeDialog();
    await this.fillEmployeeForm(data);
    await this.submitEmployeeForm();
  }

  async updateEmployeeHours(employeeName: string, hours: number) {
    const row = this.page.locator(
      `[data-testid="employee-row"]:has-text("${employeeName}")`
    );
    await row.locator('[data-testid="update-hours-button"]').click();
    await expect(this.hoursDialog).toBeVisible();
    await this.hoursInput.fill(hours.toString());
    await this.hoursDialogSubmitButton.click();
  }

  async generateSalary(employeeName: string) {
    const row = this.page.locator(
      `[data-testid="employee-row"]:has-text("${employeeName}")`
    );
    await row.locator('[data-testid="generate-salary-button"]').click();
  }

  async deleteEmployee(employeeName: string) {
    const row = this.page.locator(
      `[data-testid="employee-row"]:has-text("${employeeName}")`
    );
    await row.locator('[data-testid="delete-employee-button"]').click();
  }

  async clearFilter() {
    await this.clearFilterButton.click();
  }

  async getEmployeeCount(): Promise<number> {
    return await this.employeeRows.count();
  }

  async expectEmployeeInTable(name: string) {
    await expect(
      this.page.locator(`[data-testid="employee-row"]:has-text("${name}")`)
    ).toBeVisible();
  }
}
