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
} from '@mui/icons-material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { useLowStockIngredients } from '../../hooks/use-inventory';
import { useRecentTransactions } from '../../hooks/use-transactions';
import { useStatistics } from '../../hooks/use-statistics';
import { DashboardTileType } from '../../types/dashboard';

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

// Today's Sales Tile
export const TodaySalesTile: React.FC = () => {
  const { data: dailyStats, isLoading } = useStatistics('DAILY');
  const totalSalesToday = dailyStats?.totalRevenue || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <AttachMoneyIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Today's Sales
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                ${totalSalesToday.toFixed(2)}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Total revenue today
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </TileWrapper>
  );
};

// Today's Orders Tile
export const TodayOrdersTile: React.FC = () => {
  const { data: dailyStats, isLoading } = useStatistics('DAILY');
  const totalTransactionsToday = dailyStats?.transactionCount || 0;

  return (
    <TileWrapper>
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Box display='flex' alignItems='center' mb={2}>
            <ShoppingCartIcon color='primary' sx={{ mr: 1 }} />
            <Typography variant='h6' component='div'>
              Today's Orders
            </Typography>
          </Box>
          {isLoading ? (
            <CircularProgress size={24} />
          ) : (
            <>
              <Typography variant='h4' color='primary' gutterBottom>
                {totalTransactionsToday}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Total orders today
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
  const { data: overallStats, isLoading } = useStatistics('OVERALL');
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: overallStats } = useStatistics('OVERALL');

  const paymentMethodData = React.useMemo(() => {
    if (!overallStats) return [];
    const items = [
      { method: 'CASH', amount: overallStats.cashIncome || 0 },
      { method: 'CARD', amount: overallStats.cardIncome || 0 },
    ].filter(i => i.amount > 0);
    return items;
  }, [overallStats]);

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
                  label={entry => entry.method}
                >
                  {paymentMethodData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={value => [
                    `$${Number(value).toFixed(2)}`,
                    'Amount',
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
  const { data: recentTransactions = [], isLoading } = useRecentTransactions(5);

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
            {recentTransactions.map(tx => (
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
            ))}
          </Grid>
        ) : (
          <Typography variant='body1'>No recent transactions found.</Typography>
        )}
      </Box>
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
    case 'today-sales':
      return <TodaySalesTile />;
    case 'today-orders':
      return <TodayOrdersTile />;
    case 'avg-order-value':
      return <AvgOrderValueTile />;
    case 'low-stock-alert':
      return <LowStockAlertTile />;
    case 'payment-methods':
      return <PaymentMethodsTile />;
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
