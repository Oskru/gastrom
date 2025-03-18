import Badge, { badgeClasses } from '@mui/material/Badge';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

export interface MenuButtonProps extends IconButtonProps {
  showBadge?: boolean;
}

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: '8px',
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create(
    ['background-color', 'box-shadow', 'border-color'],
    {
      duration: theme.transitions.duration.short,
    }
  ),
}));

export default function MenuButton({
  showBadge = false,
  ...props
}: MenuButtonProps) {
  return (
    <Badge
      color='error'
      variant='dot'
      invisible={!showBadge}
      sx={{ [`& .${badgeClasses.badge}`]: { right: 2, top: 2 } }}
    >
      <StyledIconButton size='small' {...props} />
    </Badge>
  );
}
