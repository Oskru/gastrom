import Box from '@mui/material/Box';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import SideMenu from './material/SideMenu.tsx';

export default function MainContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />
      <Stack gap={1} padding={3}>
        <Typography variant='h3' sx={{ mb: 5 }}>
          {title}
        </Typography>
        {children}
      </Stack>
    </Box>
  );
}
