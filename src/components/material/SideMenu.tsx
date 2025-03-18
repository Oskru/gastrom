import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuContent from './MenuContent';
import OptionsMenu from './OptionsMenu';
import { useEffect, useState } from 'react';
import { useUser } from '../../hooks/use-user.ts';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/use-auth.ts';
import useMediaQuery from '@mui/material/useMediaQuery';

const drawerWidth = 280;
const collapsedWidth = 72;

const SideDrawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})<{ open: boolean }>(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  transition: theme.transitions.create(['width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  [`& .${drawerClasses.paper}`]: {
    width: open ? drawerWidth : collapsedWidth,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    transition: theme.transitions.create(['width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

export default function SideMenu() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isOpen, setIsOpen] = useState(!isMobile);
  const { user } = useUser();
  const [userAvatarUrl, setUserAvatarUrl] = useState(
    `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`
  );
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    setUserAvatarUrl(
      `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=random`
    );
  }, [user]);

  useEffect(() => {
    if (isMobile === isOpen) {
      setIsOpen(!isMobile);
    }
  }, [isMobile]);

  return (
    <SideDrawer variant='permanent' open={isOpen}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isOpen ? 'flex-end' : 'center',
          p: 1,
        }}
      >
        <IconButton onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      <Divider />
      <MenuContent isCollapsed={!isOpen} />
      <Box sx={{ flexGrow: 1 }} />
      <Stack
        direction='row'
        sx={{
          p: isOpen ? 2 : 1,
          gap: isOpen ? 1 : 0,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
          minHeight: 72,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Avatar
          alt={user?.firstName + ' ' + user?.lastName}
          src={userAvatarUrl}
          sx={{
            width: isOpen ? 40 : 36,
            height: isOpen ? 40 : 36,
            mx: isOpen ? 0 : 'auto',
            transition: theme.transitions.create(
              ['width', 'height', 'margin'],
              {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }
            ),
          }}
        />
        {isOpen && (
          <Box sx={{ mr: 'auto' }}>
            <Typography
              variant='body2'
              sx={{
                fontWeight: 600,
                lineHeight: '1.2',
                color: theme => theme.palette.text.primary,
              }}
            >
              {user?.firstName} {user?.lastName}
            </Typography>
          </Box>
        )}
        <Box
          sx={{
            position: 'relative',
            marginRight: isOpen ? 0 : '-4px',
          }}
        >
          <OptionsMenu
            compact={!isOpen}
            options={[
              {
                label: 'My account',
                onClick: () => navigate('/account'),
              },
              {
                label: 'Logout',
                onClick: () => logout(),
              },
            ]}
          />
        </Box>
      </Stack>
    </SideDrawer>
  );
}
