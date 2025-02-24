// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MainContainer from '../components/main-container';
import { apiInstance } from '../utils/api-instance';
import { InventoryItem } from '../schemas/inventory';

interface Transaction {
  id: number;
  totalAmount: number;
  date: string; // Expected format "YYYY-MM-DD"
  paymentMethod: string;
}

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // States for inventory and transactions data
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loadingInventory, setLoadingInventory] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] =
    useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');

  // Fetch inventory items
  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      const response = await apiInstance.get<InventoryItem[]>('/inventory');
      setInventory(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inventory');
    } finally {
      setLoadingInventory(false);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    try {
      const response = await apiInstance.get<Transaction[]>('/transactions');
      setTransactions(response.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchTransactions();
  }, []);

  const lowStockItems = inventory.filter(item => item.lowStock === true);

  // Sales summary for today
  const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
  const todayTransactions = transactions.filter(tx => tx.date === today);
  const totalSalesToday = todayTransactions.reduce(
    (sum, tx) => sum + tx.totalAmount,
    0
  );
  const totalTransactionsToday = todayTransactions.length;

  // Recent transactions (latest 5)
  const sortedTransactions = [...transactions].sort((a, b) =>
    a.date < b.date ? 1 : -1
  );
  const recentTransactions = sortedTransactions.slice(0, 5);

  // Quick Links for navigation
  const quickLinks = [
    { label: 'Inventory Management', path: '/inventory' },
    { label: 'Employee Management', path: '/employees' },
    { label: 'Sales Reports', path: '/sales-reports' },
    { label: 'My Account', path: '/account' },
  ];

  return (
    <MainContainer title='Dashboard'>
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 4 },
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        {/* Welcome Header */}
        <Typography variant='h4' gutterBottom>
          Welcome Back!
        </Typography>

        {/* Sales Summary Section */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant='h6'>Today's Sales</Typography>
              {loadingTransactions ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <Typography variant='h4' color='primary'>
                    ${totalSalesToday.toFixed(2)}
                  </Typography>
                  <Typography variant='body1'>
                    {totalTransactionsToday} transactions today
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant='h6'>Total Transactions</Typography>
              {loadingTransactions ? (
                <CircularProgress size={24} />
              ) : (
                <Typography variant='h4' color='primary'>
                  {transactions.length}
                </Typography>
              )}
              <Typography variant='body1'>transactions recorded</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Low Stock Items Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h5' gutterBottom>
            Low Stock Items
          </Typography>
          {loadingInventory ? (
            <CircularProgress />
          ) : lowStockItems.length > 0 ? (
            <Grid container spacing={2}>
              {lowStockItems.map(item => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant='subtitle1'>{item.name}</Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {item.description}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Stock:{' '}
                      {item.countable
                        ? item.quantity
                        : `${item.weightInGrams}g`}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant='body1'>
              All inventory levels are healthy!
            </Typography>
          )}
        </Box>

        {/* Recent Transactions Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h5' gutterBottom>
            Recent Transactions
          </Typography>
          {loadingTransactions ? (
            <CircularProgress />
          ) : recentTransactions.length > 0 ? (
            <Grid container spacing={2}>
              {recentTransactions.map(tx => (
                <Grid item xs={12} sm={6} md={4} key={tx.id}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant='subtitle1'>
                      Transaction #{tx.id}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Amount: ${tx.totalAmount.toFixed(2)}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Date: {tx.date}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      Payment: {tx.paymentMethod}
                    </Typography>
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

        {/* Quick Links Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant='h5' gutterBottom>
            Quick Links
          </Typography>
          <Grid container spacing={2}>
            {quickLinks.map((link, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card>
                  <CardActionArea href={link.path}>
                    <CardContent>
                      <Typography variant='h6'>{link.label}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Refresh Data Button */}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button
            variant='contained'
            onClick={() => {
              fetchInventory();
              fetchTransactions();
            }}
          >
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
