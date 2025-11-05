// src/components/dashboard/SortableTile.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Box, IconButton, Paper } from '@mui/material';
import {
  DragIndicator as DragIndicatorIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { DashboardTileComponent } from './DashboardTiles';
import { DashboardTile } from '../../types/dashboard';

interface SortableTileProps {
  tile: DashboardTile;
  isCustomizeMode: boolean;
  onRemove: (id: string) => void;
}

export const SortableTile: React.FC<SortableTileProps> = ({
  tile,
  isCustomizeMode,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tile.id,
    disabled: !isCustomizeMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        position: 'relative',
        height: '100%',
      }}
    >
      {isCustomizeMode && (
        <Paper
          sx={{
            position: 'absolute',
            top: -8,
            left: -8,
            right: -8,
            bottom: -8,
            border: '2px dashed',
            borderColor: 'primary.main',
            backgroundColor: 'transparent',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}
      {isCustomizeMode && (
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            right: 4,
            zIndex: 2,
            display: 'flex',
            gap: 0.5,
          }}
        >
          <IconButton
            size='small'
            {...attributes}
            {...listeners}
            sx={{
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              cursor: 'grab',
              '&:active': {
                cursor: 'grabbing',
              },
            }}
          >
            <DragIndicatorIcon fontSize='small' />
          </IconButton>
          <IconButton
            size='small'
            onClick={() => onRemove(tile.id)}
            sx={{
              backgroundColor: 'background.paper',
              boxShadow: 2,
              '&:hover': {
                backgroundColor: 'error.light',
                color: 'error.contrastText',
              },
            }}
          >
            <CloseIcon fontSize='small' />
          </IconButton>
        </Box>
      )}
      <DashboardTileComponent type={tile.type} />
    </Box>
  );
};
