import { PaletteMode } from '@mui/material';
import { zhCN } from '@mui/material/locale';
import {
  createTheme,
  ThemeOptions,
  Theme,
  PaletteColor,
  responsiveFontSizes
} from '@mui/material/styles';

declare module '@mui/material/styles/createTypography' {
  interface TypographyOptions {
    fontWeightExtraBold?: number;
    fontFamilyCode?: string;
  }

  interface Typography {
    fontWeightExtraBold: number;
    fontFamilyCode: string;
  }
}

export const blue: PaletteColor = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  contrastText: '#fff',
  dark: '#0059B2',
  light: '#66B2FF',
  main: '#007FFF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75'
};
export const blueDark: PaletteColor = {
  50: '#E2EDF8',
  100: '#CEE0F3',
  200: '#91B9E3',
  300: '#5090D3',
  400: '#265D97',
  500: '#1E4976',
  600: '#173A5E',
  700: '#132F4C', // contrast 3.02:1
  800: '#001E3C',
  900: '#0A1929',
  main: '#5090D3',
  contrastText: '#fff',
  dark: '#0059B2',
  light: '#66B2FF'
};
export const grey = {
  50: '#F3F6F9',
  100: '#EAEEF3',
  200: '#E5E8EC',
  300: '#D7DCE1',
  400: '#BFC7CF',
  500: '#AAB4BE',
  600: '#96A3B0',
  700: '#8796A5', // contrast 3.02:1
  800: '#5A6978', // contrast 5.63:1
  900: '#3D4752'
};

const systemFont = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"'
];

export const GetThemeOptions = (mode: PaletteMode): ThemeOptions => {
  const themeOption: ThemeOptions = {
    headerHeight: 56,
    palette: {
      mode,
      primary: blue,
      primaryDark: blueDark,
      ...(mode === 'dark' && {
        background: {
          default: blueDark[800],
          paper: blueDark[900]
        }
      }),
      common: {
        black: '#1D1D1D'
      },
      ...(mode === 'light' && {
        text: {
          primary: grey[900],
          secondary: grey[800]
        }
      }),
      ...(mode === 'dark' && {
        text: {
          primary: '#fff',
          secondary: grey[500]
        }
      }),
      grey,
      error: {
        50: '#FFF0F1',
        100: '#FFDBDE',
        200: '#FFBDC2',
        300: '#FF99A2',
        400: '#FF7A86',
        500: '#FF505F',
        main: '#EB0014', // contrast 4.62:1
        600: '#EB0014',
        700: '#C70011',
        800: '#94000D',
        900: '#570007'
      },
      success: {
        50: '#E9FBF0',
        100: '#C6F6D9',
        200: '#9AEFBC',
        300: '#6AE79C',
        400: '#3EE07F',
        500: '#21CC66',
        600: '#1DB45A',
        ...(mode === 'dark' && {
          main: '#1DB45A' // contrast 6.17:1 (blueDark.800)
        }),
        ...(mode === 'light' && {
          main: '#1AA251' // contrast 3.31:1
        }),
        700: '#1AA251',
        800: '#178D46',
        900: '#0F5C2E'
      },
      warning: {
        50: '#FFF9EB',
        100: '#FFF4DB',
        200: '#FFF0CC',
        300: '#FFE4A3',
        400: '#FFD980',
        500: '#FFC846',
        600: '#FFBC1F',
        main: '#F5AC00', // does not pass constrast ratio
        700: '#F5AC00',
        800: '#DB9A00',
        900: '#8F6400'
      },
      svgBg: {
        base: mode === 'dark' ? blueDark[400] : grey[50],
        active: mode === 'dark' ? blueDark[400] : grey[50]
      },
      svgFilled: {
        base: mode === 'dark' ? blueDark[800] : grey[500],
        active: mode === 'dark' ? blue[300] : blue[500]
      },
      svgStroke: {
        base: mode === 'dark' ? blueDark[600] : '#ffffff',
        active: mode === 'dark' ? blue[700] : '#ffffff'
      },
      divider: mode === 'dark' ? blueDark[700] : grey[200]
    },
    shape: {
      borderRadius: 10
    },
    spacing: 10,
    transitions: {
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        // 最基本的建议时间
        standard: 300,
        // 这将用于复杂的动画中
        complex: 375,
        // 当有东西转进屏幕时建议使用
        enteringScreen: 225,
        // 当有东西转出屏幕时建议使用
        leavingScreen: 195
      },
      easing: {
        // 这是最常见的缓和曲线（easing curve）。
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        // 物体以全速从屏幕外进入屏幕，并在屏幕上以全速前进。
        // 缓慢减速至静止点。
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        // 物体以全速离开屏幕。 它们在屏幕外不会减速。
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        // 锐化曲线是由可能随时返回屏幕的对象使用的。
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
      }
    }
  };
  return themeOption;
};

export function GetThemedComponents(theme: Theme) {
  return {
    components: {
      MuiCssBaseline: {
        defaultProps: {
          enableColorScheme: true
        },
        styleOverrides: {
          'html, body': {
            width: '100vw',
            height: '100vh',
            margin: 0
          },
          body: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
            width: '100%',
            flex: 1
          },
          '#root': {
            width: '100%',
            height: '100%',
            display: 'flex',
            flex: 1,
            flexDirection: 'column'
          },
          html: {
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100%',
            width: '100%',
            MozOsxFontSmoothing: 'grayscale',
            WebkitFontSmoothing: 'antialiased'
          },
          '.child-popover .MuiPaper-root .MuiList-root': {
            flexDirection: 'column'
          },
          '#nprogress': {
            pointerEvents: 'none'
          },
          '#nprogress .bar': {
            background: `#29d`,
            position: `fixed`,
            zIndex: 1031,
            top: 0,
            left: 0,
            width: '100%',
            height: '2px'
          },
          '#nprogress .peg': {
            display: 'block',
            position: 'absolute',
            right: '0px',
            width: '100px',
            height: '100%',
            boxShadow: '0 0 10px #29d, 0 0 5px #29d',
            opacity: 1,
            transform: 'rotate(3deg) translate(0px, -4px)'
          },
          '#nprogress .spinner': {
            display: 'block',
            position: 'fixed',
            zIndex: 1031,
            top: '15px',
            right: '15px'
          },
          '#nprogress .spinner-icon': {
            width: '18px',
            height: '18px',
            boxSizing: 'border-box',
            border: 'solid 2px transparent',
            borderTopColor: '#29d',
            borderLeftColor: '#29d',
            borderRadius: '50%',
            animation: 'nprogress-spinner 400ms linear infinite'
          },
          '.nprogress-custom-parent': {
            overflow: 'hidden',
            position: 'relative'
          },
          '.nprogress-custom-parent #nprogress .spinner.nprogress-custom-parent #nprogress .bar': {
            position: 'absolute'
          },
          '@-webkit-keyframes nprogress-spinner': {
            '0%': {
              transform: 'rotate(0deg)'
            },
            '100%': {
              transform: 'rotate(360deg)'
            }
          },
          '@keyframes pulse': {
            '0%': {
              transform: 'scale(.75)'
            },
            '20%': {
              transform: 'scale(1.1)'
            },
            '40%': {
              transform: 'scale(.75)'
            },
            '60%': {
              transform: 'scale(1.05)'
            },
            '80%': {
              transform: 'scale(.75)'
            },
            '100%': {
              transform: 'scale(.75)'
            }
          },
          '@keyframes ripple': {
            '0%': {
              transform: 'scale(.8)',
              opacity: 1
            },
            '100%': {
              transform: 'scale(2.8)',
              opacity: 0
            }
          },
          '@keyframes float': {
            '0%': {
              transform: 'translate(0%, 0%)'
            },
            '100%': {
              transform: 'translate(3%, 3%)'
            }
          }
        }
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            [theme.breakpoints.up('md')]: {
              paddingLeft: theme.spacing(1),
              paddingRight: theme.spacing(1)
            }
          }
        }
      },

      MuiTab: {
        defaultProps: {
          disableTouchRipple: true
        }
      }
    }
  };
}
// eslint-disable-next-line @typescript-eslint/ban-types
export const CreateResponsiveFontSizesTheme = (
  themeOptions: ThemeOptions,
  ...args: object[]
): Theme => {
  const themeObject = createTheme(themeOptions, zhCN, ...args);
  const theme = responsiveFontSizes(
    createTheme(themeOptions, GetThemedComponents(themeObject), zhCN, ...args)
  );
  return theme;
};
