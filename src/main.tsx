import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/auth-context.tsx';
import { CssBaseline } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import Routes from './routing/routes.tsx';

import AppTheme from './styles/AppTheme.tsx';
import ColorModeSelect from './styles/ColorModeSelect.tsx';

// fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// @ts-expect-error this is resolved
import '@fontsource/inter';

// animations
import './styles/animations.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppTheme>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <CssBaseline enableColorScheme />
          <Routes />
          <ColorModeSelect
            sx={{ position: 'fixed', top: '1rem', right: '1rem' }}
          />
        </SnackbarProvider>
      </AppTheme>
    </AuthProvider>
  </QueryClientProvider>
);
