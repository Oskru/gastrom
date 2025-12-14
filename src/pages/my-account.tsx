// src/pages/MyAccountPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Paper,
  Snackbar,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MainContainer from '../components/main-container';
import { apiInstance } from '../utils/api-instance';
import { useUser } from '../hooks/use-user.ts';

const MyAccountPage: React.FC = () => {
  // Get current user data from our custom hook
  const { user } = useUser();

  // State for change password form fields
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');
  const [error, setError] = useState<string>('');

  // For responsiveness
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate that new password and confirmation match
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      // Call the change password endpoint
      await apiInstance.put('/auth/change-password', {
        email: user?.email,
        oldPassword,
        newPassword,
      });
      setSnackbarMsg('Password changed successfully');
      // Clear the form fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Failed to change password'
      );
    }
  };

  return (
    <MainContainer title='Profile information'>
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 4 },
          maxWidth: 800,
          mx: 'auto',
        }}
      >
        {/* User Information Section */}
        <Paper sx={{ p: 3, mb: 4 }} data-testid='user-info-section'>
          <Typography variant={isSmallScreen ? 'h5' : 'h4'} gutterBottom>
            My Account
          </Typography>
          {user ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant='body1' data-testid='user-first-name'>
                  <strong>First Name:</strong> {user.firstName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant='body1' data-testid='user-last-name'>
                  <strong>Last Name:</strong> {user.lastName}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1' data-testid='user-email'>
                  <strong>Email:</strong> {user.email}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant='body1' data-testid='user-role'>
                  <strong>Role:</strong> {user.userRole}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography variant='body1'>
              No user information available.
            </Typography>
          )}
        </Paper>

        {/* Change Password Form */}
        <Paper sx={{ p: 3 }} data-testid='change-password-section'>
          <Typography variant={isSmallScreen ? 'h6' : 'h5'} gutterBottom>
            Change Password
          </Typography>
          <Box component='form' onSubmit={handleChangePassword} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label='Old Password'
                  type='password'
                  fullWidth
                  required
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  inputProps={{ 'data-testid': 'old-password-input' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='New Password'
                  type='password'
                  fullWidth
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  inputProps={{ 'data-testid': 'new-password-input' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Confirm New Password'
                  type='password'
                  fullWidth
                  required
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  inputProps={{ 'data-testid': 'confirm-password-input' }}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant='contained'
                  color='primary'
                  type='submit'
                  data-testid='change-password-button'
                >
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Snackbars for success and error messages */}
        <Snackbar
          open={!!snackbarMsg}
          autoHideDuration={3000}
          onClose={() => setSnackbarMsg('')}
          message={snackbarMsg}
        />
        <Snackbar
          open={!!error}
          autoHideDuration={3000}
          onClose={() => setError('')}
          message={error}
        />
      </Box>
    </MainContainer>
  );
};

export default MyAccountPage;
