import { alpha, Theme, Components } from '@mui/material/styles';
import { gray } from '../themePrimitives';
import type {} from '@mui/material/themeCssVarsAugmentation';

export const surfacesCustomizations: Components<Theme> = {
  MuiAccordion: {
    defaultProps: {
      elevation: 0,
      disableGutters: true,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        padding: 4,
        overflow: 'clip',
        backgroundColor: (theme.vars || theme).palette.background.default,
        border: '1px solid',
        borderColor: (theme.vars || theme).palette.divider,
        ':before': {
          backgroundColor: 'transparent',
        },
        '&:not(:last-of-type)': {
          borderBottom: 'none',
        },
        '&:first-of-type': {
          borderTopLeftRadius: (theme.vars || theme).shape.borderRadius,
          borderTopRightRadius: (theme.vars || theme).shape.borderRadius,
        },
        '&:last-of-type': {
          borderBottomLeftRadius: (theme.vars || theme).shape.borderRadius,
          borderBottomRightRadius: (theme.vars || theme).shape.borderRadius,
        },
      }),
    },
  },
  MuiAccordionSummary: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: 'none',
        borderRadius: 8,
        '&:hover': { backgroundColor: gray[50] },
        '&:focus-visible': { backgroundColor: 'transparent' },
        ...theme.applyStyles('dark', {
          '&:hover': { backgroundColor: gray[800] },
        }),
      }),
    },
  },
  MuiAccordionDetails: {
    styleOverrides: {
      root: { mb: 20, border: 'none' },
    },
  },
  MuiPaper: {
    defaultProps: {
      elevation: 0,
    },
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: 'none',
        backgroundColor: 'hsl(0, 0%, 100%)',
        border: `1px solid ${alpha(gray[300], 0.5)}`,
        borderRadius: (theme.vars || theme).shape.borderRadius,
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease',
        ...theme.applyStyles('dark', {
          backgroundColor: alpha(gray[900], 0.4),
          border: `1px solid ${alpha(gray[700], 0.3)}`,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
        }),
      }),
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => {
        return {
          padding: 20,
          gap: 16,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backgroundColor: 'hsl(0, 0%, 100%)',
          borderRadius: (theme.vars || theme).shape.borderRadius,
          border: `1px solid ${alpha(gray[300], 0.5)}`,
          boxShadow:
            '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow:
              '0 8px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.04)',
            transform: 'translateY(-2px)',
          },
          ...theme.applyStyles('dark', {
            backgroundColor: alpha(gray[900], 0.6),
            border: `1px solid ${alpha(gray[700], 0.3)}`,
            boxShadow:
              '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
            '&:hover': {
              boxShadow:
                '0 8px 24px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3)',
            },
          }),
          variants: [
            {
              props: {
                variant: 'outlined',
              },
              style: {
                border: `1px solid ${(theme.vars || theme).palette.divider}`,
                boxShadow: 'none',
                background: 'hsl(0, 0%, 100%)',
                ...theme.applyStyles('dark', {
                  background: alpha(gray[900], 0.4),
                }),
              },
            },
          ],
        };
      },
    },
  },
  MuiCardContent: {
    styleOverrides: {
      root: {
        padding: 0,
        '&:last-child': { paddingBottom: 0 },
      },
    },
  },
  MuiCardHeader: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiCardActions: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
};
