import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuButton from './MenuButton';

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  margin: '2px 8px',
  padding: '8px 12px',
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.Mui-selected': {
    backgroundColor: theme.palette.action.selected,
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  },
}));

interface OptionsMenuProps {
  anchorOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  transformOrigin?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'right';
  };
  buttonVariant?: 'icon' | 'text';
  buttonText?: string;
  options: { label: string; onClick: () => void }[];
  compact?: boolean;
}

export default function OptionsMenu({
  anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
  transformOrigin = { vertical: 'top', horizontal: 'right' },
  buttonVariant = 'icon',
  buttonText = 'Options',
  options,
  compact = false,
}: OptionsMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (onClick: () => void) => {
    onClick();
    handleClose();
  };

  return (
    <>
      {buttonVariant === 'icon' ? (
        <MenuButton
          data-testid='options-menu-button'
          onClick={handleClick}
          size={compact ? 'small' : 'medium'}
          sx={{
            minWidth: compact ? 32 : 40,
            height: compact ? 32 : 40,
            padding: compact ? '4px' : '8px',
          }}
        >
          <MoreVertRoundedIcon fontSize={compact ? 'small' : 'medium'} />
        </MenuButton>
      ) : (
        <Button
          variant='text'
          onClick={handleClick}
          sx={{
            color: 'text.primary',
            '&:hover': {
              backgroundColor: theme => alpha(theme.palette.primary.main, 0.08),
            },
          }}
        >
          {buttonText}
        </Button>
      )}

      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.12))',
            mt: 1.5,
            borderRadius: 2,
            width: 200,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
        transformOrigin={transformOrigin}
        anchorOrigin={anchorOrigin}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            data-testid={`menu-option-${option.label.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => handleOptionClick(option.onClick)}
            sx={{ py: 1.5 }}
          >
            <Typography variant='body2'>{option.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
