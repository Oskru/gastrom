/**
 * Home Page (Dashboard)
 *
 * Customizable Dashboard with Drag & Drop
 * =======================================
 * This dashboard allows users to customize their layout by:
 * - Adding/removing tiles from a toolbar
 * - Dragging and dropping tiles to reorder them
 * - Persisting configuration in localStorage
 *
 * Features:
 * - Toggle customize mode to show/hide editing controls
 * - Add tiles from a toolbar
 * - Remove individual tiles
 * - Drag & drop to reorder tiles
 * - Reset to default layout
 * - Automatic save to localStorage
 */
import React, { useState } from 'react';
import {
  Box,
  Button,
  Grid,
  Snackbar,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  RestartAlt as RestartAltIcon,
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import MainContainer from '../components/main-container';
import { useDashboardConfig } from '../hooks/use-dashboard-config';
import { TileToolbar } from '../components/dashboard/TileToolbar';
import { SortableTile } from '../components/dashboard/SortableTile';
import { DashboardTileType } from '../types/dashboard';
import { StatisticsRange } from '../schemas/statistics';
import { TimeframeContext } from '../context/timeframe-context';

const HomePage: React.FC = () => {
  const [isCustomizeMode, setIsCustomizeMode] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [timeframe, setTimeframe] = useState<StatisticsRange>('OVERALL');

  const { config, addTile, removeTile, updateTileOrder, resetToDefault } =
    useDashboardConfig();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = config.tiles.findIndex(tile => tile.id === active.id);
      const newIndex = config.tiles.findIndex(tile => tile.id === over.id);

      const newTiles = arrayMove(config.tiles, oldIndex, newIndex);
      updateTileOrder(newTiles);
    }
  };

  const handleAddTile = (type: DashboardTileType, width: number) => {
    addTile(type, width);
    setSnackbarMsg(`Tile added to dashboard`);
  };

  const handleRemoveTile = (id: string) => {
    removeTile(id);
    setSnackbarMsg('Tile removed from dashboard');
  };

  const handleResetDashboard = () => {
    resetToDefault();
    setSnackbarMsg('Dashboard reset to default layout');
  };

  const existingTileTypes = config.tiles.map(tile => tile.type);

  return (
    <MainContainer title='Dashboard'>
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 2, md: 4 },
          maxWidth: 1400,
          mx: 'auto',
        }}
      >
        {/* Control Bar */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
              value={isCustomizeMode ? 'edit' : 'view'}
              exclusive
              onChange={(_, value) => {
                if (value !== null) {
                  setIsCustomizeMode(value === 'edit');
                }
              }}
              aria-label='dashboard mode'
              size='small'
            >
              <ToggleButton value='view' aria-label='view mode'>
                <VisibilityIcon sx={{ mr: 1 }} fontSize='small' />
                View
              </ToggleButton>
              <ToggleButton value='edit' aria-label='edit mode'>
                <EditIcon sx={{ mr: 1 }} fontSize='small' />
                Customize
              </ToggleButton>
            </ToggleButtonGroup>

            <FormControl sx={{ minWidth: 150 }} size='small'>
              <InputLabel id='dashboard-timeframe-label'>Timeframe</InputLabel>
              <Select
                labelId='dashboard-timeframe-label'
                id='dashboard-timeframe-select'
                value={timeframe}
                label='Timeframe'
                onChange={e => setTimeframe(e.target.value as StatisticsRange)}
              >
                <MenuItem value='DAILY'>Daily</MenuItem>
                <MenuItem value='WEEKLY'>Weekly</MenuItem>
                <MenuItem value='MONTHLY'>Monthly</MenuItem>
                <MenuItem value='YEARLY'>Yearly</MenuItem>
                <MenuItem value='OVERALL'>Overall</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {isCustomizeMode && (
            <Button
              variant='outlined'
              color='warning'
              startIcon={<RestartAltIcon />}
              onClick={handleResetDashboard}
              size='small'
            >
              Reset to Default
            </Button>
          )}
        </Box>

        {/* Tile Toolbar (shown in customize mode) */}
        {isCustomizeMode && (
          <TileToolbar
            onAddTile={handleAddTile}
            existingTileTypes={existingTileTypes}
          />
        )}

        {/* Customize Mode Info */}
        {isCustomizeMode && (
          <Alert severity='info' sx={{ mb: 3 }}>
            <strong>Customize Mode Active:</strong> Add tiles from the toolbar
            above, drag tiles to reorder, or click the X to remove them. Your
            changes are automatically saved.
          </Alert>
        )}

        {/* Dashboard Tiles with Drag & Drop */}
        <TimeframeContext.Provider value={{ timeframe }}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={config.tiles.map(tile => tile.id)}
              strategy={rectSortingStrategy}
            >
              <Grid container spacing={3}>
                {config.tiles.map(tile => (
                  <Grid item xs={12} sm={6} md={tile.width} key={tile.id}>
                    <SortableTile
                      tile={tile}
                      isCustomizeMode={isCustomizeMode}
                      onRemove={handleRemoveTile}
                    />
                  </Grid>
                ))}
              </Grid>
            </SortableContext>
          </DndContext>
        </TimeframeContext.Provider>

        {/* Empty State */}
        {config.tiles.length === 0 && (
          <Alert severity='warning' sx={{ mt: 3 }}>
            No tiles on dashboard.{' '}
            {isCustomizeMode
              ? 'Add some from the toolbar above!'
              : 'Enable customize mode to add tiles.'}
          </Alert>
        )}

        {/* Snackbar Notifications */}
        <Snackbar
          open={!!snackbarMsg}
          autoHideDuration={3000}
          onClose={() => setSnackbarMsg('')}
          message={snackbarMsg}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        />
      </Box>
    </MainContainer>
  );
};

export default HomePage;
