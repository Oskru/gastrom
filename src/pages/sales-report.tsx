// src/pages/SalesReportPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Snackbar,
  useTheme,
  useMediaQuery,
  Paper,
  Card,
  CardContent,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Chip,
  Divider,
  Stack,
} from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
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
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import {
  useDailySalesData,
  useSalesByPaymentMethod,
  useTransactions,
} from '../hooks/use-transactions';
import MainContainer from '../components/main-container.tsx';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`sales-tabpanel-${index}`}
      aria-labelledby={`sales-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AA336A',
  '#663399',
  '#82CA9D',
  '#8884D8',
];

const SalesReportPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState<string>('7');

  // Use Material UI hooks for responsiveness
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch data using our custom hooks
  const {
    data: dailySalesData = [],
    isLoading: loadingDailySales,
    refetch: refetchDailySales,
  } = useDailySalesData();

  const {
    data: paymentMethodData = [],
    isLoading: loadingPaymentMethodData,
    refetch: refetchPaymentMethods,
  } = useSalesByPaymentMethod();

  const {
    data: transactions = [],
    isLoading: loadingTransactions,
    refetch: refetchTransactions,
  } = useTransactions();

  // Filter daily sales data based on selected time range
  const filteredDailySalesData = React.useMemo(() => {
    const days = parseInt(timeRange);
    if (days > 0 && dailySalesData.length > 0) {
      return dailySalesData.slice(-days);
    }
    return dailySalesData;
  }, [dailySalesData, timeRange]);

  // Calculate total sales
  const totalSales = transactions.reduce((sum, tx) => sum + tx.totalAmount, 0);

  // Sales by weekday data
  const salesByWeekday = React.useMemo(() => {
    const weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const weekdaySales: Record<string, number> = {
      Sunday: 0,
      Monday: 0,
      Tuesday: 0,
      Wednesday: 0,
      Thursday: 0,
      Friday: 0,
      Saturday: 0,
    };

    transactions.forEach(tx => {
      const date = new Date(tx.date);
      const weekday = weekdays[date.getDay()];
      weekdaySales[weekday] += tx.totalAmount;
    });

    return Object.entries(weekdaySales).map(([day, total]) => ({
      day,
      total,
    }));
  }, [transactions]);

  // Monthly sales data
  const monthlySalesData = React.useMemo(() => {
    const monthlyMap: Record<string, number> = {};

    transactions.forEach(tx => {
      const month = tx.date.substring(0, 7); // YYYY-MM format
      monthlyMap[month] = (monthlyMap[month] || 0) + tx.totalAmount;
    });

    return Object.entries(monthlyMap)
      .map(([month, amount]) => ({
        month,
        amount,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  // Top transactions
  const topTransactions = React.useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 5);
  }, [transactions]);

  // Handle time range change
  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value);
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Refresh all data
  const refreshData = () => {
    refetchDailySales();
    refetchPaymentMethods();
    refetchTransactions();
    setSnackbarMsg('Sales data refreshed successfully');
  };

  return (
    <MainContainer title='Sales Reports'>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={9}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor='primary'
            indicatorColor='primary'
            aria-label='sales report tabs'
          >
            <Tab label='Overview' />
            <Tab label='Time Analysis' />
            <Tab label='Payment Methods' />
            <Tab label='Top Sales' />
          </Tabs>
        </Grid>
        <Grid item xs={12} md={3}>
          <Box display='flex' justifyContent='flex-end'>
            <Button
              variant='contained'
              color='primary'
              onClick={refreshData}
              sx={{ mb: 1 }}
            >
              Refresh Data
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Loading Indicator */}
      {(loadingDailySales ||
        loadingPaymentMethodData ||
        loadingTransactions) && (
        <Box display='flex' justifyContent='center' my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Overview Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Sales Summary Cards */}
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Total Sales
                    </Typography>
                    <Typography variant='h4' color='primary'>
                      ${totalSales.toFixed(2)}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {transactions.length} transactions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Average Sale
                    </Typography>
                    <Typography variant='h4' color='primary'>
                      ${(totalSales / (transactions.length || 1)).toFixed(2)}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Per transaction
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Payment Methods
                    </Typography>
                    <Typography variant='h4' color='primary'>
                      {paymentMethodData.length}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Different methods used
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant='h6' gutterBottom>
                      Highest Sale
                    </Typography>
                    <Typography variant='h4' color='primary'>
                      ${topTransactions[0]?.totalAmount.toFixed(2) || '0.00'}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Single transaction
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          {/* Recent Sales Trend */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mb={2}
              >
                <Typography variant='h6'>Recent Sales Trend</Typography>
                <FormControl sx={{ minWidth: 120 }} size='small'>
                  <InputLabel id='time-range-label'>Time Range</InputLabel>
                  <Select
                    labelId='time-range-label'
                    id='time-range-select'
                    value={timeRange}
                    label='Time Range'
                    onChange={handleTimeRangeChange}
                  >
                    <MenuItem value='7'>Last 7 Days</MenuItem>
                    <MenuItem value='14'>Last 14 Days</MenuItem>
                    <MenuItem value='30'>Last 30 Days</MenuItem>
                    <MenuItem value='90'>Last 90 Days</MenuItem>
                    <MenuItem value='0'>All Time</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <ResponsiveContainer width='100%' height={300}>
                <AreaChart
                  data={filteredDailySalesData}
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
                  <Area
                    type='monotone'
                    dataKey='total'
                    stroke={theme.palette.primary.main}
                    fill={theme.palette.primary.light}
                    activeDot={{ r: 8 }}
                    name='Sales'
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Payment Methods Pie Chart */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant='h6' gutterBottom>
                Sales by Payment Method
              </Typography>
              {paymentMethodData.length > 0 ? (
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      dataKey='amount'
                      nameKey='method'
                      cx='50%'
                      cy='50%'
                      outerRadius={isSmallScreen ? 80 : 100}
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
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <Typography>No payment data available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Time Analysis Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {/* Sales by Weekday */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Sales by Day of Week
              </Typography>
              <ResponsiveContainer width='100%' height={350}>
                <BarChart
                  data={salesByWeekday}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='day' />
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
                    name='Sales'
                    fill={theme.palette.primary.main}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Monthly Sales */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Monthly Sales
              </Typography>
              <ResponsiveContainer width='100%' height={350}>
                <LineChart
                  data={monthlySalesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <Tooltip
                    formatter={value => [
                      `$${Number(value).toFixed(2)}`,
                      'Sales',
                    ]}
                  />
                  <Legend />
                  <Line
                    type='monotone'
                    dataKey='amount'
                    name='Monthly Sales'
                    stroke={theme.palette.secondary.main}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Hourly Distribution - Using mock data as example */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Sales Performance Analysis
              </Typography>
              <ResponsiveContainer width='100%' height={400}>
                <RadarChart
                  outerRadius={150}
                  width={500}
                  height={400}
                  data={[
                    {
                      subject: 'Monday',
                      A: salesByWeekday[1]?.total || 0,
                      fullMark: Math.max(...salesByWeekday.map(d => d.total)),
                    },
                    {
                      subject: 'Tuesday',
                      A: salesByWeekday[2]?.total || 0,
                      fullMark: Math.max(...salesByWeekday.map(d => d.total)),
                    },
                    {
                      subject: 'Wednesday',
                      A: salesByWeekday[3]?.total || 0,
                      fullMark: Math.max(...salesByWeekday.map(d => d.total)),
                    },
                    {
                      subject: 'Thursday',
                      A: salesByWeekday[4]?.total || 0,
                      fullMark: Math.max(...salesByWeekday.map(d => d.total)),
                    },
                    {
                      subject: 'Friday',
                      A: salesByWeekday[5]?.total || 0,
                      fullMark: Math.max(...salesByWeekday.map(d => d.total)),
                    },
                    {
                      subject: 'Saturday',
                      A: salesByWeekday[6]?.total || 0,
                      fullMark: Math.max(...salesByWeekday.map(d => d.total)),
                    },
                    {
                      subject: 'Sunday',
                      A: salesByWeekday[0]?.total || 0,
                      fullMark: Math.max(...salesByWeekday.map(d => d.total)),
                    },
                  ]}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey='subject' />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                  <Radar
                    name='Sales'
                    dataKey='A'
                    stroke={theme.palette.primary.main}
                    fill={theme.palette.primary.main}
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Payment Methods Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {/* Payment Methods Pie Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Sales by Payment Method
              </Typography>
              <ResponsiveContainer width='100%' height={400}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    dataKey='amount'
                    nameKey='method'
                    cx='50%'
                    cy='50%'
                    outerRadius={150}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                    labelLine={true}
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Payment Methods Breakdown */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Payment Methods Breakdown
              </Typography>
              {paymentMethodData.length > 0 ? (
                <Stack spacing={2}>
                  {paymentMethodData.map((method, index) => (
                    <Box key={index}>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        alignItems='center'
                        mb={1}
                      >
                        <Typography variant='body1' fontWeight='medium'>
                          {method.method}
                        </Typography>
                        <Typography variant='body1' fontWeight='bold'>
                          ${method.amount.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box display='flex' alignItems='center'>
                        <Box
                          sx={{
                            width: '100%',
                            mr: 1,
                            height: 10,
                            borderRadius: 5,
                            bgcolor: 'background.paper',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <Box
                            sx={{
                              width: `${(method.amount / totalSales) * 100}%`,
                              bgcolor: COLORS[index % COLORS.length],
                              height: '100%',
                              borderRadius: 5,
                              transition: 'width 0.5s ease-in-out',
                            }}
                          />
                        </Box>
                        <Typography variant='body2' color='text.secondary'>
                          {((method.amount / totalSales) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      {index < paymentMethodData.length - 1 && (
                        <Divider sx={{ mt: 2 }} />
                      )}
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography>No payment data available</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Top Sales Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {/* Top Transactions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Top Transactions
              </Typography>
              {topTransactions.length > 0 ? (
                <Grid container spacing={2}>
                  {topTransactions.map(tx => (
                    <Grid item xs={12} md={6} key={tx.id}>
                      <Card sx={{ bgcolor: 'background.default' }}>
                        <CardContent>
                          <Typography variant='subtitle1' fontWeight='bold'>
                            Transaction #{tx.id}
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                Amount:
                              </Typography>
                              <Typography
                                variant='h6'
                                color='primary'
                                fontWeight='bold'
                              >
                                ${tx.totalAmount.toFixed(2)}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                Date:
                              </Typography>
                              <Typography variant='body1'>{tx.date}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography
                                variant='body2'
                                color='text.secondary'
                              >
                                Payment Method:
                              </Typography>
                              <Chip
                                label={tx.paymentMethod}
                                color='primary'
                                variant='outlined'
                                size='small'
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography>No transaction data available</Typography>
              )}
            </Paper>
          </Grid>

          {/* Distribution of Sale Amounts */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Distribution of Transaction Amounts
              </Typography>
              <ResponsiveContainer width='100%' height={400}>
                <BarChart
                  data={(() => {
                    // Create buckets for transaction amounts
                    const buckets: Record<string, number> = {
                      '0-25': 0,
                      '25-50': 0,
                      '50-100': 0,
                      '100-200': 0,
                      '200-500': 0,
                      '500+': 0,
                    };

                    transactions.forEach(tx => {
                      if (tx.totalAmount < 25) buckets['0-25']++;
                      else if (tx.totalAmount < 50) buckets['25-50']++;
                      else if (tx.totalAmount < 100) buckets['50-100']++;
                      else if (tx.totalAmount < 200) buckets['100-200']++;
                      else if (tx.totalAmount < 500) buckets['200-500']++;
                      else buckets['500+']++;
                    });

                    return Object.entries(buckets).map(([range, count]) => ({
                      range,
                      count,
                    }));
                  })()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='range' />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey='count'
                    name='Number of Transactions'
                    fill={theme.palette.info.main}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Snackbar Notifications */}
      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg('')}
        message={snackbarMsg}
      />
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={() => setError(null)}
          message={error}
        />
      )}
    </MainContainer>
  );
};

export default SalesReportPage;
