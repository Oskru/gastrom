// src/pages/AboutPage.tsx
import React from 'react';
import { Box, Grid, Typography, useTheme, useMediaQuery } from '@mui/material';
import MainContainer from '../components/main-container';

const AboutPage: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MainContainer title='About'>
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 4 },
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        <Grid container spacing={4}>
          {/* About Our Application */}
          <Grid item xs={12}>
            <Typography variant={isSmallScreen ? 'h5' : 'h4'} gutterBottom>
              About Our Application
            </Typography>
            <Typography variant='body1'>
              Welcome to our comprehensive Cafe & Restaurant Management System.
              This application is designed to streamline your daily operations –
              from managing inventory and employees to processing transactions
              and analyzing sales data. Our goal is to empower managers with the
              tools necessary for informed decision making, improved efficiency,
              and enhanced customer service.
            </Typography>
          </Grid>

          {/* Features Section */}
          <Grid item xs={12}>
            <Typography variant={isSmallScreen ? 'h6' : 'h5'} gutterBottom>
              Features
            </Typography>
            <Typography variant='body1' component='div'>
              <ul style={{ paddingLeft: 16 }}>
                <li>
                  <strong>Inventory Management:</strong> Easily track products,
                  stock levels, pricing, and manage product categories.
                </li>
                <li>
                  <strong>Employee Management:</strong> CRUD operations for
                  employees with role-based access control.
                </li>
                <li>
                  <strong>Transaction Processing:</strong> Record and view
                  detailed sales transactions.
                </li>
                <li>
                  <strong>Sales Reporting:</strong> Visualize daily sales
                  trends, payment methods, and performance insights through
                  interactive charts.
                </li>
                <li>
                  <strong>User Authentication:</strong> Secure login and access
                  management to protect your data.
                </li>
              </ul>
            </Typography>
          </Grid>

          {/* Mission Section */}
          <Grid item xs={12}>
            <Typography variant={isSmallScreen ? 'h6' : 'h5'} gutterBottom>
              Our Mission
            </Typography>
            <Typography variant='body1'>
              Our mission is to simplify the complex world of cafe and
              restaurant management. We strive to provide a user-friendly,
              robust, and efficient platform that helps managers reduce waste,
              optimize resources, and boost overall profitability.
            </Typography>
          </Grid>

          {/* Contact Section */}
          <Grid item xs={12}>
            <Typography variant={isSmallScreen ? 'h6' : 'h5'} gutterBottom>
              Contact Us
            </Typography>
            <Typography variant='body1'>
              If you have any questions or need support, please contact our team
              at <a href='mailto:support@gastrom.com'>support@gastrom.com</a>.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </MainContainer>
  );
};

export default AboutPage;
