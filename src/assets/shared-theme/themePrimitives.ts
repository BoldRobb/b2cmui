/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createTheme, alpha, type Shadows } from '@mui/material/styles';
import type { PaletteMode } from '@mui/material';

declare module '@mui/material/Paper' {
  interface PaperPropsVariantOverrides {
    highlighted: true;
  }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    thirdary: true;
  }
}

declare module '@mui/material/Chip' {
  interface ChipPropsColorOverrides {
    thirdary: true;
  }
}

declare module '@mui/material/styles' {
  interface ColorRange {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface PaletteColor extends ColorRange {}

  interface Palette {
    baseShadow: string;
    thirdary: PaletteColor;
  }

  interface PaletteOptions {
    thirdary?: PaletteColor;
  }
}

const defaultTheme = createTheme();

const customShadows: Shadows = [...defaultTheme.shadows];

export const brand = {
  50: 'hsl(210, 100%, 95%)',
  100: 'hsl(210, 100%, 92%)',
  200: 'hsl(210, 100%, 80%)',
  300: 'hsl(210, 100%, 65%)',
  400: 'hsl(210, 98%, 48%)',
  500: 'hsl(210, 98%, 42%)',
  600: 'hsl(210, 98%, 55%)',
  700: 'hsl(210, 100%, 35%)',
  800: 'hsl(210, 100%, 16%)',
  900: 'hsl(210, 100%, 21%)',
};

export const gray = {
  50: 'hsl(220, 35%, 97%)',
  100: 'hsl(220, 30%, 94%)',
  200: 'hsl(220, 20%, 88%)',
  300: 'hsl(220, 20%, 80%)',
  400: 'hsl(220, 20%, 65%)',
  500: 'hsl(220, 20%, 42%)',
  600: 'hsl(220, 20%, 35%)',
  700: 'hsl(220, 20%, 25%)',
  800: 'hsl(220, 30%, 6%)',
  900: 'hsl(220, 35%, 3%)',
};

export const green = {
  50: 'hsl(120, 80%, 98%)',
  100: 'hsl(120, 75%, 94%)',
  200: 'hsl(120, 75%, 87%)',
  300: 'hsl(120, 61%, 77%)',
  400: 'hsl(120, 44%, 53%)',
  500: 'hsl(120, 59%, 30%)',
  600: 'hsl(120, 70%, 25%)',
  700: 'hsl(120, 75%, 16%)',
  800: 'hsl(120, 84%, 10%)',
  900: 'hsl(120, 87%, 6%)',
};

export const orange = {
  50: 'hsl(45, 100%, 97%)',
  100: 'hsl(45, 92%, 90%)',
  200: 'hsl(45, 94%, 80%)',
  300: 'hsl(45, 90%, 65%)',
  400: 'hsl(45, 90%, 40%)',
  500: 'hsl(45, 90%, 35%)',
  600: 'hsl(45, 91%, 25%)',
  700: 'hsl(45, 94%, 20%)',
  800: 'hsl(45, 95%, 16%)',
  900: 'hsl(45, 93%, 12%)',
};

export const red = {
  50: 'hsl(0, 100%, 97%)',
  100: 'hsl(0, 92%, 90%)',
  200: 'hsl(0, 94%, 80%)',
  300: 'hsl(0, 90%, 65%)',
  400: 'hsl(0, 90%, 40%)',
  500: 'hsl(0, 90%, 30%)',
  600: 'hsl(0, 91%, 25%)',
  700: 'hsl(0, 94%, 18%)',
  800: 'hsl(0, 95%, 12%)',
  900: 'hsl(0, 93%, 6%)',
};

export const purple = {
  50: 'hsl(270, 100%, 95%)',
  100: 'hsl(270, 100%, 92%)',
  200: 'hsl(270, 100%, 80%)',
  300: 'hsl(270, 100%, 65%)',
  400: 'hsl(270, 98%, 48%)',
  500: 'hsl(270, 98%, 42%)',
  600: 'hsl(270, 98%, 55%)',
  700: 'hsl(270, 100%, 35%)',
  800: 'hsl(270, 100%, 16%)',
  900: 'hsl(270, 100%, 21%)',
};
export const blue = {
  50: 'hsl(210, 100%, 95%)',
  100: 'hsl(210, 100%, 90%)',
  200: 'hsl(210, 100%, 80%)',
  300: 'hsl(210, 100%, 70%)',
  400: 'hsl(210, 100%, 60%)',
  500: 'hsl(210, 100%, 50%)',
  600: 'hsl(210, 100%, 40%)',
  700: 'hsl(210, 100%, 30%)',
  800: 'hsl(210, 100%, 20%)',
  900: 'hsl(210, 100%, 10%)',
};

export const yellow = {
  50: 'hsl(54, 100%, 95%)',
  100: 'hsl(54, 100%, 90%)',
  200: 'hsl(54, 100%, 80%)',
  300: 'hsl(54, 100%, 70%)',
  400: 'hsl(54, 100%, 60%)',
  500: 'hsl(54, 100%, 50%)',
  600: 'hsl(54, 100%, 40%)',
  700: 'hsl(54, 100%, 30%)',
  800: 'hsl(54, 100%, 20%)',
  900: 'hsl(54, 100%, 10%)',
};

export const pink = {
  50: 'hsl(330, 100%, 95%)',
  100: 'hsl(330, 100%, 90%)',
  200: 'hsl(330, 100%, 80%)',
  300: 'hsl(330, 100%, 70%)',
  400: 'hsl(330, 90%, 60%)',
  500: 'hsl(330, 90%, 50%)',
  600: 'hsl(330, 90%, 40%)',
  700: 'hsl(330, 90%, 30%)',
  800: 'hsl(330, 90%, 20%)',
  900: 'hsl(330, 90%, 10%)',
};

export const teal = {
  50: 'hsl(180, 100%, 95%)',
  100: 'hsl(180, 100%, 90%)',
  200: 'hsl(180, 100%, 80%)',
  300: 'hsl(180, 80%, 70%)',
  400: 'hsl(180, 70%, 50%)',
  500: 'hsl(180, 80%, 40%)',
  600: 'hsl(180, 90%, 30%)',
  700: 'hsl(180, 95%, 20%)',
  800: 'hsl(180, 100%, 15%)',
  900: 'hsl(180, 100%, 10%)',
};

export const cyan = {
  50: 'hsl(190, 100%, 95%)',
  100: 'hsl(190, 100%, 90%)',
  200: 'hsl(190, 100%, 80%)',
  300: 'hsl(190, 90%, 70%)',
  400: 'hsl(190, 80%, 50%)',
  500: 'hsl(190, 90%, 40%)',
  600: 'hsl(190, 95%, 30%)',
  700: 'hsl(190, 100%, 25%)',
  800: 'hsl(190, 100%, 15%)',
  900: 'hsl(190, 100%, 10%)',
};

export const indigo = {
  50: 'hsl(230, 100%, 95%)',
  100: 'hsl(230, 100%, 90%)',
  200: 'hsl(230, 100%, 80%)',
  300: 'hsl(230, 90%, 70%)',
  400: 'hsl(230, 80%, 60%)',
  500: 'hsl(230, 85%, 50%)',
  600: 'hsl(230, 90%, 40%)',
  700: 'hsl(230, 95%, 30%)',
  800: 'hsl(230, 100%, 20%)',
  900: 'hsl(230, 100%, 15%)',
};

export const getDesignTokens = (mode: PaletteMode) => {
  customShadows[1] =
    mode === 'dark'
      ? 'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px'
      : 'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px';

  return {
    palette: {
      mode,
      primary: {
        light: brand[200],
        main: brand[400],
        dark: brand[700],
        contrastText: brand[50],
        ...(mode === 'dark' && {
          contrastText: brand[50],
          light: brand[300],
          main: brand[400],
          dark: brand[700],
        }),
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
        ...(mode === 'dark' && {
          contrastText: brand[300],
          light: brand[500],
          main: brand[700],
          dark: brand[900],
        }),
      },
      secondary: {
        light: purple[100],
        main: purple[300],
        dark: purple[600],
        contrastText: purple[50],
        ...(mode === 'dark' && {
          contrastText: purple[300],
          light: purple[500],
          main: purple[700],
          dark: purple[900],
        }),
      },
      thirdary: {
        light: cyan[100],
        main: cyan[300],
        dark: cyan[600],
        contrastText: cyan[50],
        ...(mode === 'dark' && {
          contrastText: cyan[300],
          light: cyan[500],
          main: cyan[700],
          dark: cyan[900],
        }),
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
        ...(mode === 'dark' && {
          light: orange[400],
          main: orange[500],
          dark: orange[700],
        }),
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
        ...(mode === 'dark' && {
          light: red[400],
          main: red[500],
          dark: red[700],
        }),
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
        ...(mode === 'dark' && {
          light: green[400],
          main: green[500],
          dark: green[700],
        }),
      },
      neutral: {
        light: gray[200],
        main: gray[400],
        dark: gray[700],
        ...(mode === 'dark' && {
          light: gray[600],
          main: gray[700],
          dark: gray[800],
        }),
      },
      grey: {
        ...gray,
      },
      divider: mode === 'dark' ? alpha(gray[700], 0.6) : alpha(gray[300], 0.4),
      background: {
        default: 'hsl(0, 0%, 99%)',
        paper: 'hsl(220, 35%, 97%)',
        ...(mode === 'dark' && { default: gray[900], paper: 'hsl(220, 30%, 7%)' }),
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
        ...(mode === 'dark' && { primary: 'hsl(0, 0%, 100%)', secondary: gray[400] }),
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
        ...(mode === 'dark' && {
          hover: alpha(gray[600], 0.2),
          selected: alpha(gray[600], 0.3),
        }),
      },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
      h1: {
        fontSize: defaultTheme.typography.pxToRem(48),
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: -0.5,
      },
      h2: {
        fontSize: defaultTheme.typography.pxToRem(36),
        fontWeight: 600,
        lineHeight: 1.2,
      },
      h3: {
        fontSize: defaultTheme.typography.pxToRem(30),
        lineHeight: 1.2,
      },
      h4: {
        fontSize: defaultTheme.typography.pxToRem(24),
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h5: {
        fontSize: defaultTheme.typography.pxToRem(20),
        fontWeight: 600,
      },
      h6: {
        fontSize: defaultTheme.typography.pxToRem(18),
        fontWeight: 600,
      },
      subtitle1: {
        fontSize: defaultTheme.typography.pxToRem(18),
      },
      subtitle2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 500,
      },
      body1: {
        fontSize: defaultTheme.typography.pxToRem(14),
      },
      body2: {
        fontSize: defaultTheme.typography.pxToRem(14),
        fontWeight: 400,
      },
      caption: {
        fontSize: defaultTheme.typography.pxToRem(12),
        fontWeight: 400,
      },
    },
    shape: {
      borderRadius: 8,
    },
    shadows: customShadows,
  };
};

export const colorSchemes = {
  light: {
    palette: {
      primary: {
        light: brand[200],
        main: brand[400],
        dark: brand[700],
        contrastText: brand[50],
      },
      info: {
        light: brand[100],
        main: brand[300],
        dark: brand[600],
        contrastText: gray[50],
      },
      secondary: {
        light: purple[200],
        main: purple[400],
        dark: purple[700],
        contrastText: gray[50],
      },
      thirdary: {
        light: cyan[200],
        main: cyan[400],
        dark: cyan[700],
        contrastText: cyan[50],
      },
      warning: {
        light: orange[300],
        main: orange[400],
        dark: orange[800],
      },
      error: {
        light: red[300],
        main: red[400],
        dark: red[800],
      },
      success: {
        light: green[300],
        main: green[400],
        dark: green[800],
      },
      neutral: {
        light: gray[200],
        main: gray[400],
        dark: gray[700],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[300], 0.4),
      background: {
        default: 'hsl(0, 0%, 99%)',
        paper: 'hsl(220, 35%, 97%)',
      },
      text: {
        primary: gray[800],
        secondary: gray[600],
        warning: orange[400],
      },
      action: {
        hover: alpha(gray[200], 0.2),
        selected: `${alpha(gray[200], 0.3)}`,
      },
      baseShadow:
        'hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px',
    },
  },
  dark: {
    palette: {
      primary: {
        contrastText: brand[50],
        light: brand[300],
        main: brand[400],
        dark: brand[700],
      },
      info: {
        contrastText: brand[300],
        light: brand[500],
        main: brand[700],
        dark: brand[900],
      },
      secondary: {
        light: purple[300],
        main: purple[400],
        dark: purple[700],
        contrastText: gray[50],
      },
      thirdary: {
        light: cyan[300],
        main: cyan[400],
        dark: cyan[700],
        contrastText: cyan[50],
      },
      warning: {
        light: orange[400],
        main: orange[500],
        dark: orange[700],
      },
      error: {
        light: red[400],
        main: red[500],
        dark: red[700],
      },
      success: {
        light: green[400],
        main: green[500],
        dark: green[700],
      },
      neutral: {
        light: gray[600],
        main: gray[700],
        dark: gray[800],
      },
      grey: {
        ...gray,
      },
      divider: alpha(gray[700], 0.6),
      background: {
        default: gray[900],
        paper: 'hsl(220, 30%, 7%)',
      },
      text: {
        primary: 'hsl(0, 0%, 100%)',
        secondary: gray[400],
      },
      action: {
        hover: alpha(gray[600], 0.2),
        selected: alpha(gray[600], 0.3),
      },
      baseShadow:
        'hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px',
    },
  },
};

export const typography = {
  fontFamily: 'Inter, sans-serif',
  h1: {
    fontSize: defaultTheme.typography.pxToRem(48),
    fontWeight: 600,
    lineHeight: 1.2,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: defaultTheme.typography.pxToRem(36),
    fontWeight: 600,
    lineHeight: 1.2,
  },
  h3: {
    fontSize: defaultTheme.typography.pxToRem(30),
    lineHeight: 1.2,
  },
  h4: {
    fontSize: defaultTheme.typography.pxToRem(24),
    fontWeight: 600,
    lineHeight: 1.5,
  },
  h5: {
    fontSize: defaultTheme.typography.pxToRem(20),
    fontWeight: 600,
  },
  h6: {
    fontSize: defaultTheme.typography.pxToRem(18),
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: defaultTheme.typography.pxToRem(18),
  },
  subtitle2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 500,
  },
  body1: {
    fontSize: defaultTheme.typography.pxToRem(14),
  },
  body2: {
    fontSize: defaultTheme.typography.pxToRem(14),
    fontWeight: 400,
  },
  caption: {
    fontSize: defaultTheme.typography.pxToRem(12),
    fontWeight: 400,
  },
};

export const shape = {
  borderRadius: 8,
};

// @ts-expect-error
const defaultShadows: Shadows = [
  'none',
  'var(--template-palette-baseShadow)',
  ...defaultTheme.shadows.slice(2),
];
export const shadows = defaultShadows;
