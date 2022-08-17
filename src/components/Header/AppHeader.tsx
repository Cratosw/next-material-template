import React, { Suspense, useRef, useState } from 'react';
import {
  styled,
  Theme,
  useTheme,
  Toolbar,
  IconButton,
  IconButtonProps,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Stack,
  MenuProps,
  alpha,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import dynamic from 'next/dynamic';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme as useNextTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { MotionDivBox } from '../MotionBox';
import { getCookie } from 'src/utils/helpers';

const HeaderNavBar = dynamic(() => import('./HeaderNavBar'), { suspense: true });

const GrowingDiv = styled('div')({
  flex: '1 1 auto'
});
const Header = styled(motion.header)(({ theme }) => ({
  position: 'sticky',
  top: 0,
  transition: theme.transitions.create('top'),
  zIndex: theme.zIndex.appBar,
  backdropFilter: 'blur(20px)',
  boxShadow: `inset 0px -1px 1px ${
    theme.palette.mode === 'dark' ? theme.palette.primaryDark[700] : theme.palette.grey[100]
  }`,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.primaryDark[900], 0.72)
      : 'rgba(255,255,255,0.72)'
}));
const StyledIconButton = styled(IconButton, {
  shouldForwardProp: prop => prop !== 'disablePermanent'
})<IconButtonProps & { disablePermanent: boolean }>(({ disablePermanent, theme }) => ({
  ...(disablePermanent && {
    [theme.breakpoints.up('lg')]: {
      display: 'none'
    }
  })
}));

const StyleMenu = styled(Menu)<MenuProps>(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    height: '43px'
  }
}));

interface PcHeaderProps {
  handleDrawerOpen?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  disableDrawer: boolean;
}
export type PcHeaderImperativeHandleRef = {
  handleDrawerOpen: React.MouseEventHandler<HTMLButtonElement> | undefined;
} | null;
const AppHeader = React.forwardRef<PcHeaderImperativeHandleRef, PcHeaderProps>(
  ({ handleDrawerOpen, disableDrawer = false }, ref) => {
    const nextThemes = useNextTheme();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>();
    const [mode, setMode] = React.useState<string | null>(null);
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
    const handleMenu: React.MouseEventHandler<HTMLDivElement> = event =>
      setAnchorEl(event.currentTarget);

    React.useEffect(() => {
      const initialMode = getCookie('paletteMode') || prefersDarkMode?"dark":"light";
      setMode(initialMode);
    }, [prefersDarkMode]);

    React.useImperativeHandle(
      ref,
      () => ({
        handleDrawerOpen: handleDrawerOpen
      }),
      [handleDrawerOpen]
    );
    const handleChangeThemeMode: React.MouseEventHandler<HTMLButtonElement> = (event:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const paletteMode = theme.palette.mode === 'dark' ? 'light' : 'dark';
        nextThemes.setTheme(paletteMode);
        setMode(paletteMode);
        document.cookie = `paletteMode=${paletteMode};path=/;max-age=31536000`;
        //window.location.reload();
    };

    const disablePermanent = disableDrawer === true;
    return (
      <Header>
        <Toolbar sx={{ display: 'flex', alignItems: 'center', minHeight: 56 }}>
          <StyledIconButton
            edge="start"
            aria-label={'openDrawer'}
            onClick={handleDrawerOpen}
            disablePermanent={disablePermanent}
          >
            <MenuIcon />
          </StyledIconButton>
          <MotionDivBox sx={{ display: { xs: 'none', md: 'initial' } }}>
            <Suspense fallback={<></>}>
              <HeaderNavBar />
            </Suspense>
          </MotionDivBox>
          <GrowingDiv />
          <Stack direction="row" alignItems={'center'} gap={2}>
            <Tooltip title={'主题'} enterDelay={300}>
              <IconButton
                aria-label={'主题'}
                onClick={handleChangeThemeMode}
                data-ga-event-category="header"
                data-ga-event-action="colors"
              >
                {mode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip
              title={'GitHub'}
              enterDelay={300}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Avatar
                onClick={handleMenu}
                alt="Remy Sharp"
                src="https://gitee.com/Cratosw/Images/raw/master/HeadImg/202106261548.png"
              />
            </Tooltip>
            <StyleMenu
              id="menu-appbar"
              disableScrollLock
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem>退出</MenuItem>
            </StyleMenu>
          </Stack>
        </Toolbar>
      </Header>
    );
  }
);
AppHeader.displayName = 'AppHeader';
export default AppHeader;
