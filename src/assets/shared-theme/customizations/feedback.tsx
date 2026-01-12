import { type Theme, alpha } from '@mui/material/styles';
import type { Components } from '@mui/material/styles/';
import { gray, orange } from '../themePrimitives';

/* eslint-disable import/prefer-default-export */
export const feedbackCustomizations: Components<Theme> = {
  MuiAlert: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: 10,
        color: (theme.vars || theme).palette.text.primary,
        ...theme.applyStyles('dark', {
        }),
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        '& .MuiDialog-paper': {
          borderRadius: '10px',
          border: '1px solid',
          borderColor: (theme.vars || theme).palette.divider,
        },
      }),
    },
  },
  MuiLinearProgress: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        height: 8,
        borderRadius: 8,
        backgroundColor: gray[200],
        ...theme.applyStyles('dark', {
          backgroundColor: gray[800],
        }),
      }),
    },
  },
};
