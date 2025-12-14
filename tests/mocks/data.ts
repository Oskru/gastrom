// tests/mocks/data.ts
// Mock data for API responses in tests

import type { EmployeeDto } from '../../src/schemas/employee';
import type { IngredientDto } from '../../src/schemas/inventory';
import type { ProductDto } from '../../src/schemas/product';
import type { FixedCost } from '../../src/schemas/fixed-cost';
import type { Report } from '../../src/schemas/report';
import type {
  StatisticsDto,
  ExpandedStatisticsDto,
} from '../../src/schemas/statistics';
import type { UserDto } from '../../src/schemas/user';

// Mock Employees
export const mockEmployees: EmployeeDto[] = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+48123456789',
    salaryPerHour: 25.0,
    hoursWorked: 160,
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phoneNumber: '+48987654321',
    salaryPerHour: 30.0,
    hoursWorked: 120,
  },
  {
    id: 3,
    firstName: 'Bob',
    lastName: 'Johnson',
    email: 'bob.johnson@example.com',
    phoneNumber: '+48555666777',
    salaryPerHour: 22.5,
    hoursWorked: 80,
  },
];

// Mock Ingredients
export const mockIngredients: IngredientDto[] = [
  {
    id: 1,
    name: 'Tomatoes',
    unit: 'G',
    stockQuantity: 5000,
    alertQuantity: 1000,
    unitCost: 0.005,
  },
  {
    id: 2,
    name: 'Olive Oil',
    unit: 'ML',
    stockQuantity: 2000,
    alertQuantity: 500,
    unitCost: 0.02,
  },
  {
    id: 3,
    name: 'Pasta',
    unit: 'G',
    stockQuantity: 3000,
    alertQuantity: 800,
    unitCost: 0.008,
  },
  {
    id: 4,
    name: 'Eggs',
    unit: 'PCS',
    stockQuantity: 50,
    alertQuantity: 20,
    unitCost: 0.5,
  },
];

// Mock Low Stock Ingredients
export const mockLowStockIngredients: IngredientDto[] = [
  {
    id: 5,
    name: 'Garlic',
    unit: 'PCS',
    stockQuantity: 5,
    alertQuantity: 10,
    unitCost: 0.3,
  },
];

// Mock Products
export const mockProducts: ProductDto[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    price: 32.99,
    productComponentIds: [1, 2],
    takeaway: true,
  },
  {
    id: 2,
    name: 'Pasta Carbonara',
    price: 28.99,
    productComponentIds: [3, 4],
    takeaway: true,
  },
  {
    id: 3,
    name: 'Caesar Salad',
    price: 24.99,
    productComponentIds: [1],
    takeaway: false,
  },
];

// Mock Fixed Costs
export const mockFixedCosts: FixedCost[] = [
  {
    id: 1,
    description: 'Monthly Rent',
    cost: 5000.0,
    costType: 'BILLING',
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 2,
    description: 'Utilities',
    cost: 800.0,
    costType: 'BILLING',
    createdAt: '2025-01-05T00:00:00Z',
  },
  {
    id: 3,
    description: 'Insurance',
    cost: 350.0,
    costType: 'BILLING',
    createdAt: '2025-01-10T00:00:00Z',
  },
];

// Mock Reports
export const mockReports: Report[] = [
  {
    id: 1,
    fromDate: '2025-01-01',
    toDate: '2025-01-31',
    fileName: 'January_Report_2025.pdf',
    generatedAt: '2025-02-01T10:00:00Z',
  },
  {
    id: 2,
    fromDate: '2025-02-01',
    toDate: '2025-02-28',
    fileName: 'February_Report_2025.pdf',
    generatedAt: '2025-03-01T10:00:00Z',
  },
];

// Mock Statistics
export const mockStatistics: StatisticsDto = {
  highestOrderValue: 156.99,
  averageOrderValue: 45.5,
  cashIncome: 12500.0,
  cardIncome: 18750.0,
  totalRevenue: 31250.0,
  ingredientCosts: 8500.0,
  fixedCosts: 6150.0,
  totalExpense: 14650.0,
  totalProfit: 16600.0,
  transactionCount: 687,
  lastTransactionTime: '2025-12-14T18:30:00Z',
};

// Mock Expanded Statistics
export const mockExpandedStatistics: ExpandedStatisticsDto = {
  ...mockStatistics,
  averageMarginPerTransaction: 24.16,
  averageItemsPerTransaction: 2.3,
  revenuePerProduct: {
    'Margherita Pizza': 12500.0,
    'Pasta Carbonara': 10250.0,
    'Caesar Salad': 8500.0,
  },
  unitsSoldPerProduct: {
    'Margherita Pizza': 379,
    'Pasta Carbonara': 354,
    'Caesar Salad': 340,
  },
};

// Mock Users
export const mockUsers: UserDto[] = [
  {
    id: 1,
    username: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    enabled: true,
    role: 'ADMIN',
  },
  {
    id: 2,
    username: 'manager1',
    firstName: 'John',
    lastName: 'Manager',
    enabled: true,
    role: 'MANAGER',
  },
];

// Mock Current User (decoded from token)
export const mockCurrentUser: UserDto = {
  id: 1,
  username: 'admin@admin.com',
  firstName: 'admin',
  lastName: 'admin',
  enabled: true,
  role: 'ADMIN',
};

// Mock Product Components
export const mockProductComponents = [
  { id: 1, ingredientId: 1, amount: 200 },
  { id: 2, ingredientId: 2, amount: 50 },
  { id: 3, ingredientId: 3, amount: 150 },
  { id: 4, ingredientId: 4, amount: 2 },
];
