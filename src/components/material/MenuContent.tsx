import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { Inventory, PeopleRounded, ManageAccounts } from '@mui/icons-material';
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
    text: 'Users',
    icon: <ManageAccounts />,
    url: '/users',
    requiresAdmin: true,
  },
  {
    text: 'Sales reports',
    icon: <AnalyticsRoundedIcon />,
    url: '/sales-reports',
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
          borderRadius: '12px',
          mx: 1,
          '&.Mui-selected': {
            backgroundColor: 'action.selected',
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: isCollapsed ? 48 : 0,
            mr: isCollapsed ? 0 : 2,
            justifyContent: 'center',
            color: isSelected ? 'primary.main' : 'text.secondary',
          }}
        >
          {item.icon}
        </ListItemIcon>
        {!isCollapsed && (
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontWeight: isSelected ? 600 : 500,
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
