// src/pages/HomePage.tsx
import React from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Snackbar,
  Typography,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  CreditCard as CreditCardIcon,
} from '@mui/icons-material';
import MainContainer from '../components/main-container';
import { useLowStockItems } from '../hooks/use-inventory';
import {
  useTodayTransactions,
  useRecentTransactions,
  useDailySalesData,
  useSalesByPaymentMethod,
  useTransactions,
} from '../hooks/use-transactions';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
];

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [error, setError] = React.useState<string>('');
  const [snackbarMsg, setSnackbarMsg] = React.useState<string>('');

  // Fetch data using our custom hooks
  const {
    data: lowStockItems = [],
    isLoading: loadingInventory,
    refetch: refetchInventory,
  } = useLowStockItems();

  const {
    data: recentTransactions = [],
    isLoading: loadingRecentTransactions,
    refetch: refetchRecentTransactions,
  } = useRecentTransactions(5);

  const {
    totalSalesToday,
    totalTransactionsToday,
    isLoading: loadingTodayTransactions,
  } = useTodayTransactions();

  const { data: dailySalesData = [], isLoading: loadingDailySales } =
    useDailySalesData();

  const {
    data: salesByPaymentMethod = [],
    isLoading: loadingPaymentMethodData,
  } = useSalesByPaymentMethod();

  const { data: allTransactions = [], isLoading: loadingAllTransactions } =
    useTransactions();

  // Calculate some additional metrics
  const totalSales = allTransactions.reduce(
    (sum, tx) => sum + tx.totalAmount,
    0
  );
  const averageOrderValue = totalSales / (allTransactions.length || 1);

  // Get sales for yesterday to calculate trend
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().slice(0, 10);
  const yesterdaySales = allTransactions
    .filter(tx => tx.date === yesterdayString)
    .reduce((sum, tx) => sum + tx.totalAmount, 0);

  const salesTrend = yesterdaySales
    ? ((totalSalesToday - yesterdaySales) / yesterdaySales) * 100
    : 0;

  // Find the most popular payment method
  let mostPopularMethod = { method: 'None', count: 0 };
  const methodCounts: Record<string, number> = {};

  allTransactions.forEach(tx => {
    methodCounts[tx.paymentMethod] = (methodCounts[tx.paymentMethod] || 0) + 1;
    if (methodCounts[tx.paymentMethod] > mostPopularMethod.count) {
      mostPopularMethod = {
        method: tx.paymentMethod,
        count: methodCounts[tx.paymentMethod],
      };
    }
  });

  // Handle refresh of all data
  const refreshDashboard = () => {
    refetchInventory();
    refetchRecentTransactions();
    setSnackbarMsg('Dashboard data refreshed successfully');
  };

  return (
    <MainContainer title='Dashboard'>
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 4 },
          maxWidth: 1400,
          mx: 'auto',
        }}
      >
        {/* Key Metrics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Today's Sales */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display='flex' alignItems='center' mb={2}>
                  <AttachMoneyIcon color='primary' sx={{ mr: 1 }} />
                  <Typography variant='h6' component='div'>
                    Today's Sales
                  </Typography>
                </Box>
                {loadingTodayTransactions ? (
                  <CircularProgress size={24} />
                ) : (
                  <>
                    <Typography variant='h4' color='primary' gutterBottom>
                      ${totalSalesToday.toFixed(2)}
                    </Typography>
                    <Box display='flex' alignItems='center'>
                      {salesTrend > 0 ? (
                        <Chip
                          icon={<TrendingUpIcon />}
                          label={`+${salesTrend.toFixed(1)}%`}
                          color='success'
                          size='small'
                          sx={{ mr: 1 }}
                        />
                      ) : (
                        <Chip
                          icon={<TrendingDownIcon />}
                          label={`${salesTrend.toFixed(1)}%`}
                          color='error'
                          size='small'
                          sx={{ mr: 1 }}
                        />
                      )}
                      <Typography variant='body2' color='text.secondary'>
                        vs yesterday
                      </Typography>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Orders Count */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display='flex' alignItems='center' mb={2}>
                  <ShoppingCartIcon color='primary' sx={{ mr: 1 }} />
                  <Typography variant='h6' component='div'>
                    Today's Orders
                  </Typography>
                </Box>
                {loadingTodayTransactions ? (
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
          </Grid>

          {/* Average Order Value */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display='flex' alignItems='center' mb={2}>
                  <CreditCardIcon color='primary' sx={{ mr: 1 }} />
                  <Typography variant='h6' component='div'>
                    Avg Order Value
                  </Typography>
                </Box>
                {loadingAllTransactions ? (
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
          </Grid>

          {/* Low Stock Alert */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display='flex' alignItems='center' mb={2}>
                  <InventoryIcon color='primary' sx={{ mr: 1 }} />
                  <Typography variant='h6' component='div'>
                    Low Stock Items
                  </Typography>
                </Box>
                {loadingInventory ? (
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
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Sales Chart */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant='h6' gutterBottom>
                Sales Trend (Last 7 Days)
              </Typography>
              {loadingDailySales ? (
                <Box display='flex' justifyContent='center' mt={4}>
                  <CircularProgress />
                </Box>
              ) : dailySalesData.length > 0 ? (
                <ResponsiveContainer width='100%' height={300}>
                  <BarChart
                    data={dailySalesData.slice(-7)}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='date' />
                    <YAxis />
                    <Tooltip
                      formatter={value => [
                        `$${Number(value).toFixed(2)}`,
                        'Sales',
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey='total'
                      fill={theme.palette.primary.main}
                      name='Sales'
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <Typography>No sales data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Payment Methods */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant='h6' gutterBottom>
                Payment Methods
              </Typography>
              {loadingPaymentMethodData ? (
                <Box display='flex' justifyContent='center' mt={4}>
                  <CircularProgress />
                </Box>
              ) : salesByPaymentMethod.length > 0 ? (
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={salesByPaymentMethod}
                      dataKey='amount'
                      nameKey='method'
                      cx='50%'
                      cy='50%'
                      outerRadius={isMobile ? 80 : 100}
                      label={entry => entry.method}
                    >
                      {salesByPaymentMethod.map((_, index) => (
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
              )}
              {mostPopularMethod.method !== 'None' && (
                <Box mt={2}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant='body2'>
                    Most popular: <strong>{mostPopularMethod.method}</strong> (
                    {mostPopularMethod.count} transactions)
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Low Stock Alert Section */}
        {lowStockItems.length > 0 && (
          <Box sx={{ mb: 4 }}>
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
                    <Typography
                      variant='body2'
                      color='text.secondary'
                      gutterBottom
                    >
                      {item.description.substring(0, 60)}
                      {item.description.length > 60 ? '...' : ''}
                    </Typography>
                    <Box display='flex' justifyContent='space-between' mt={1}>
                      <Typography variant='body2'>
                        Current:{' '}
                        <strong>
                          {item.countable
                            ? item.quantity
                            : `${item.weightInGrams}g`}
                        </strong>
                      </Typography>
                      <Typography variant='body2'>
                        Minimum:{' '}
                        <strong>
                          {item.minimalValue + (item.countable ? '' : 'g')}
                        </strong>
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Recent Transactions Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h5' gutterBottom>
            Recent Transactions
          </Typography>
          {loadingRecentTransactions ? (
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
                      <Typography variant='body2'>{tx.date}</Typography>
                    </Box>
                    <Box display='flex' justifyContent='space-between'>
                      <Typography variant='body2' color='text.secondary'>
                        Payment:
                      </Typography>
                      <Chip
                        label={tx.paymentMethod}
                        size='small'
                        color={
                          tx.paymentMethod === 'Credit Card'
                            ? 'primary'
                            : 'default'
                        }
                        variant='outlined'
                      />
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant='body1'>
              No recent transactions found.
            </Typography>
          )}
        </Box>

        {/* Refresh Data Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant='contained' onClick={refreshDashboard}>
            Refresh Dashboard
          </Button>
        </Box>

        {/* Snackbar Notifications */}
        <Snackbar
          open={!!snackbarMsg}
          autoHideDuration={3000}
          onClose={() => setSnackbarMsg('')}
          message={snackbarMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
        {error && (
          <Snackbar
            open={!!error}
            autoHideDuration={3000}
            onClose={() => setError('')}
            message={error}
          />
        )}
      </Box>
    </MainContainer>
  );
};

export default HomePage;
