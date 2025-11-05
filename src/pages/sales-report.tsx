/**
 * Sales Report Page
 *
 * Statistics-Only Implementation
 * ===============================
 * This page uses ONLY aggregate statistics from /statistics and /statistics/expanded endpoints.
 * Per project requirement: transaction endpoint is restricted to fetching the 5 most recent
 * transactions on the dashboard only. All sales analytics, payment method breakdowns, and
 * product revenue/units data are sourced from pre-calculated statistics endpoints.
 *
 * Features:
 * - Overview tab: Key metrics cards + payment methods pie + top products revenue bar
 * - Payment Methods tab: Detailed pie chart + breakdown with progress bars
 * - Products Revenue tab: Bar chart of top 10 products by revenue
 * - Units Sold tab: Bar chart of top 10 products by units sold
 *
 * Data Sources:
 * - useStatistics('OVERALL'): totalRevenue, transactionCount, averageOrderValue,
 *   highestOrderValue, totalProfit, cashIncome, cardIncome
 * - useExpandedStatistics('OVERALL'): revenuePerProduct, unitsSoldPerProduct
 */
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
  Stack,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import MainContainer from '../components/main-container';
import { useStatistics, useExpandedStatistics } from '../hooks/use-statistics';
import { StatisticsRange } from '../schemas/statistics';

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
  const [tabValue, setTabValue] = useState(0);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [timeframe, setTimeframe] = useState<StatisticsRange>('OVERALL');
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: overallStats, isLoading: loadingOverall } =
    useStatistics(timeframe);
  const { data: expandedStats, isLoading: loadingExpanded } =
    useExpandedStatistics(timeframe);

  const paymentMethodData = React.useMemo(() => {
    if (!overallStats) return [];
    return [
      { method: 'CASH', amount: overallStats.cashIncome || 0 },
      { method: 'CARD', amount: overallStats.cardIncome || 0 },
    ].filter(m => m.amount > 0);
  }, [overallStats]);

  const revenuePerProductData = React.useMemo(() => {
    if (!expandedStats?.revenuePerProduct) return [];
    return Object.entries(expandedStats.revenuePerProduct)
      .map(([productId, amount]) => ({ productId, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  }, [expandedStats]);

  const unitsPerProductData = React.useMemo(() => {
    if (!expandedStats?.unitsSoldPerProduct) return [];
    return Object.entries(expandedStats.unitsSoldPerProduct)
      .map(([productId, units]) => ({ productId, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 10);
  }, [expandedStats]);

  const totalSales = overallStats?.totalRevenue || 0;
  const handleTabChange = (_e: React.SyntheticEvent, v: number) =>
    setTabValue(v);

  return (
    <MainContainer title='Sales Reports'>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor='primary'
            indicatorColor='primary'
          >
            <Tab label='Overview' />
            <Tab label='Payment Methods' />
            <Tab label='Products Revenue' />
            <Tab label='Units Sold' />
          </Tabs>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            display='flex'
            justifyContent='flex-end'
            gap={2}
            alignItems='center'
          >
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id='timeframe-select-label'>Timeframe</InputLabel>
              <Select
                labelId='timeframe-select-label'
                id='timeframe-select'
                value={timeframe}
                label='Timeframe'
                onChange={e => setTimeframe(e.target.value as StatisticsRange)}
                size='small'
              >
                <MenuItem value='DAILY'>Daily</MenuItem>
                <MenuItem value='WEEKLY'>Weekly</MenuItem>
                <MenuItem value='MONTHLY'>Monthly</MenuItem>
                <MenuItem value='YEARLY'>Yearly</MenuItem>
                <MenuItem value='OVERALL'>Overall</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant='contained'
              color='primary'
              onClick={() => setSnackbarMsg('Statistics refreshed')}
              sx={{ mb: 1 }}
            >
              Refresh Data
            </Button>
          </Box>
        </Grid>
      </Grid>

      {(loadingOverall || loadingExpanded) && (
        <Box display='flex' justifyContent='center' my={4}>
          <CircularProgress />
        </Box>
      )}

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant='h6'>Total Sales</Typography>
                    <Typography variant='h4' color='primary'>
                      ${totalSales.toFixed(2)}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {overallStats?.transactionCount || 0} transactions
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant='h6'>Average Sale</Typography>
                    <Typography variant='h4' color='primary'>
                      ${(overallStats?.averageOrderValue || 0).toFixed(2)}
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
                    <Typography variant='h6'>Highest Sale</Typography>
                    <Typography variant='h4' color='primary'>
                      ${(overallStats?.highestOrderValue || 0).toFixed(2)}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Single transaction
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card>
                  <CardContent>
                    <Typography variant='h6'>Profit</Typography>
                    <Typography variant='h4' color='primary'>
                      ${(overallStats?.totalProfit || 0).toFixed(2)}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Net Profit
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant='h6' gutterBottom>
                Payment Methods (Overall)
              </Typography>
              {paymentMethodData.length ? (
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      dataKey='amount'
                      nameKey='method'
                      cx='50%'
                      cy='50%'
                      outerRadius={isSmallScreen ? 80 : 100}
                      label={e => e.method}
                    >
                      {paymentMethodData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={v => [`$${Number(v).toFixed(2)}`, 'Amount']}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box display='flex' justifyContent='center' p={2}>
                  <Typography>No payment data</Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Top Products by Revenue
              </Typography>
              <ResponsiveContainer width='100%' height={300}>
                <BarChart data={revenuePerProductData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='productId' />
                  <YAxis />
                  <Tooltip
                    formatter={v => [`$${Number(v).toFixed(2)}`, 'Revenue']}
                  />
                  <Legend />
                  <Bar
                    dataKey='amount'
                    name='Revenue'
                    fill={theme.palette.primary.main}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Sales by Payment Method
              </Typography>
              <ResponsiveContainer width='100%' height={350}>
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    dataKey='amount'
                    nameKey='method'
                    cx='50%'
                    cy='50%'
                    outerRadius={130}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(1)}%`
                    }
                  >
                    {paymentMethodData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={v => [`$${Number(v).toFixed(2)}`, 'Amount']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant='h6' gutterBottom>
                Payment Breakdown
              </Typography>
              {paymentMethodData.length ? (
                <Stack spacing={2}>
                  {paymentMethodData.map((m, i) => (
                    <Box key={m.method}>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        mb={0.5}
                      >
                        <Typography>{m.method}</Typography>
                        <Typography fontWeight='bold'>
                          ${m.amount.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          position: 'relative',
                          height: 8,
                          bgcolor: 'background.paper',
                          borderRadius: 4,
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            width: `${(m.amount / totalSales || 0) * 100}%`,
                            bgcolor: COLORS[i % COLORS.length],
                            borderRadius: 4,
                            transition: 'width .4s',
                          }}
                        />
                      </Box>
                      <Typography variant='caption' color='text.secondary'>
                        {((m.amount / totalSales || 0) * 100).toFixed(1)}%
                      </Typography>
                      {i < paymentMethodData.length - 1 && (
                        <Divider sx={{ mt: 1 }} />
                      )}
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography>No payment data</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Top Products by Revenue
          </Typography>
          <ResponsiveContainer width='100%' height={400}>
            <BarChart data={revenuePerProductData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='productId' />
              <YAxis />
              <Tooltip
                formatter={v => [`$${Number(v).toFixed(2)}`, 'Revenue']}
              />
              <Legend />
              <Bar
                dataKey='amount'
                fill={theme.palette.primary.main}
                name='Revenue'
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant='h6' gutterBottom>
            Top Products by Units Sold
          </Typography>
          <ResponsiveContainer width='100%' height={400}>
            <BarChart data={unitsPerProductData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='productId' />
              <YAxis />
              <Tooltip formatter={v => [String(v), 'Units']} />
              <Legend />
              <Bar
                dataKey='units'
                fill={theme.palette.secondary.main}
                name='Units'
              />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </TabPanel>

      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg('')}
        message={snackbarMsg}
      />
    </MainContainer>
  );
};

export default SalesReportPage;
