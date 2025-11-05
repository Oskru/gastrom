import Box from '@mui/material/Box';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SideMenu from './material/SideMenu.tsx';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { alpha } from '@mui/material/styles';

export default function MainContainer({
  title,
  children,
  showTitle = false,
}: {
  title: string;
  children: React.ReactNode | React.ReactNode[];
  showTitle?: boolean;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: theme => theme.palette.background.default,
      }}
    >
      <SideMenu />
      <Stack
        component='main'
        gap={2}
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          overflow: 'auto',
          maxWidth: '100%',
        }}
      >
        {/* Subtle breadcrumb indicator instead of large title */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize='small' />}
          aria-label='breadcrumb'
          sx={{
            mb: showTitle ? 0 : 2,
            opacity: 0.7,
            '& .MuiBreadcrumbs-separator': {
              mx: 0.5,
            },
          }}
        >
          <Typography
            variant='body2'
            sx={{
              fontWeight: 500,
              color: 'text.secondary',
              fontSize: '0.875rem',
            }}
          >
            Gastrom
          </Typography>
          <Typography
            variant='body2'
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              fontSize: '0.875rem',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              backgroundColor: theme =>
                alpha(
                  theme.palette.mode === 'dark' ? '#667eea' : '#764ba2',
                  0.1
                ),
            }}
          >
            {title}
          </Typography>
        </Breadcrumbs>

        {/* Optional large title for pages that need it */}
        {showTitle && (
          <Box
            sx={{
              mb: { xs: 3, sm: 4, md: 5 },
              position: 'relative',
              display: 'inline-block',
            }}
          >
            <Typography
              variant={isMobile ? 'h4' : 'h3'}
              sx={{
                fontWeight: 800,
                background: theme =>
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                pb: 1,
                borderBottom: theme =>
                  `3px solid ${theme.palette.mode === 'dark' ? '#667eea' : '#764ba2'}`,
                display: 'inline-block',
                animation: 'fadeInDown 0.6s ease-out',
                '@keyframes fadeInDown': {
                  '0%': {
                    opacity: 0,
                    transform: 'translateY(-20px)',
                  },
                  '100%': {
                    opacity: 1,
                    transform: 'translateY(0)',
                  },
                },
              }}
            >
              {title}
            </Typography>
          </Box>
        )}

        <Box
          sx={{
            maxWidth: '1400px',
            width: '100%',
            mx: 'auto',
          }}
        >
          {children}
        </Box>
      </Stack>
    </Box>
  );
}
