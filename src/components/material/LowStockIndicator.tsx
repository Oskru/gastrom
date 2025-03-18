import React from 'react';
import {
  Box,
  Chip,
  Typography,
  Tooltip,
  LinearProgress,
  styled,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

interface LowStockIndicatorProps {
  quantity?: number;
  weightInGrams?: number;
  minimalValue: number;
  countable: boolean;
  showDetails?: boolean;
}

const StyledProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 4,
  width: '100%',
  backgroundColor: theme.palette.grey[300],
  '& .MuiLinearProgress-bar': {
    borderRadius: 4,
  },
}));

const StyledValueText = styled(Typography)(() => ({
  minWidth: 65,
  textAlign: 'right',
}));

const LowStockIndicator: React.FC<LowStockIndicatorProps> = ({
  quantity = 0,
  weightInGrams = 0,
  minimalValue,
  countable,
  showDetails = true,
}) => {
  // Check the appropriate value based on whether the item is countable
  const currentValue = countable ? quantity : weightInGrams;

  // Determine if stock is low
  const isLowStock = currentValue < minimalValue;

  // Calculate percentage of current value compared to minimal value
  const percentage = Math.min(
    100,
    Math.round((currentValue / minimalValue) * 100)
  );

  // Determine color based on stock level
  let color: 'success' | 'warning' | 'error' = 'success';
  if (percentage < 50) color = 'error';
  else if (percentage < 80) color = 'warning';

  // Format the display value with appropriate units and type indicator
  const currentValueFormatted = countable
    ? `${quantity} units`
    : `${weightInGrams}g`;

  const minValueFormatted = countable
    ? `${minimalValue} units`
    : `${minimalValue}g`;

  // Create the indicator layout with consistent sizing
  const progressIndicator = (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: 0.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: 40,
          }}
        >
          <Typography
            variant='caption'
            color={isLowStock ? 'error' : 'text.secondary'}
            sx={{ fontWeight: 500 }}
          >
            {Math.round(percentage)}%
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <StyledValueText
            variant='body2'
            color={isLowStock ? 'error' : 'text.secondary'}
          >
            {currentValue}
            {!countable && 'g'}
          </StyledValueText>
          <Typography
            variant='body2'
            color={isLowStock ? 'error' : 'text.secondary'}
            sx={{ mx: 0.5 }}
          >
            /
          </Typography>
          <StyledValueText
            variant='body2'
            color={isLowStock ? 'error' : 'text.secondary'}
          >
            {minimalValue}
            {!countable && 'g'}
          </StyledValueText>
          <Typography
            variant='caption'
            sx={{
              ml: 0.5,
              color: isLowStock ? 'error.light' : 'text.secondary',
              fontStyle: 'italic',
              fontSize: '0.7rem',
              width: 46,
              textAlign: 'left',
            }}
          >
            ({countable ? 'units' : 'grams'})
          </Typography>
        </Box>
      </Box>
      <StyledProgressBar
        variant='determinate'
        value={percentage}
        color={color}
      />
    </Box>
  );

  const chipIndicator = (
    <Tooltip
      title={`Low stock! Only ${currentValueFormatted} left (minimum: ${minValueFormatted})`}
    >
      <Chip
        icon={<WarningIcon fontSize='small' />}
        label='Low Stock'
        color='error'
        size='small'
        variant='outlined'
      />
    </Tooltip>
  );

  if (!showDetails) {
    return isLowStock ? chipIndicator : null;
  }

  return progressIndicator;
};

export default LowStockIndicator;
