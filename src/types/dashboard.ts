// Dashboard customization types

export type DashboardTileType =
  | 'total-sales'
  | 'total-orders'
  | 'avg-order-value'
  | 'low-stock-alert'
  | 'payment-methods'
  | 'low-stock-items'
  | 'recent-transactions'
  | 'highest-order'
  | 'total-profit'
  | 'total-expense'
  | 'ingredient-costs'
  | 'fixed-costs'
  | 'cash-income'
  | 'card-income'
  | 'transaction-count'
  | 'last-transaction'
  | 'avg-margin'
  | 'avg-items-per-order'
  | 'top-products-revenue'
  | 'top-products-units';

export interface DashboardTile {
  id: string;
  type: DashboardTileType;
  width: number; // Grid width (1-12)
}

export interface DashboardConfig {
  tiles: DashboardTile[];
  version: number; // For future migration compatibility
}

export interface TileDefinition {
  type: DashboardTileType;
  label: string;
  description: string;
  defaultWidth: number;
  icon: string;
}

// Available tile definitions
export const TILE_DEFINITIONS: TileDefinition[] = [
  {
    type: 'total-sales',
    label: 'Total Sales',
    description: 'Total revenue for selected period',
    defaultWidth: 3,
    icon: 'AttachMoney',
  },
  {
    type: 'total-orders',
    label: 'Total Orders',
    description: 'Number of orders for selected period',
    defaultWidth: 3,
    icon: 'ShoppingCart',
  },
  {
    type: 'avg-order-value',
    label: 'Average Order Value',
    description: 'Overall average order value',
    defaultWidth: 3,
    icon: 'CreditCard',
  },
  {
    type: 'highest-order',
    label: 'Highest Order',
    description: 'Highest single order value',
    defaultWidth: 3,
    icon: 'TrendingUp',
  },
  {
    type: 'total-profit',
    label: 'Total Profit',
    description: 'Revenue minus expenses',
    defaultWidth: 3,
    icon: 'ShowChart',
  },
  {
    type: 'total-expense',
    label: 'Total Expenses',
    description: 'Sum of all costs',
    defaultWidth: 3,
    icon: 'MoneyOff',
  },
  {
    type: 'ingredient-costs',
    label: 'Ingredient Costs',
    description: 'Total cost of ingredients',
    defaultWidth: 3,
    icon: 'Kitchen',
  },
  {
    type: 'fixed-costs',
    label: 'Fixed Costs',
    description: 'Total fixed operational costs',
    defaultWidth: 3,
    icon: 'Business',
  },
  {
    type: 'cash-income',
    label: 'Cash Income',
    description: 'Revenue from cash payments',
    defaultWidth: 3,
    icon: 'LocalAtm',
  },
  {
    type: 'card-income',
    label: 'Card Income',
    description: 'Revenue from card payments',
    defaultWidth: 3,
    icon: 'CreditCard',
  },
  {
    type: 'transaction-count',
    label: 'Transaction Count',
    description: 'Total number of transactions',
    defaultWidth: 3,
    icon: 'Receipt',
  },
  {
    type: 'last-transaction',
    label: 'Last Transaction',
    description: 'Time of most recent sale',
    defaultWidth: 3,
    icon: 'Schedule',
  },
  {
    type: 'avg-margin',
    label: 'Average Margin',
    description: 'Avg profit margin per transaction',
    defaultWidth: 3,
    icon: 'Percent',
  },
  {
    type: 'avg-items-per-order',
    label: 'Avg Items Per Order',
    description: 'Average items in each order',
    defaultWidth: 3,
    icon: 'ShoppingBasket',
  },
  {
    type: 'low-stock-alert',
    label: 'Low Stock Alert',
    description: 'Count of items running low',
    defaultWidth: 3,
    icon: 'Inventory',
  },
  {
    type: 'payment-methods',
    label: 'Payment Methods',
    description: 'Distribution of payment types',
    defaultWidth: 6,
    icon: 'PieChart',
  },
  {
    type: 'top-products-revenue',
    label: 'Top Products (Revenue)',
    description: 'Best selling products by revenue',
    defaultWidth: 6,
    icon: 'BarChart',
  },
  {
    type: 'top-products-units',
    label: 'Top Products (Units)',
    description: 'Best selling products by units',
    defaultWidth: 6,
    icon: 'BarChart',
  },
  {
    type: 'low-stock-items',
    label: 'Low Stock Items',
    description: 'Detailed list of low stock',
    defaultWidth: 12,
    icon: 'Warning',
  },
  {
    type: 'recent-transactions',
    label: 'Recent Transactions',
    description: 'Latest 5 transactions',
    defaultWidth: 12,
    icon: 'Receipt',
  },
];

// Default dashboard configuration
export const DEFAULT_DASHBOARD_CONFIG: DashboardConfig = {
  version: 1,
  tiles: [
    { id: '1', type: 'total-sales', width: 3 },
    { id: '2', type: 'total-orders', width: 3 },
    { id: '3', type: 'avg-order-value', width: 3 },
    { id: '4', type: 'low-stock-alert', width: 3 },
    { id: '7', type: 'recent-transactions', width: 12 },
    { id: '6', type: 'low-stock-items', width: 12 },
  ],
};
