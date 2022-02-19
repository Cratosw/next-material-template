import React, { useEffect, useMemo, useState } from 'react';
import {
  PaletteMode,
  Theme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
  useMediaQuery
} from '@mui/material';
import { CreateResponsiveFontSizesTheme, GetThemeOptions } from './ThemeSkins/MaterialDocTheme';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { useTheme } from 'next-themes';
interface ThemeWrapperProps {
  emotionCache: EmotionCache;
  children: React.ReactNode;
}
const useEnhancedEffect = typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

export const getMetaThemeColor = (mode: PaletteMode | undefined) => {
  if(!!mode){
    if(mode==='dark'){
      return "#0b3e05";
    }else{
      return "#ecd96f";
    }
    
  }else{
    return "#ecd96f";
  }
};
export const DispatchContext = React.createContext<any>(null);

const ThemeWrapper = ({ children, emotionCache }: ThemeWrapperProps) => {
  const nextThemes = useTheme();
  console.log(nextThemes.theme,"nextThemes");

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const preferredMode = prefersDarkMode ? 'dark' : 'light';

  const theme = React.useMemo(() => {
    if(nextThemes.theme==='system'){
      return CreateResponsiveFontSizesTheme(GetThemeOptions(preferredMode as PaletteMode));
    }
    return CreateResponsiveFontSizesTheme(GetThemeOptions(nextThemes.theme as PaletteMode));
  }, [nextThemes.theme, preferredMode]);

  useEnhancedEffect(() => {
    if (theme.palette.mode === 'dark') {
      document.body.classList.remove('mode-light');
      document.body.classList.add('mode-dark');
    } else {
      document.body.classList.remove('mode-dark');
      document.body.classList.add('mode-light');
    }
  }, [theme.palette.mode]);

  return (
    <CacheProvider value={emotionCache}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </CacheProvider>
  );
};
export default ThemeWrapper;
