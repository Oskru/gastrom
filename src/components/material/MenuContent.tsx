import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Inventory,
  PeopleRounded,
  ManageAccounts,
  AttachMoney,
} from '@mui/icons-material';
import { useUser } from '../../hooks/use-user';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, url: '/' },
  {
    text: 'Inventory',
    icon: <Inventory />,
    url: '/inventory',
  },
  {
    text: 'Employees',
    icon: <PeopleRounded />,
    url: '/employees',
  },
  {
    text: 'Fixed Costs',
    icon: <AttachMoney />,
    url: '/fixed-costs',
  },
  {
    text: 'Users',
    icon: <ManageAccounts />,
    url: '/users',
    requiresAdmin: true,
  },
];

const secondaryListItems = [
  { text: 'About', icon: <InfoRoundedIcon />, url: '/about' },
  { text: 'Feedback', icon: <HelpRoundedIcon />, url: '/feedback' },
];

interface MenuContentProps {
  isCollapsed?: boolean;
}

export default function MenuContent({ isCollapsed = false }: MenuContentProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  // Filter menu items based on user role
  const filteredMainItems = mainListItems.filter(item => {
    if (item.requiresAdmin) {
      return user?.userRole === 'ADMIN';
    }
    return true;
  });

  const renderListItem = (item: (typeof mainListItems)[0]) => {
    const isSelected = location.pathname === item.url;
    const listItemButton = (
      <ListItemButton
        selected={isSelected}
        onClick={() => navigate(item.url)}
        sx={{
          minHeight: 48,
          justifyContent: isCollapsed ? 'center' : 'initial',
          px: isCollapsed ? 1.5 : 2.5,
          width: isCollapsed ? '100%' : 'auto',
          borderRadius: '14px',
          mx: 1,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            background: theme =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)'
                : 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
            opacity: isSelected ? 1 : 0,
            transition: 'opacity 0.2s ease',
            borderRadius: '0 4px 4px 0',
          },
          '&.Mui-selected': {
            backgroundColor: theme =>
              theme.palette.mode === 'dark'
                ? 'rgba(102, 126, 234, 0.12)'
                : 'rgba(102, 126, 234, 0.08)',
            '&:hover': {
              backgroundColor: theme =>
                theme.palette.mode === 'dark'
                  ? 'rgba(102, 126, 234, 0.16)'
                  : 'rgba(102, 126, 234, 0.12)',
            },
          },
          '&:hover': {
            backgroundColor: theme =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.04)',
            transform: 'translateX(2px)',
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: isCollapsed ? 48 : 0,
            mr: isCollapsed ? 0 : 2,
            justifyContent: 'center',
            color: isSelected
              ? theme => (theme.palette.mode === 'dark' ? '#8b9cfc' : '#667eea')
              : 'text.secondary',
            transition: 'color 0.2s ease',
          }}
        >
          {item.icon}
        </ListItemIcon>
        {!isCollapsed && (
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontWeight: isSelected ? 600 : 500,
              fontSize: '0.9375rem',
              color: isSelected ? 'text.primary' : 'text.secondary',
            }}
          />
        )}
      </ListItemButton>
    );

    return (
      <ListItem
        key={item.text}
        disablePadding
        sx={{
          display: 'block',
          mb: 0.5,
          px: isCollapsed ? 0.5 : 0,
        }}
      >
        {isCollapsed ? (
          <Tooltip title={item.text} placement='right'>
            {listItemButton}
          </Tooltip>
        ) : (
          listItemButton
        )}
      </ListItem>
    );
  };

  return (
    <Stack sx={{ flexGrow: 999, p: 1, justifyContent: 'space-between' }}>
      <List dense>{filteredMainItems.map(renderListItem)}</List>
      <List dense>{secondaryListItems.map(renderListItem)}</List>
    </Stack>
  );
}
