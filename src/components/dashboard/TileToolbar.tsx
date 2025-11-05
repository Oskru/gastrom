/**
 * TileToolbar Component
 *
 * Displays available dashboard tiles that can be added to the dashboard.
 * Features:
 * - Grid layout of available tiles with descriptions
 * - Click to add tiles to the dashboard
 * - Hover preview showing live tile rendering in a popover
 * - Visual indication of already-added tiles
 * - Disabled state for tiles that are already on the dashboard
 */
// src/components/dashboard/TileToolbar.tsx
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Divider,
  Popover,
} from '@mui/material';
import {
  AttachMoney,
  ShoppingCart,
  CreditCard,
  Inventory,
  PieChart,
  Warning,
  Receipt,
  Add as AddIcon,
  TrendingUp,
  ShowChart,
  MoneyOff,
  Kitchen,
  Business,
  LocalAtm,
  Schedule,
  Percent,
  ShoppingBasket,
  BarChart,
} from '@mui/icons-material';
import { DashboardTileType, TILE_DEFINITIONS } from '../../types/dashboard';
import { TilePreview } from './TilePreview';
import { StatisticsRange } from '../../schemas/statistics';

interface TileToolbarProps {
  onAddTile: (type: DashboardTileType, width: number) => void;
  existingTileTypes: DashboardTileType[];
  timeframe?: StatisticsRange;
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
    TrendingUp: <TrendingUp />,
    ShowChart: <ShowChart />,
    MoneyOff: <MoneyOff />,
    Kitchen: <Kitchen />,
    Business: <Business />,
    LocalAtm: <LocalAtm />,
    Schedule: <Schedule />,
    Percent: <Percent />,
    ShoppingBasket: <ShoppingBasket />,
    BarChart: <BarChart />,
  };
  return iconMap[iconName] || <AddIcon />;
};

export const TileToolbar: React.FC<TileToolbarProps> = ({
  onAddTile,
  existingTileTypes,
  timeframe = 'OVERALL',
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [previewTileType, setPreviewTileType] =
    useState<DashboardTileType | null>(null);
  const [placement, setPlacement] = useState<'left' | 'right'>('right');
  const hoverTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const isHoveringRef = React.useRef<boolean>(false);

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLElement>,
    tileType: DashboardTileType
  ) => {
    isHoveringRef.current = true;

    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    // Clear any pending open timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const previewWidth = 420; // Approximate preview width including padding

    // Determine if there's enough space on the right
    const spaceOnRight = viewportWidth - rect.right;
    const spaceOnLeft = rect.left;

    // Use left placement if not enough space on right
    if (spaceOnRight < previewWidth && spaceOnLeft > spaceOnRight) {
      setPlacement('left');
    } else {
      setPlacement('right');
    }

    // Add small delay to prevent laggy behavior when moving between tiles
    hoverTimeoutRef.current = setTimeout(() => {
      if (isHoveringRef.current) {
        setAnchorEl(element);
        setPreviewTileType(tileType);
      }
      hoverTimeoutRef.current = null;
    }, 100);
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;

    // Clear timeout if mouse leaves before delay completes
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Don't close immediately to allow moving to preview
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        setAnchorEl(null);
        setPreviewTileType(null);
      }
    }, 150);
  };

  const handlePreviewEnter = () => {
    isHoveringRef.current = true;

    // Cancel any pending close when hovering over preview
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handlePreviewLeave = () => {
    isHoveringRef.current = false;

    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringRef.current) {
        setAnchorEl(null);
        setPreviewTileType(null);
      }
    }, 150);
  };

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const open = Boolean(anchorEl && previewTileType);

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
        Click on a tile to add it to your dashboard. Hover to see a preview.
        Each tile can only be added once.
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
                  cursor: isAdded ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  border: '2px solid transparent',
                  opacity: isAdded ? 0.5 : 1,
                  '&:hover': {
                    borderColor: isAdded ? 'transparent' : 'primary.main',
                    transform: isAdded ? 'none' : 'translateY(-2px)',
                    boxShadow: isAdded ? 0 : 3,
                  },
                }}
                onClick={() =>
                  !isAdded && onAddTile(tile.type, tile.defaultWidth)
                }
                onMouseEnter={e => !isAdded && handleMouseEnter(e, tile.type)}
                onMouseLeave={handleMouseLeave}
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

      {/* Preview Popover */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePreviewLeave}
        disableRestoreFocus
        anchorOrigin={{
          vertical: 'top',
          horizontal: placement,
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: placement === 'right' ? 'left' : 'right',
        }}
        slotProps={{
          paper: {
            onMouseEnter: handlePreviewEnter,
            onMouseLeave: handlePreviewLeave,
            sx: {
              pointerEvents: 'auto',
              ml: placement === 'right' ? 1 : 0,
              mr: placement === 'left' ? 1 : 0,
            },
          },
        }}
        sx={{
          pointerEvents: 'none',
        }}
        // Disable automatic repositioning to maintain our custom logic
        disableScrollLock
      >
        {previewTileType && (
          <TilePreview tileType={previewTileType} timeframe={timeframe} />
        )}
      </Popover>
    </Paper>
  );
};
