// src/pages/SalesReportPage.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Typography,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { apiInstance } from '../utils/api-instance';
import MainContainer from '../components/main-container.tsx';

// Define a minimal Transaction type based on your endpoint.
interface Transaction {
  id: number;
  totalAmount: number;
  paymentMethod: string;
  date: string; // expected format "YYYY-MM-DD"
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AA336A',
  '#663399',
];

const SalesReportPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');

  // Use Material UI hooks for responsiveness
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch transactions from your backend
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await apiInstance.get<Transaction[]>('/transactions');
      setTransactions(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Aggregate transactions by date (for daily sales)
  const dailySalesMap: Record<string, number> = {};
  transactions.forEach(tx => {
    // Use the transaction date (assuming format "YYYY-MM-DD")
    const date = tx.date;
    if (dailySalesMap[date]) {
      dailySalesMap[date] += tx.totalAmount;
    } else {
      dailySalesMap[date] = tx.totalAmount;
    }
  });
  const dailySalesData = Object.entries(dailySalesMap)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Aggregate transactions by payment method (for the pie chart)
  const paymentMethodMap: Record<string, number> = {};
  transactions.forEach(tx => {
    const method = tx.paymentMethod;
    if (paymentMethodMap[method]) {
      paymentMethodMap[method] += tx.totalAmount;
    } else {
      paymentMethodMap[method] = tx.totalAmount;
    }
  });
  const paymentMethodData = Object.entries(paymentMethodMap).map(
    ([method, amount]) => ({
      method,
      amount,
    })
  );

  return (
    <MainContainer title='Sales statistics'>
      <Button
        variant='contained'
        color='primary'
        onClick={fetchTransactions}
        sx={{ mb: 2 }}
      >
        Refresh Data
      </Button>
      {loading ? (
        <Box display='flex' justifyContent='center' my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {/* Daily Sales Line Chart */}
          <Grid item xs={12} md={6}>
            <Typography variant='h6' gutterBottom>
              Daily Sales
            </Typography>
            <ResponsiveContainer width='100%' height={500} minWidth={500}>
              <LineChart data={dailySalesData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='date' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='total'
                  stroke='#8884d8'
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Grid>

          {/* Sales by Payment Method Pie Chart */}
          <Grid item xs={12} md={6}>
            <Typography variant='h6' gutterBottom>
              Sales by Payment Method
            </Typography>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  dataKey='amount'
                  nameKey='method'
                  cx='50%'
                  cy='50%'
                  outerRadius={isSmallScreen ? 80 : 100}
                  label
                >
                  {paymentMethodData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      )}
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
