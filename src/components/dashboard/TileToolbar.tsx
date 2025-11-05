// src/components/dashboard/TileToolbar.tsx
import React from 'react';
import { Box, Paper, Typography, Grid, Chip, Divider } from '@mui/material';
import {
  AttachMoney,
  ShoppingCart,
  CreditCard,
  Inventory,
  PieChart,
  Warning,
  Receipt,
  Add as AddIcon,
} from '@mui/icons-material';
import { DashboardTileType, TILE_DEFINITIONS } from '../../types/dashboard';

interface TileToolbarProps {
  onAddTile: (type: DashboardTileType, width: number) => void;
  existingTileTypes: DashboardTileType[];
}

const getIcon = (iconName: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    AttachMoney: <AttachMoney />,
    ShoppingCart: <ShoppingCart />,
    CreditCard: <CreditCard />,
    Inventory: <Inventory />,
    PieChart: <PieChart />,
    Warning: <Warning />,
    Receipt: <Receipt />,
  };
  return iconMap[iconName] || <AddIcon />;
};

export const TileToolbar: React.FC<TileToolbarProps> = ({
  onAddTile,
  existingTileTypes,
}) => {
  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: 'action.hover',
        border: '2px dashed',
        borderColor: 'primary.main',
      }}
    >
      <Typography variant='h6' gutterBottom>
        Add Tiles to Your Dashboard
      </Typography>
      <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
        Click on a tile to add it to your dashboard. You can add multiple
        instances of the same tile.
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {TILE_DEFINITIONS.map(tile => {
          const isAdded = existingTileTypes.includes(tile.type);
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tile.type}>
              <Paper
                sx={{
                  p: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  border: '2px solid transparent',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-2px)',
                    boxShadow: 3,
                  },
                }}
                onClick={() => onAddTile(tile.type, tile.defaultWidth)}
              >
                <Box display='flex' alignItems='center' mb={1}>
                  <Box
                    sx={{
                      mr: 1,
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {getIcon(tile.icon)}
                  </Box>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    {tile.label}
                  </Typography>
                </Box>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mb: 1 }}
                >
                  {tile.description}
                </Typography>
                <Box
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Chip
                    label={`Width: ${tile.defaultWidth}/12`}
                    size='small'
                    variant='outlined'
                  />
                  {isAdded && (
                    <Chip
                      label='Added'
                      size='small'
                      color='success'
                      variant='outlined'
                    />
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};
