// Dashboard customization types

export type DashboardTileType =
  | 'today-sales'
  | 'today-orders'
  | 'avg-order-value'
  | 'low-stock-alert'
  | 'payment-methods'
  | 'low-stock-items'
  | 'recent-transactions';

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
    type: 'today-sales',
    label: "Today's Sales",
    description: 'Total revenue for today',
    defaultWidth: 3,
    icon: 'AttachMoney',
  },
  {
    type: 'today-orders',
    label: "Today's Orders",
    description: 'Number of orders today',
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
    { id: '1', type: 'today-sales', width: 3 },
    { id: '2', type: 'today-orders', width: 3 },
    { id: '3', type: 'avg-order-value', width: 3 },
    { id: '4', type: 'low-stock-alert', width: 3 },
    { id: '5', type: 'payment-methods', width: 6 },
    { id: '6', type: 'low-stock-items', width: 12 },
    { id: '7', type: 'recent-transactions', width: 12 },
  ],
};
