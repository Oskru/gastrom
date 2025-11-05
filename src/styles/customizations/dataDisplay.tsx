import { Theme, alpha, Components } from '@mui/material/styles';
import { svgIconClasses } from '@mui/material/SvgIcon';
import { typographyClasses } from '@mui/material/Typography';
import { buttonBaseClasses } from '@mui/material/ButtonBase';
import { chipClasses } from '@mui/material/Chip';
import { iconButtonClasses } from '@mui/material/IconButton';
import { gray, red, green } from '../themePrimitives';
import type {} from '@mui/material/themeCssVarsAugmentation';

export const dataDisplayCustomizations: Components<Theme> = {
  MuiList: {
    styleOverrides: {
      root: {
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: ({ theme }) => ({
        [`& .${svgIconClasses.root}`]: {
          width: '1rem',
          height: '1rem',
          color: (theme.vars || theme).palette.text.secondary,
        },
        [`& .${typographyClasses.root}`]: {
          fontWeight: 500,
        },
        [`& .${buttonBaseClasses.root}`]: {
          display: 'flex',
          gap: 8,
          padding: '2px 8px',
          borderRadius: (theme.vars || theme).shape.borderRadius,
          opacity: 0.7,
          '&.Mui-selected': {
            opacity: 1,
            backgroundColor: alpha(theme.palette.action.selected, 0.3),
            [`& .${svgIconClasses.root}`]: {
              color: (theme.vars || theme).palette.text.primary,
            },
            '&:focus-visible': {
              backgroundColor: alpha(theme.palette.action.selected, 0.3),
            },
            '&:hover': {
              backgroundColor: alpha(theme.palette.action.selected, 0.5),
            },
          },
          '&:focus-visible': {
            backgroundColor: 'transparent',
          },
        },
      }),
    },
  },
  MuiListItemText: {
    styleOverrides: {
      primary: ({ theme }) => ({
        fontSize: theme.typography.body2.fontSize,
        fontWeight: 500,
        lineHeight: theme.typography.body2.lineHeight,
      }),
      secondary: ({ theme }) => ({
        fontSize: theme.typography.caption.fontSize,
        lineHeight: theme.typography.caption.lineHeight,
      }),
    },
  },
  MuiListSubheader: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundColor: 'transparent',
        padding: '4px 8px',
        fontSize: theme.typography.caption.fontSize,
        fontWeight: 500,
        lineHeight: theme.typography.caption.lineHeight,
      }),
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        minWidth: 0,
      },
    },
  },
  MuiChip: {
    defaultProps: {
      size: 'small',
    },
    styleOverrides: {
      root: ({ theme }) => ({
        border: '1px solid',
        borderRadius: '999px',
        transition: 'all 0.2s ease',
        fontWeight: 600,
        [`& .${chipClasses.label}`]: {
          fontWeight: 600,
          padding: '0 12px',
        },
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
        variants: [
          {
            props: {
              color: 'default',
            },
            style: {
              borderColor: gray[200],
              backgroundColor: gray[100],
              [`& .${chipClasses.label}`]: {
                color: gray[500],
              },
              [`& .${chipClasses.icon}`]: {
                color: gray[500],
              },
              ...theme.applyStyles('dark', {
                borderColor: gray[700],
                backgroundColor: gray[800],
                [`& .${chipClasses.label}`]: {
                  color: gray[300],
                },
                [`& .${chipClasses.icon}`]: {
                  color: gray[300],
                },
              }),
            },
          },
          {
            props: {
              color: 'success',
            },
            style: {
              borderColor: green[200],
              backgroundColor: green[50],
              [`& .${chipClasses.label}`]: {
                color: green[500],
              },
              [`& .${chipClasses.icon}`]: {
                color: green[500],
              },
              ...theme.applyStyles('dark', {
                borderColor: green[800],
                backgroundColor: green[900],
                [`& .${chipClasses.label}`]: {
                  color: green[300],
                },
                [`& .${chipClasses.icon}`]: {
                  color: green[300],
                },
              }),
            },
          },
          {
            props: {
              color: 'error',
            },
            style: {
              borderColor: red[100],
              backgroundColor: red[50],
              [`& .${chipClasses.label}`]: {
                color: red[500],
              },
              [`& .${chipClasses.icon}`]: {
                color: red[500],
              },
              ...theme.applyStyles('dark', {
                borderColor: red[800],
                backgroundColor: red[900],
                [`& .${chipClasses.label}`]: {
                  color: red[200],
                },
                [`& .${chipClasses.icon}`]: {
                  color: red[300],
                },
              }),
            },
          },
          {
            props: { size: 'small' },
            style: {
              maxHeight: 20,
              [`& .${chipClasses.label}`]: {
                fontSize: theme.typography.caption.fontSize,
              },
              [`& .${svgIconClasses.root}`]: {
                fontSize: theme.typography.caption.fontSize,
              },
            },
          },
          {
            props: { size: 'medium' },
            style: {
              [`& .${chipClasses.label}`]: {
                fontSize: theme.typography.caption.fontSize,
              },
            },
          },
        ],
      }),
    },
  },
  MuiTableContainer: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
        border: `1px solid ${alpha(gray[300], 0.5)}`,
        ...theme.applyStyles('dark', {
          border: `1px solid ${alpha(gray[700], 0.3)}`,
        }),
      }),
    },
  },
  MuiTable: {
    styleOverrides: {
      root: {
        borderCollapse: 'separate',
        borderSpacing: 0,
      },
    },
  },
  MuiTableHead: {
    styleOverrides: {
      root: ({ theme }) => ({
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)'
            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.04) 0%, rgba(118, 75, 162, 0.04) 100%)',
        '& .MuiTableCell-head': {
          fontWeight: 700,
          fontSize: '0.875rem',
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          color: theme.palette.mode === 'dark' ? gray[300] : gray[700],
          borderBottom: `2px solid ${theme.palette.mode === 'dark' ? alpha(gray[700], 0.5) : alpha(gray[300], 0.8)}`,
        },
      }),
    },
  },
  MuiTableBody: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiTableRow-root': {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor:
              theme.palette.mode === 'dark'
                ? alpha(gray[800], 0.5)
                : alpha(gray[100], 0.5),
            transform: 'scale(1.001)',
          },
          '&:last-child .MuiTableCell-root': {
            borderBottom: 'none',
          },
        },
      }),
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: ({ theme }) => ({
        padding: '16px 20px',
        borderBottom: `1px solid ${theme.palette.mode === 'dark' ? alpha(gray[800], 0.5) : alpha(gray[200], 0.5)}`,
      }),
    },
  },
  MuiTablePagination: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor:
          theme.palette.mode === 'dark'
            ? alpha(gray[900], 0.3)
            : alpha(gray[50], 0.5),
      }),
      actions: {
        display: 'flex',
        gap: 8,
        marginRight: 6,
        [`& .${iconButtonClasses.root}`]: {
          minWidth: 0,
          width: 36,
          height: 36,
        },
      },
    },
  },
  MuiIcon: {
    defaultProps: {
      fontSize: 'small',
    },
    styleOverrides: {
      root: {
        variants: [
          {
            props: {
              fontSize: 'small',
            },
            style: {
              fontSize: '1rem',
            },
          },
        ],
      },
    },
  },
};
