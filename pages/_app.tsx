import { AppProps, AppContext } from 'next/app';
import React, { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { appWithTranslation } from 'next-i18next';
import { EmotionCache } from '@emotion/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import NProgress from 'nprogress';
import 'src/styles/reset.css';
import createEmotionCache from 'src/components/createEmotionCache';
import { CssBaseline } from '@mui/material';
import SuspenseLoader from 'src/components/SuspenseLoader';
import { SnackbarProvider } from 'notistack';
import { AnimatePresence, domAnimation, LazyMotion, motion } from 'framer-motion';
import Head from 'src/components/Head';
import { RecoilRoot } from 'recoil';
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24 // 24 hours
    }
  }
});
const clientSideEmotionCache: EmotionCache = createEmotionCache();

const fadeBack = {
  name: "Fade Back",
  variants: {
    initial: {
      opacity: 0,
      scale: 0.4
    },
    animate: {
      opacity: 1,
      scale: 1
    },
    exit: {
      opacity: 0,
      scale: 0.4
    }
  },
  transition: {
    duration: 0.7
  }
}

const ThemeWrapper = dynamic(() => import('src/themes/ThemeWrapper'), { ssr: false });
const SnackbarUtilsConfigurator = dynamic(
  async () => (await import('src/components/NotistackUtils')).SnackbarUtilsConfigurator,
  { ssr: false }
);


export interface AppWrapperProps {
  children: React.ReactNode;
  emotionCache: EmotionCache;
  pageProps: CommonServerResult;
}
/**
 *next 中，pages/_app.js 这个文件中暴露出的组件会作为一个全局的包裹组件，会
 *被包在每一个页面组件的外层，我们可以用它来 固定 Layout 保持一些共用的状态
 * @export
 * @param {*} { Component, pageProps }
 * @returns
 */
const AppWrapper: React.FC<AppWrapperProps> = props => {
  const { children, emotionCache, pageProps } = props;
  return (
    <SnackbarProvider maxSnack={3} variant="success">
      <ThemeWrapper emotionCache={emotionCache}>
        <CssBaseline />
        <SnackbarUtilsConfigurator />
        {children}
      </ThemeWrapper>
    </SnackbarProvider>
  );
};
/**
 * Component 指当前页面，每次路由切换时，Component 都会更新
 * pageProps 是带有初始属性的对象，该初始属性由我们的某个数据获取方法预先加载到你的页面中，否则它将是一个空对象
 */
const MyApp = ({
  Component,
  emotionCache = clientSideEmotionCache,
  pageProps: { themes, renderConfig, ...pageProps },
  router
}: AppProps): JSX.Element => {
  useEffect(() => {
    const handleStart = () => {
      NProgress.set(0.4);
      NProgress.start();
    };

    const handleStop = () => {
      NProgress.done();
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  const getLayout = useMemo(() => Component.getLayout || ((page: any) => page), [Component]);
  return (
    <>
      <Head></Head>
      <RecoilRoot>
        <NextThemeProvider defaultTheme="system">
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <LazyMotion features={domAnimation}>
                <AnimatePresence exitBeforeEnter>
                  <AppWrapper emotionCache={emotionCache} pageProps={pageProps}>
                    <React.Suspense fallback={<SuspenseLoader />}>
                      <motion.div
                        key={router.route.concat(fadeBack.name)}
                        className="page-wrap"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={fadeBack.variants}
                        transition={fadeBack.transition}
                      >
                        {getLayout(<Component {...pageProps} key={router.route} />)}
                      </motion.div>
                    </React.Suspense>
                  </AppWrapper>
                </AnimatePresence>
              </LazyMotion>
            </Hydrate>
          </QueryClientProvider>
        </NextThemeProvider>
      </RecoilRoot>
    </>
  );
};
export default appWithTranslation(MyApp);
