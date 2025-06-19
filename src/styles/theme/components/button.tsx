import type { Components } from '@mui/material/styles';

import type { Theme } from '../types';

export const MuiButton: Components<Theme>['MuiButton'] = {
  defaultProps: {
    disableElevation: true,
    variant: 'contained',
  },
  styleOverrides: {
    root: ({ ownerState, theme }) => ({
      borderRadius: '8px',
      fontWeight: 600,
      padding: '8px 20px',
      textTransform: 'none' as const,
      border: '2px solid transparent',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: '6px',
        padding: '2px',
        background: 'linear-gradient(45deg, #76ff03, #b2ff59, #76ff03)',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        pointerEvents: 'none',
      },
      ...(ownerState.variant === 'contained' && {
        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
        color: theme.palette.primary.contrastText,
        '&:hover': {
          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary[700] || theme.palette.primary.dark})`,
          boxShadow: '0 4px 12px rgba(160, 32, 240, 0.3)',
          transform: 'translateY(-1px)',
        },
      }),
      ...(ownerState.variant === 'outlined' && {
        borderColor: 'transparent',
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: 'rgba(160, 32, 240, 0.08)',
          borderColor: 'transparent',
          color: theme.palette.primary.dark,
        },
      }),
      ...(ownerState.variant === 'text' && {
        color: theme.palette.primary.main,
        '&:hover': {
          backgroundColor: 'rgba(160, 32, 240, 0.08)',
          color: theme.palette.primary.dark,
        },
      }),
    }),
  },
};
