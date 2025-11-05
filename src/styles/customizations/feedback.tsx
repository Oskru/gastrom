import { Theme, alpha, Components } from '@mui/material/styles';
import { gray, orange } from '../themePrimitives';
import type {} from '@mui/material/themeCssVarsAugmentation';

export const feedbackCustomizations: Components<Theme> = {
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }) => ({
        borderRadius: 10,
        backgroundColor: orange[100],
        color: (theme.vars || theme).palette.text.primary,
        border: `1px solid ${alpha(orange[300], 0.5)}`,
        '& .MuiAlert-icon': {
          color: orange[500],
        },
        ...theme.applyStyles('dark', {
          backgroundColor: `${alpha(orange[900], 0.5)}`,
          border: `1px solid ${alpha(orange[800], 0.5)}`,
        }),
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: ({ theme }) => ({
        '& .MuiDialog-paper': {
          borderRadius: '20px',
          border: '1px solid',
          borderColor: alpha(gray[300], 0.5),
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 24px 48px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4)'
              : '0 24px 48px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)',
          backdropFilter: 'blur(20px)',
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(30, 30, 35, 0.95) 0%, rgba(20, 20, 25, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(250, 250, 252, 0.98) 100%)',
          ...theme.applyStyles('dark', {
            borderColor: alpha(gray[700], 0.4),
          }),
        },
        '& .MuiDialogTitle-root': {
          fontSize: '1.5rem',
          fontWeight: 700,
          paddingBottom: '16px',
          borderBottom: `1px solid ${theme.palette.divider}`,
        },
        '& .MuiDialogContent-root': {
          paddingTop: '24px',
        },
        '& .MuiDialogActions-root': {
          padding: '16px 24px',
          borderTop: `1px solid ${theme.palette.divider}`,
          gap: '12px',
        },
      }),
    },
  },
  MuiBackdrop: {
    styleOverrides: {
      root: {
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 8,
        borderRadius: 8,
        backgroundColor: gray[200],
        ...theme.applyStyles('dark', {
          backgroundColor: gray[800],
        }),
      }),
      bar: {
        borderRadius: 8,
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      },
    },
  },
  MuiCircularProgress: {
    styleOverrides: {
      root: {
        color: '#667eea',
      },
      circle: {
        strokeLinecap: 'round',
      },
    },
  },
};
