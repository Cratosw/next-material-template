import { AppProps, AppContext } from 'next/app';
import React, { Suspense, useEffect } from 'react';
import { Provider } from 'jotai';
import dynamic from 'next/dynamic';
import { QueryClient } from "react-query";
import { getSession, SessionProvider, useSession } from 'next-auth/react';
import { Hydrate, QueryClientProvider } from 'react-query/reactjs';
import Router, { useRouter } from 'next/dist/client/router';
import { EmotionCache } from '@emotion/react';
import { SnackbarUtilsConfigurator } from 'src/components/NotistackUtils';
import { SnackbarProvider } from 'notistack';
import NProgress from 'nprogress';
import 'src/styles/reset.css';
import createEmotionCache from 'src/components/createEmotionCache';
import { CssBaseline } from '@mui/material';
import SuspenseLoader from 'src/components/SuspenseLoader';
import Head from 'next/head';
import ReactDOM from 'react-dom/client';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

const clientSideEmotionCache: EmotionCache = createEmotionCache();

let root: ReactDOM.Root | null;

const ThemeWrapper = dynamic(() => import('src/themes/ThemeWrapper'), { ssr: false });
Router.events.on('routeChangeStart', url => {
  console.log(`Loading: ${url}`);
  NProgress.start();
  if (typeof window !== 'undefined') {
    const transition = document.getElementById('page-transition') as HTMLElement;
    document.body.classList.add('body-page-transition');
    root = ReactDOM.createRoot(transition);
    root && root.render(<SuspenseLoader />);
  }

});
Router.events.on('routeChangeComplete', () => {
  NProgress.done();
  if (typeof window !== 'undefined') {
    root && root.unmount();
    document.body.classList.remove('body-page-transition');
  }

});
Router.events.on('routeChangeError', () => {
  NProgress.done();
  if (typeof window !== 'undefined') {
    root && root.unmount();
    document.body.classList.remove('body-page-transition');
  }
});
Router.events.on('routeChangeComplete', () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 0);
});

export interface AppWrapperProps {
  children: React.ReactNode;
  emotionCache: EmotionCache;
  pageProps: {
    cookie: string;
    userLanguage: string;
    [key: string]: any;
  };
}
let reloadInterval: any;
function lazyReload() {
  clearInterval(reloadInterval);
  reloadInterval = setInterval(() => {
    if (document.hasFocus()) {
      window.location.reload();
    }
  }, 100);
}
function forcePageReload(registration: ServiceWorkerRegistration) {
  if (!navigator.serviceWorker.controller) {
    return;
  }
  if (registration.waiting) {
    registration.waiting.postMessage('skipWaiting');
    return;
  }

  function listenInstalledStateChange() {
    registration.installing?.addEventListener('statechange', event => {
      // console.log('statechange', event.target.state);
      if ((event.target as any).state === 'installed' && registration.waiting) {
        // A new service worker is available, inform the user
        registration.waiting.postMessage('skipWaiting');
      } else if ((event.target as any).state === 'activated') {
        // Force the control of the page by the activated service worker.
        lazyReload();
      }
    });
  }

  if (registration.installing) {
    listenInstalledStateChange();
    return;
  }
  registration.addEventListener('updatefound', listenInstalledStateChange);
}

async function registerServiceWorker() {
  if (
    'serviceWorker' in navigator &&
    process.env.NODE_ENV === 'production' &&
    window.location.host.indexOf('mui.com') !== -1
  ) {
    const registration = await navigator.serviceWorker.register('/sw.js');
    forcePageReload(registration);
  }
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
  const { status ,data: session } = useSession();
  console.log(session,status ,'session');
  React.useEffect(() => {
    registerServiceWorker();

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);
  if (status === "loading") {
    return <SuspenseLoader></SuspenseLoader>
  }
  return (
    <SnackbarProvider maxSnack={3} variant="success">
      <ThemeWrapper emotionCache={emotionCache}>
        <SnackbarUtilsConfigurator />
        <CssBaseline />
        <Suspense fallback={<SuspenseLoader></SuspenseLoader>}>{children}</Suspense>
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
  pageProps: { session, themes, ...pageProps }
}: AppProps): JSX.Element => {
  console.log(session);
  const [queryClient] = React.useState(() => new QueryClient());
  const { initialState } = pageProps;
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Provider>
        <NextThemeProvider defaultTheme='system'>
          <SessionProvider session={session} refetchInterval={0}>
            <QueryClientProvider client={queryClient}>
              <Hydrate state={pageProps.dehydratedState}>
                <AppWrapper emotionCache={emotionCache} pageProps={pageProps}>
                  <Component {...pageProps} />
                </AppWrapper>
              </Hydrate>
            </QueryClientProvider>
          </SessionProvider>
        </NextThemeProvider>
      </Provider>
    </>
  );
};
export default MyApp;
