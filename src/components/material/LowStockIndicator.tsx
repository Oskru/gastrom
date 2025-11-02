import React from 'react';import React from 'react';import React from 'react';import React from 'react';import React from 'react';

import { Chip } from '@mui/material';

import WarningIcon from '@mui/icons-material/Warning';import { Box, Chip, Typography, Tooltip, LinearProgress, styled } from '@mui/material';

import { IngredientDto } from '../../schemas/inventory';

import WarningIcon from '@mui/icons-material/Warning';import {

interface LowStockIndicatorProps {

  ingredient: IngredientDto;import { IngredientDto } from '../../schemas/inventory';

  showDetails?: boolean;

}  Box,import {import {



const LowStockIndicator: React.FC<LowStockIndicatorProps> = ({ ingredient }) => {interface LowStockIndicatorProps {

  const { name, stockQuantity, alertQuantity } = ingredient;

  const isLowStock = stockQuantity <= alertQuantity;  ingredient: IngredientDto;  Chip,

  return (

    <Chip   showDetails?: boolean;

      icon={isLowStock ? <WarningIcon /> : undefined} 

      label={isLowStock ? 'Low Stock' : 'In Stock'} }  Typography,  Box,  Box,

      color={isLowStock ? 'warning' : 'success'} 

      size='small'

    />

  );const StyledProgressBar = styled(LinearProgress)(({ theme }) => ({  Tooltip,

};

  height: 8,

export default LowStockIndicator;

  borderRadius: 4,  LinearProgress,  Chip,  Chip,

  width: '100%',

  backgroundColor: theme.palette.grey[300],  styled,

  '& .MuiLinearProgress-bar': {

    borderRadius: 4,} from '@mui/material';  Typography,  Typography,

  },

}));import WarningIcon from '@mui/icons-material/Warning';



const StyledValueText = styled(Typography)(() => ({import { IngredientDto } from '../../schemas/inventory';  Tooltip,  Tooltip,

  minWidth: 65,

  textAlign: 'right',

}));

interface LowStockIndicatorProps {  LinearProgress,  LinearProgress,

const LowStockIndicator: React.FC<LowStockIndicatorProps> = ({ ingredient, showDetails = true }) => {

  const { name, stockQuantity, alertQuantity, unit } = ingredient;  ingredient: IngredientDto;

  const percentage = alertQuantity > 0 ? (stockQuantity / alertQuantity) * 100 : 100;

  const isLowStock = stockQuantity <= alertQuantity;  showDetails?: boolean;  styled,  styled,

  const isCritical = stockQuantity <= alertQuantity * 0.5;

  const isOutOfStock = stockQuantity <= 0;}



  let color: 'error' | 'warning' | 'success' = 'success';} from '@mui/material';} from '@mui/material';

  let status = 'In Stock';

const StyledProgressBar = styled(LinearProgress)(({ theme }) => ({

  if (isOutOfStock) {

    color = 'error';  height: 8,import WarningIcon from '@mui/icons-material/Warning';import WarningIcon from '@mui/icons-material/Warning';

    status = 'Out of Stock';

  } else if (isCritical) {  borderRadius: 4,

    color = 'error';

    status = 'Critical';  width: '100%',import { IngredientDto } from '../../schemas/inventory';

  } else if (isLowStock) {

    color = 'warning';  backgroundColor: theme.palette.grey[300],

    status = 'Low Stock';

  }  '& .MuiLinearProgress-bar': {interface LowStockIndicatorProps {



  if (!showDetails) {    borderRadius: 4,

    return (

      <Tooltip title={`${name}: ${stockQuantity} ${unit} (Alert at ${alertQuantity})`}>  },interface LowStockIndicatorProps {  quantity?: number;

        <Chip icon={isLowStock ? <WarningIcon /> : undefined} label={status} color={color} size='small' variant={isLowStock ? 'filled' : 'outlined'} />

      </Tooltip>}));

    );

  }  ingredient: IngredientDto;  weightInGrams?: number;



  return (const StyledValueText = styled(Typography)(() => ({

    <Box display='flex' flexDirection='column' gap={1} width='100%'>

      <Box display='flex' justifyContent='space-between' alignItems='center'>  minWidth: 65,  showDetails?: boolean;  minimalValue: number;

        <Box display='flex' alignItems='center' gap={0.5}>

          <Typography variant='body2' fontWeight='medium'>{name}</Typography>  textAlign: 'right',

          {isLowStock && <WarningIcon fontSize='small' color={color} />}

        </Box>}));}  countable: boolean;

        <Chip label={status} color={color} size='small' />

      </Box>

      <StyledProgressBar variant='determinate' value={Math.min(percentage, 100)} color={color} />

      <Box display='flex' justifyContent='space-between' alignItems='center'>const LowStockIndicator: React.FC<LowStockIndicatorProps> = ({  showDetails?: boolean;

        <Typography variant='caption' color='text.secondary'>Current Stock</Typography>

        <StyledValueText variant='caption' fontWeight='medium' color={color}>{stockQuantity} {unit}</StyledValueText>  ingredient,

      </Box>

      <Box display='flex' justifyContent='space-between' alignItems='center'>  showDetails = true,const StyledProgressBar = styled(LinearProgress)(({ theme }) => ({}

        <Typography variant='caption' color='text.secondary'>Alert Level</Typography>

        <StyledValueText variant='caption'>{alertQuantity} {unit}</StyledValueText>}) => {

      </Box>

      <Box display='flex' justifyContent='center'>  const { name, stockQuantity, alertQuantity, unit } = ingredient;  height: 8,

        <Typography variant='caption' color={color} fontWeight='bold'>{percentage.toFixed(0)}% of alert level</Typography>

      </Box>

    </Box>

  );  const percentage = alertQuantity > 0 ? (stockQuantity / alertQuantity) * 100 : 100;  borderRadius: 4,const StyledProgressBar = styled(LinearProgress)(({ theme }) => ({

};

  

export default LowStockIndicator;

  const isLowStock = stockQuantity <= alertQuantity;  width: '100%',  height: 8,

  const isCritical = stockQuantity <= alertQuantity * 0.5;

  const isOutOfStock = stockQuantity <= 0;  backgroundColor: theme.palette.grey[300],  borderRadius: 4,



  let color: 'error' | 'warning' | 'success' = 'success';  '& .MuiLinearProgress-bar': {  width: '100%',

  let status = 'In Stock';

    borderRadius: 4,  backgroundColor: theme.palette.grey[300],

  if (isOutOfStock) {

    color = 'error';  },  '& .MuiLinearProgress-bar': {

    status = 'Out of Stock';

  } else if (isCritical) {}));    borderRadius: 4,

    color = 'error';

    status = 'Critical';  },

  } else if (isLowStock) {

    color = 'warning';const StyledValueText = styled(Typography)(() => ({}));

    status = 'Low Stock';

  }  minWidth: 65,



  if (!showDetails) {  textAlign: 'right',const StyledValueText = styled(Typography)(() => ({

    return (

      <Tooltip title={`${name}: ${stockQuantity} ${unit} (Alert at ${alertQuantity})`}>}));  minWidth: 65,

        <Chip

          icon={isLowStock ? <WarningIcon /> : undefined}  textAlign: 'right',

          label={status}

          color={color}const LowStockIndicator: React.FC<LowStockIndicatorProps> = ({}));

          size='small'

          variant={isLowStock ? 'filled' : 'outlined'}  ingredient,

        />

      </Tooltip>  showDetails = true,const LowStockIndicator: React.FC<LowStockIndicatorProps> = ({

    );

  }}) => {  quantity = 0,



  return (  const { name, stockQuantity, alertQuantity, unit } = ingredient;  weightInGrams = 0,

    <Box display='flex' flexDirection='column' gap={1} width='100%'>

      <Box display='flex' justifyContent='space-between' alignItems='center'>  minimalValue,

        <Box display='flex' alignItems='center' gap={0.5}>

          <Typography variant='body2' fontWeight='medium'>  // Calculate percentage: how much stock we have relative to alert level  countable,

            {name}

          </Typography>  // If stockQuantity <= alertQuantity, we're in low stock territory  showDetails = true,

          {isLowStock && <WarningIcon fontSize='small' color={color} />}

        </Box>  const percentage = alertQuantity > 0 ? (stockQuantity / alertQuantity) * 100 : 100;}) => {

        <Chip label={status} color={color} size='small' />

      </Box>    // Check the appropriate value based on whether the item is countable



      <StyledProgressBar variant='determinate' value={Math.min(percentage, 100)} color={color} />  // Determine status and color  const currentValue = countable ? quantity : weightInGrams;



      <Box display='flex' justifyContent='space-between' alignItems='center'>  const isLowStock = stockQuantity <= alertQuantity;

        <Typography variant='caption' color='text.secondary'>

          Current Stock  const isCritical = stockQuantity <= alertQuantity * 0.5;  // Determine if stock is low

        </Typography>

        <StyledValueText variant='caption' fontWeight='medium' color={color}>  const isOutOfStock = stockQuantity <= 0;  const isLowStock = currentValue < minimalValue;

          {stockQuantity} {unit}

        </StyledValueText>

      </Box>

  let color: 'error' | 'warning' | 'success' = 'success';  // Calculate percentage of current value compared to minimal value

      <Box display='flex' justifyContent='space-between' alignItems='center'>

        <Typography variant='caption' color='text.secondary'>  let status = 'In Stock';  const percentage = Math.min(

          Alert Level

        </Typography>    100,

        <StyledValueText variant='caption'>

          {alertQuantity} {unit}  if (isOutOfStock) {    Math.round((currentValue / minimalValue) * 100)

        </StyledValueText>

      </Box>    color = 'error';  );



      <Box display='flex' justifyContent='center'>    status = 'Out of Stock';

        <Typography

          variant='caption'  } else if (isCritical) {  // Determine color based on stock level

          color={color}

          fontWeight='bold'    color = 'error';  let color: 'success' | 'warning' | 'error' = 'success';

        >

          {percentage.toFixed(0)}% of alert level    status = 'Critical';  if (percentage < 50) color = 'error';

        </Typography>

      </Box>  } else if (isLowStock) {  else if (percentage < 80) color = 'warning';

    </Box>

  );    color = 'warning';

};

    status = 'Low Stock';  // Format the display value with appropriate units and type indicator

export default LowStockIndicator;

  }  const currentValueFormatted = countable

    ? `${quantity} units`

  if (!showDetails) {    : `${weightInGrams}g`;

    return (

      <Tooltip title={`${name}: ${stockQuantity} ${unit} (Alert at ${alertQuantity})`}>  const minValueFormatted = countable

        <Chip    ? `${minimalValue} units`

          icon={isLowStock ? <WarningIcon /> : undefined}    : `${minimalValue}g`;

          label={status}

          color={color}  // Create the indicator layout with consistent sizing

          size='small'  const progressIndicator = (

          variant={isLowStock ? 'filled' : 'outlined'}    <Box

        />      sx={{

      </Tooltip>        width: '100%',

    );        display: 'flex',

  }        flexDirection: 'column',

        alignItems: 'stretch',

  return (        gap: 0.5,

    <Box display='flex' flexDirection='column' gap={1} width='100%'>      }}

      {/* Status Header */}    >

      <Box display='flex' justifyContent='space-between' alignItems='center'>      <Box

        <Box display='flex' alignItems='center' gap={0.5}>        sx={{

          <Typography variant='body2' fontWeight='medium'>          display: 'flex',

            {name}          justifyContent: 'space-between',

          </Typography>          alignItems: 'center',

          {isLowStock && <WarningIcon fontSize='small' color={color} />}        }}

        </Box>      >

        <Chip label={status} color={color} size='small' />        <Box

      </Box>          sx={{

            display: 'flex',

      {/* Progress Bar */}            alignItems: 'center',

      <StyledProgressBar variant='determinate' value={Math.min(percentage, 100)} color={color} />            width: 40,

          }}

      {/* Stock Details */}        >

      <Box display='flex' justifyContent='space-between' alignItems='center'>          <Typography

        <Typography variant='caption' color='text.secondary'>            variant='caption'

          Current Stock            color={isLowStock ? 'error' : 'text.secondary'}

        </Typography>            sx={{ fontWeight: 500 }}

        <StyledValueText variant='caption' fontWeight='medium' color={color}>          >

          {stockQuantity} {unit}            {Math.round(percentage)}%

        </StyledValueText>          </Typography>

      </Box>        </Box>

        <Box

      <Box display='flex' justifyContent='space-between' alignItems='center'>          sx={{

        <Typography variant='caption' color='text.secondary'>            display: 'flex',

          Alert Level            alignItems: 'center',

        </Typography>            justifyContent: 'flex-end',

        <StyledValueText variant='caption'>          }}

          {alertQuantity} {unit}        >

        </StyledValueText>          <StyledValueText

      </Box>            variant='body2'

            color={isLowStock ? 'error' : 'text.secondary'}

      {/* Percentage Display */}          >

      <Box display='flex' justifyContent='center'>            {currentValue}

        <Typography            {!countable && 'g'}

          variant='caption'          </StyledValueText>

          color={color}          <Typography

          fontWeight='bold'            variant='body2'

        >            color={isLowStock ? 'error' : 'text.secondary'}

          {percentage.toFixed(0)}% of alert level            sx={{ mx: 0.5 }}

        </Typography>          >

      </Box>            /

    </Box>          </Typography>

  );          <StyledValueText

};            variant='body2'

            color={isLowStock ? 'error' : 'text.secondary'}

export default LowStockIndicator;          >

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
