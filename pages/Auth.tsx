import React, { Suspense, useCallback, useState } from 'react';
import {
  alpha,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
  styled,
  Theme,
  Typography,
  TypographyProps,
  Container,
  ContainerProps
} from '@mui/material';
import { useRouter } from 'next/router';
import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  NextComponentType,
  NextPage,
  NextPageContext
} from 'next';
import AppLayout from 'src/Layouts/AppLayout';
import Head from 'src/components/Head';
import { useSession } from 'next-auth/react';

const StyledRoot = styled(Container)<ContainerProps>(({ theme }) => ({
  flex: '1 0 100%'
}));

const StyledHero = styled(Container)<ContainerProps>(({ theme }) => ({
  paddingTop: theme.spacing(8),
  color: theme.palette.primary.main
}));

const StyledContent = styled(Container)<ContainerProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(16),
    paddingBottom: theme.spacing(16),
    flexDirection: 'center',
    alignItems: 'flex-start',
    textAlign: 'left'
  }
}));
const StyledTitle = styled(Typography)<TypographyProps<'h4'>>(({ theme }) => ({
  marginLeft: -12,
  whiteSpace: 'nowrap',
  letterSpacing: '.7rem',
  textIndent: '.7rem',
  fontWeight: theme.typography.fontWeightLight,
  [theme.breakpoints.only('xs')]: {
    fontSize: 28
  }
}));
const HomeIndex: NextComponentType<NextPageContext, any, any> = props => {
  const router = useRouter();
  const { data } = useSession();
  return (
    <AppLayout>
      <StyledRoot disableGutters maxWidth={false}>
        <Head />
        <main id="main-LandingPage" tabIndex={-1}>
          <StyledHero disableGutters>
            <StyledContent maxWidth="md">
              <StyledTitle variant="h6" color="inherit" className="111211212" gutterBottom>
                  <pre>{JSON.stringify(data, null, 2)}</pre>
              </StyledTitle>
            </StyledContent>
          </StyledHero>
        </main>
      </StyledRoot>
    </AppLayout>
  );
};
export default HomeIndex;
