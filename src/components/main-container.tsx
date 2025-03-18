import Box from '@mui/material/Box';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SideMenu from './material/SideMenu.tsx';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function MainContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode | React.ReactNode[];
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
        <Typography
          variant={isMobile ? 'h4' : 'h3'}
          sx={{
            mb: { xs: 3, sm: 4, md: 5 },
            fontWeight: 'bold',
            color: theme => theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
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
