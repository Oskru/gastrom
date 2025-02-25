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

const FeedbackPage: React.FC = () => {
  const { user } = useUser();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Pre-fill name and email if user data is available.
  const [name, setName] = useState<string>(
    user ? `${user.firstName} ${user.lastName}` : ''
  );
  const [email, setEmail] = useState<string>(user?.email || '');
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [snackbarMsg, setSnackbarMsg] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const payload = {
        name,
        email,
        subject,
        message,
      };
      await apiInstance.post('/feedback', payload);
      setSnackbarMsg('Feedback submitted successfully.');
      // Optionally clear the subject and message fields.
      setSubject('');
      setMessage('');
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to submit feedback.');
    }
  };

  return (
    <MainContainer title='Feedback'>
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 4 },
          maxWidth: 800,
          mx: 'auto',
        }}
      >
        <Paper sx={{ p: 3 }}>
          <Typography variant={isSmallScreen ? 'h5' : 'h4'} gutterBottom>
            Feedback
          </Typography>
          <Typography variant='body1' gutterBottom>
            We value your feedback. Please let us know your thoughts and
            suggestions.
          </Typography>
          <Box component='form' onSubmit={handleSubmit} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Name'
                  fullWidth
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Email'
                  fullWidth
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Subject'
                  fullWidth
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Message'
                  fullWidth
                  multiline
                  minRows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button type='submit' variant='contained' color='primary'>
                  Submit Feedback
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

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

export default FeedbackPage;
