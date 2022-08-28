import { Palette } from '@mui/material/styles/createPalette';
import { Theme } from '@mui/material/styles/createTheme';

declare module '@mui/material/styles/createTheme' {
  interface Theme {
    headerHeight: Property.Height<TLength>;
    status?: {
      danger: React.CSSProperties['color'];
    };
  }
  interface ThemeOptions {
    headerHeight: Property.Height<TLength>;
    status?: {
      danger: React.CSSProperties['color'];
    };
  }
}
declare module '@mui/material/styles/createPalette' {
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
  interface PaletteColor extends ColorRange {}

  interface Palette {
    primaryDark: PaletteColor;
    svgBg: {
      base: string;
      active: string;
    };
    svgFilled: {
      base: string;
      active: string;
    };
    svgStroke: {
      base: string;
      active: string;
    };
  }
  interface PaletteOptions {
    primaryDark: PaletteColor;
    svgBg: {
      base: string;
      active: string;
    };
    svgFilled: {
      base: string;
      active: string;
    };
    svgStroke: {
      base: string;
      active: string;
    };
  }
}
