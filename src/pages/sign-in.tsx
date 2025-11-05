import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import ColorModeSelect from '../styles/ColorModeSelect.tsx';
import { useAuth } from '../hooks/use-auth.ts';
import { CircularProgress } from '@mui/material';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(5),
  gap: theme.spacing(3),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '480px',
  },
  borderRadius: '24px',
  border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.15)'}`,
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(135deg, rgba(30, 30, 35, 0.95) 0%, rgba(20, 20, 25, 0.98) 100%)'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(250, 250, 252, 0.95) 100%)',
  backdropFilter: 'blur(20px)',
  boxShadow:
    theme.palette.mode === 'dark'
      ? '0 24px 48px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(102, 126, 234, 0.1)'
      : '0 24px 48px rgba(102, 126, 234, 0.12), 0 0 0 1px rgba(102, 126, 234, 0.08)',
  animation: 'scaleIn 0.4s ease-out',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  position: 'relative',
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    background:
      theme.palette.mode === 'dark'
        ? 'radial-gradient(ellipse at 30% 20%, rgba(102, 126, 234, 0.15), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(118, 75, 162, 0.15), transparent 50%), hsl(220, 25%, 8%)'
        : 'radial-gradient(ellipse at 30% 20%, rgba(102, 126, 234, 0.08), transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(118, 75, 162, 0.08), transparent 50%), hsl(220, 30%, 99%)',
    backgroundRepeat: 'no-repeat',
    animation: 'gradient 15s ease infinite',
    backgroundSize: '200% 200%',
  },
}));

export default function SignIn() {
  const [email, setEmail] = React.useState('');
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (validateInputs()) {
      setIsLoggingIn(true);
      await login(email, password)
        .then(({ error }) => {
          if (error) {
            alert('Invalid credentials');
          }
        })
        .finally(() => {
          setIsLoggingIn(false);
        });
    }
  };

  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;

    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value) {
      setPasswordError(true);
      setPasswordErrorMessage('Password is required.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction='column' justifyContent='space-between'>
        <ColorModeSelect
          sx={{ position: 'fixed', top: '1rem', right: '1rem' }}
        />
        <Card variant='outlined'>
          <Typography
            component='h1'
            variant='h4'
            sx={{
              width: '100%',
              fontSize: 'clamp(2rem, 10vw, 2.5rem)',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1,
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            variant='body2'
            color='text.secondary'
            sx={{ mb: 2, fontWeight: 500 }}
          >
            Sign in to continue to your dashboard
          </Typography>
          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor='email'>Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id='email'
                type='email'
                value={email}
                onChange={e => setEmail(e.currentTarget.value)}
                name='email'
                placeholder='your@email.com'
                autoComplete='email'
                autoFocus
                required
                fullWidth
                variant='outlined'
                color={emailError ? 'error' : 'primary'}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor='password'>Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name='password'
                placeholder='••••••'
                type='password'
                onChange={e => setPassword(e.currentTarget.value)}
                value={password}
                id='password'
                autoComplete='current-password'
                autoFocus
                required
                fullWidth
                variant='outlined'
                color={passwordError ? 'error' : 'primary'}
              />
            </FormControl>
            <Button
              type='submit'
              fullWidth
              variant='contained'
              onClick={validateInputs}
            >
              {isLoggingIn ? <CircularProgress size={25} /> : 'Sign in'}
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}></Box>
        </Card>
      </SignInContainer>
    </>
  );
}
