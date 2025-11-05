// src/components/dashboard/DashboardTiles.tsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Alert,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  CreditCard as CreditCardIcon,
  TrendingUp as TrendingUpIcon,
  ShowChart as ShowChartIcon,
  MoneyOff as MoneyOffIcon,
  Kitchen as KitchenIcon,
  Business as BusinessIcon,
  LocalAtm as LocalAtmIcon,
  Schedule as ScheduleIcon,
  Percent as PercentIcon,
  ShoppingBasket as ShoppingBasketIcon,
} from '@mui/icons-material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useLowStockIngredients } from '../../hooks/use-inventory';
import { useRecentTransactions } from '../../hooks/use-transactions';
import {
  useStatistics,
  useExpandedStatistics,
} from '../../hooks/use-statistics';
import { useEmployees } from '../../hooks/use-employees';
import { DashboardTileType } from '../../types/dashboard';
import { useTimeframe } from '../../context/timeframe-context';
import { Link as RouterLink } from 'react-router-dom';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
];

interface TileWrapperProps {
  children: React.ReactNode;
}

const TileWrapper: React.FC<TileWrapperProps> = ({ children }) => {
  return <Box sx={{ height: '100%' }}>{children}</Box>;
};

// Total Sales Tile
export const TotalSalesTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: stats, isLoading } = useStatistics(timeframe);
  const totalSales = stats?.totalRevenue || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <AttachMoneyIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Total Sales
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                ${totalSales.toFixed(2)}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Total revenue for selected period
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Total Orders Tile
export const TotalOrdersTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: stats, isLoading } = useStatistics(timeframe);
  const totalTransactions = stats?.transactionCount || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <ShoppingCartIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Total Orders
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                {totalTransactions}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Total orders for selected period
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Average Order Value Tile
export const AvgOrderValueTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: overallStats, isLoading } = useStatistics(timeframe);
  const averageOrderValue = overallStats?.averageOrderValue || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <CreditCardIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Avg Order Value
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                ${averageOrderValue.toFixed(2)}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Overall average
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Low Stock Alert Tile
export const LowStockAlertTile: React.FC = () => {
  const { data: lowStockItems = [], isLoading } = useLowStockIngredients();

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <InventoryIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Low Stock Items
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                {lowStockItems.length}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Items need attention
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Payment Methods Tile
export const PaymentMethodsTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: overallStats } = useStatistics(timeframe);

  const paymentMethodData = React.useMemo(() => {
    if (!overallStats) return [];
    const items = [
      { method: 'CASH', amount: overallStats.cashIncome || 0 },
      { method: 'CARD', amount: overallStats.cardIncome || 0 },
    ].filter(i => i.amount > 0);
    return items;
  }, [overallStats]);

  const renderCustomLabel = (entry: { method?: string }) => {
    return entry.method || '';
  };

  return (
    <TileWrapper>
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant='h6' gutterBottom>
          Payment Methods (Overall)
        </Typography>
        {overallStats ? (
          paymentMethodData.length > 0 ? (
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  dataKey='amount'
                  nameKey='method'
                  cx='50%'
                  cy='50%'
                  outerRadius={isMobile ? 80 : 100}
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {paymentMethodData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `$${Number(value).toFixed(2)}`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Typography>No payment data available</Typography>
            </Box>
          )
        ) : (
          <Box display='flex' justifyContent='center' mt={4}>
            <CircularProgress />
          </Box>
        )}
      </Paper>
    </TileWrapper>
  );
};

// Low Stock Items Detail Tile
export const LowStockItemsTile: React.FC = () => {
  const { data: lowStockItems = [] } = useLowStockIngredients();

  if (lowStockItems.length === 0) {
    return (
      <TileWrapper>
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Low Stock Items
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            All inventory levels are good!
          </Typography>
        </Paper>
      </TileWrapper>
    );
  }

  return (
    <TileWrapper>
      <Box>
        <Alert
          severity='warning'
          sx={{ mb: 2 }}
          action={
            <Button color='inherit' size='small' href='/inventory'>
              View Inventory
            </Button>
          }
        >
          {lowStockItems.length} items are running low on stock and need
          attention
        </Alert>
        <Grid container spacing={2}>
          {lowStockItems.slice(0, 3).map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant='subtitle1' fontWeight='bold'>
                  {item.name}
                </Typography>
                <Typography variant='body2' color='text.secondary' gutterBottom>
                  Unit: {item.unit}
                </Typography>
                <Box display='flex' justifyContent='space-between' mt={1}>
                  <Typography variant='body2'>
                    Current:{' '}
                    <strong>
                      {item.stockQuantity} {item.unit}
                    </strong>
                  </Typography>
                  <Typography variant='body2'>
                    Alert:{' '}
                    <strong>
                      {item.alertQuantity} {item.unit}
                    </strong>
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </TileWrapper>
  );
};

// Recent Transactions Tile
export const RecentTransactionsTile: React.FC = () => {
  const { data: recentTransactions = [], isLoading } = useRecentTransactions(4);
  const { data: employees = [] } = useEmployees();

  // Create a map of employee id to employee data for quick lookup
  const employeeMap = React.useMemo(() => {
    const map = new Map();
    employees.forEach(emp => {
      map.set(emp.id, emp);
    });
    return map;
  }, [employees]);

  const formatTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <TileWrapper>
      <Box>
        <Typography variant='h5' gutterBottom>
          Recent Transactions
        </Typography>
        {isLoading ? (
          <CircularProgress />
        ) : recentTransactions.length > 0 ? (
          <Grid container spacing={2}>
            {recentTransactions.map(tx => {
              const employee = employeeMap.get(tx.employeeId);
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={tx.id}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant='subtitle1' fontWeight='bold'>
                      Transaction #{tx.id}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Box display='flex' justifyContent='space-between' mb={1}>
                      <Typography variant='body2' color='text.secondary'>
                        Amount:
                      </Typography>
                      <Typography variant='body2' fontWeight='bold'>
                        ${tx.totalAmount.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box display='flex' justifyContent='space-between' mb={1}>
                      <Typography variant='body2' color='text.secondary'>
                        Date:
                      </Typography>
                      <Typography variant='body2'>
                        {new Date(tx.dateTime).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box display='flex' justifyContent='space-between' mb={1}>
                      <Typography variant='body2' color='text.secondary'>
                        Time:
                      </Typography>
                      <Typography variant='body2'>
                        {formatTime(tx.dateTime)}
                      </Typography>
                    </Box>
                    <Box mb={1}>
                      <Typography
                        variant='body2'
                        color='text.secondary'
                        gutterBottom
                      >
                        Employee:
                      </Typography>
                      {employee ? (
                        <Typography
                          variant='body2'
                          component={RouterLink}
                          to={`/employees?employeeId=${tx.employeeId}`}
                          sx={{
                            textDecoration: 'none',
                            color: 'primary.main',
                            wordBreak: 'break-word',
                            display: 'block',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          {employee.firstName} {employee.lastName}
                        </Typography>
                      ) : (
                        <Typography variant='body2'>Unknown</Typography>
                      )}
                    </Box>
                    <Box display='flex' justifyContent='space-between'>
                      <Typography variant='body2' color='text.secondary'>
                        Payment:
                      </Typography>
                      <Chip
                        label={tx.paymentMethod}
                        size='small'
                        color={
                          tx.paymentMethod === 'CARD' ? 'primary' : 'default'
                        }
                        variant='outlined'
                      />
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Typography variant='body1'>No recent transactions found.</Typography>
        )}
      </Box>
    </TileWrapper>
  );
};

// Highest Order Tile
export const HighestOrderTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: overallStats, isLoading } = useStatistics(timeframe);
  const highestOrderValue = overallStats?.highestOrderValue || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <TrendingUpIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Highest Order
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                ${highestOrderValue.toFixed(2)}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Highest single order
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Total Profit Tile
export const TotalProfitTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: overallStats, isLoading } = useStatistics(timeframe);
  const totalProfit = overallStats?.totalProfit || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <ShowChartIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Total Profit
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                ${totalProfit.toFixed(2)}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Revenue minus expenses
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Total Expense Tile
export const TotalExpenseTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: overallStats, isLoading } = useStatistics(timeframe);
  const totalExpense = overallStats?.totalExpense || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <MoneyOffIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Total Expenses
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                ${totalExpense.toFixed(2)}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Sum of all costs
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Ingredient Costs Tile
export const IngredientCostsTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: overallStats, isLoading } = useStatistics(timeframe);
  const ingredientCosts = overallStats?.ingredientCosts || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <KitchenIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Ingredient Costs
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                ${ingredientCosts.toFixed(2)}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Total cost of ingredients
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Fixed Costs Tile
export const FixedCostsTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: overallStats, isLoading } = useStatistics(timeframe);
  const fixedCosts = overallStats?.fixedCosts || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <BusinessIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Fixed Costs
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                ${fixedCosts.toFixed(2)}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Total fixed operational costs
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Cash Income Tile
export const CashIncomeTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: overallStats, isLoading } = useStatistics(timeframe);
  const cashIncome = overallStats?.cashIncome || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <LocalAtmIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Cash Income
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                ${cashIncome.toFixed(2)}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Revenue from cash payments
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Card Income Tile
export const CardIncomeTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: overallStats, isLoading } = useStatistics(timeframe);
  const cardIncome = overallStats?.cardIncome || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <CreditCardIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Card Income
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                ${cardIncome.toFixed(2)}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Revenue from card payments
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Transaction Count Tile
export const TransactionCountTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: overallStats, isLoading } = useStatistics(timeframe);
  const transactionCount = overallStats?.transactionCount || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <ShoppingCartIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Total Transactions
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                {transactionCount}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Total number of transactions
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Last Transaction Tile
export const LastTransactionTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: overallStats, isLoading } = useStatistics(timeframe);
  const lastTransactionTime = overallStats?.lastTransactionTime;

  const formattedTime = lastTransactionTime
    ? new Date(lastTransactionTime).toLocaleString()
    : 'N/A';

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <ScheduleIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Last Transaction
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h5' color='primary' gutterBottom>
                {formattedTime}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Most recent sale
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Average Margin Tile
export const AvgMarginTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: expandedStats, isLoading } = useExpandedStatistics(timeframe);
  const avgMargin = expandedStats?.averageMarginPerTransaction || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <PercentIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Avg Margin
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                ${avgMargin.toFixed(2)}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Average profit margin per transaction
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Average Items Per Order Tile
export const AvgItemsPerOrderTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const { data: expandedStats, isLoading } = useExpandedStatistics(timeframe);
  const avgItems = expandedStats?.averageItemsPerTransaction || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <ShoppingBasketIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Avg Items/Order
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                {avgItems.toFixed(1)}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Average items per order
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Top Products Revenue Tile (Bar Chart)
export const TopProductsRevenueTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: expandedStats, isLoading } = useExpandedStatistics(timeframe);

  const revenueData = React.useMemo(() => {
    if (!expandedStats?.revenuePerProduct) return [];
    return Object.entries(expandedStats.revenuePerProduct)
      .map(([productId, amount]) => ({
        productId,
        amount,
        name: `Product ${productId}`,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }, [expandedStats]);

  const renderCustomLabel = (entry: { name?: string }) => {
    if (!entry.name) return '';
    // Remove "Product " prefix
    const cleanName = entry.name.replace(/^Product\s+/, '');
    // Truncate if too long (max 12 characters)
    return cleanName.length > 12
      ? `${cleanName.substring(0, 12)}...`
      : cleanName;
  };

  return (
    <TileWrapper>
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant='h6' gutterBottom>
          Top Products by Revenue
        </Typography>
        {isLoading ? (
          <Box display='flex' justifyContent='center' mt={4}>
            <CircularProgress />
          </Box>
        ) : revenueData.length > 0 ? (
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={revenueData}
                dataKey='amount'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={isMobile ? 80 : 100}
                label={renderCustomLabel}
                labelLine={false}
              >
                {revenueData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `$${Number(value).toFixed(2)}`,
                  String(name).replace(/^Product\s+/, ''),
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Typography>No product revenue data available</Typography>
          </Box>
        )}
      </Paper>
    </TileWrapper>
  );
};

// Top Products Units Tile (Bar Chart)
export const TopProductsUnitsTile: React.FC = () => {
  const { timeframe } = useTimeframe();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: expandedStats, isLoading } = useExpandedStatistics(timeframe);

  const unitsData = React.useMemo(() => {
    if (!expandedStats?.unitsSoldPerProduct) return [];
    return Object.entries(expandedStats.unitsSoldPerProduct)
      .map(([productId, units]) => ({
        productId,
        units,
        name: `Product ${productId}`,
      }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 10);
  }, [expandedStats]);

  const renderCustomLabel = (entry: { name?: string }) => {
    if (!entry.name) return '';
    // Remove "Product " prefix
    const cleanName = entry.name.replace(/^Product\s+/, '');
    // Truncate if too long (max 12 characters)
    return cleanName.length > 12
      ? `${cleanName.substring(0, 12)}...`
      : cleanName;
  };

  return (
    <TileWrapper>
      <Paper sx={{ p: 3, height: '100%' }}>
        <Typography variant='h6' gutterBottom>
          Top Products by Units Sold
        </Typography>
        {isLoading ? (
          <Box display='flex' justifyContent='center' mt={4}>
            <CircularProgress />
          </Box>
        ) : unitsData.length > 0 ? (
          <ResponsiveContainer width='100%' height={300}>
            <PieChart>
              <Pie
                data={unitsData}
                dataKey='units'
                nameKey='name'
                cx='50%'
                cy='50%'
                outerRadius={isMobile ? 80 : 100}
                label={renderCustomLabel}
                labelLine={false}
              >
                {unitsData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `${value} units`,
                  String(name).replace(/^Product\s+/, ''),
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Typography>No product units data available</Typography>
          </Box>
        )}
      </Paper>
    </TileWrapper>
  );
};

// Tile Factory - returns the correct tile component based on type
interface DashboardTileProps {
  type: DashboardTileType;
}

export const DashboardTileComponent: React.FC<DashboardTileProps> = ({
  type,
}) => {
  switch (type) {
    case 'total-sales':
      return <TotalSalesTile />;
    case 'total-orders':
      return <TotalOrdersTile />;
    case 'avg-order-value':
      return <AvgOrderValueTile />;
    case 'highest-order':
      return <HighestOrderTile />;
    case 'total-profit':
      return <TotalProfitTile />;
    case 'total-expense':
      return <TotalExpenseTile />;
    case 'ingredient-costs':
      return <IngredientCostsTile />;
    case 'fixed-costs':
      return <FixedCostsTile />;
    case 'cash-income':
      return <CashIncomeTile />;
    case 'card-income':
      return <CardIncomeTile />;
    case 'transaction-count':
      return <TransactionCountTile />;
    case 'last-transaction':
      return <LastTransactionTile />;
    case 'avg-margin':
      return <AvgMarginTile />;
    case 'avg-items-per-order':
      return <AvgItemsPerOrderTile />;
    case 'low-stock-alert':
      return <LowStockAlertTile />;
    case 'payment-methods':
      return <PaymentMethodsTile />;
    case 'top-products-revenue':
      return <TopProductsRevenueTile />;
    case 'top-products-units':
      return <TopProductsUnitsTile />;
    case 'low-stock-items':
      return <LowStockItemsTile />;
    case 'recent-transactions':
      return <RecentTransactionsTile />;
    default:
      return (
        <Paper sx={{ p: 2 }}>
          <Typography>Unknown tile type: {type}</Typography>
        </Paper>
      );
  }
};
