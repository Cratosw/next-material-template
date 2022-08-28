import React, { Suspense, useEffect, useState } from 'react';
import {
  useTheme,
  Theme,
  alpha,
  Button,
  Container,
  styled,
  useMediaQuery,
  ContainerProps
} from '@mui/material';
import {
  domAnimation,
  ForwardRefComponent,
  HTMLMotionProps,
  LazyMotion,
  motion
} from 'framer-motion';
import dynamic from 'next/dynamic';
import Router, { useRouter } from 'next/router';
import AppHeader from 'src/components/Header/AppHeader';
import SuspenseLoader from 'src/components/SuspenseLoader';

interface StyledRootProps extends HTMLMotionProps<'div'> {
  mobile?: boolean;
}
const StyledRoot = styled<ForwardRefComponent<HTMLDivElement, StyledRootProps>>(motion.div)(
  ({ theme, mobile }) => ({
    display: 'flex',
    height: `calc(100vh - ${theme.headerHeight}px)`,
    width: '100vw',
    flexDirection: 'column',
    overflow: 'hidden',
    ...(theme.palette.mode === 'dark' && {
      background: theme.palette.primaryDark[900]
    })
  })
);

const StyledContainer = styled<ForwardRefComponent<HTMLDivElement, HTMLMotionProps<'div'>>>(
  motion.div
)(({ theme }) => ({
  height: `calc(100vh - ${theme.headerHeight})`,
  maxHeight: `calc(100vh - ${theme.headerHeight})`,
  width: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  overflowY: `auto`,
  initial: { opacity: 0 },
  animate: {
    x: 0,
    boxShadow: '10px 10px 0 rgba(0, 0, 0, 0.2)',
    transitionEnd: {
      opacity: 1
    }
  }
}));

function AppLayout(props: { children: React.ReactNode }): JSX.Element {
  const { children } = props;
  return (
    <>
      <AppHeader disableDrawer={false} />
      <StyledRoot
        initial={{
          opacity: 0
        }}
        transition={{
          duration: 10
        }}
        animate={{
          transitionEnd: {
            opacity: 1
          }
        }}
      >
        <LazyMotion features={domAnimation}>
          <Suspense fallback={<SuspenseLoader />}>
            <StyledContainer
              animate={{
                transition: {
                  delay: 20
                }
              }}
            >
              {children}
            </StyledContainer>
          </Suspense>
        </LazyMotion>
      </StyledRoot>
    </>
  );
}
export default AppLayout;
