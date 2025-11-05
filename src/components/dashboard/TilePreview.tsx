// src/components/dashboard/TilePreview.tsx
import React from 'react';
import { Box, Paper } from '@mui/material';
import { DashboardTileComponent } from './DashboardTiles';
import { DashboardTileType } from '../../types/dashboard';
import { TimeframeContext } from '../../context/timeframe-context';
import { StatisticsRange } from '../../schemas/statistics';

interface TilePreviewProps {
  tileType: DashboardTileType;
  timeframe?: StatisticsRange;
}

/**
 * TilePreview Component
 *
 * Renders a preview of a dashboard tile in a scaled-down container.
 * Used for showing a live preview on hover in the tile toolbar.
 *
 * Memoized to prevent unnecessary re-renders and improve performance.
 */
export const TilePreview: React.FC<TilePreviewProps> = React.memo(
  ({ tileType, timeframe = 'OVERALL' }) => {
    return (
      <TimeframeContext.Provider value={{ timeframe }}>
        <Paper
          elevation={8}
          sx={{
            width: '400px',
            maxWidth: '90vw',
            p: 2,
            backgroundColor: 'background.paper',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              transform: 'scale(0.85)',
              transformOrigin: 'top left',
              width: '117.6%', // 100% / 0.85 to compensate for scale
              pointerEvents: 'none', // Disable interactions in preview
            }}
          >
            <DashboardTileComponent type={tileType} />
          </Box>
        </Paper>
      </TimeframeContext.Provider>
    );
  }
);

TilePreview.displayName = 'TilePreview';
