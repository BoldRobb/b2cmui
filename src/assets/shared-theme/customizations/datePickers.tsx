import { alpha, type Theme } from '@mui/material/styles';
import { brand, gray } from '../themePrimitives';

export const datePickersCustomizations = {
  MuiPickersDay: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        borderRadius: theme.shape.borderRadius,
        '&:hover': {
          backgroundColor: alpha(brand[300], 0.3),
        },
        '&.Mui-selected': {
          backgroundColor: brand[500],
          color: 'white',
          '&:hover': {
            backgroundColor: brand[600],
          },
        },
      }),
    },
  },
  MuiPickersCalendarHeader: {
    styleOverrides: {
      root: {
        marginTop: 0,
        marginBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
      },
    },
  },
  MuiDateCalendar: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
      }),
    },
  },
  MuiPickersLayout: {
    styleOverrides: {
      root: ({ theme }: { theme: Theme }) => ({
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.shape.borderRadius,
        border: `1px solid ${theme.palette.divider}`,
        boxShadow: `0 4px 6px ${alpha(gray[900], 0.1)}`,
        ...theme.applyStyles('dark', {
          boxShadow: `0 4px 6px ${alpha(gray[900], 0.5)}`,
        }),
      }),
    },
  },
  MuiPickersPopper: {
    styleOverrides: {
      paper: {
        marginTop: 4,
      },
    },
  },
};
