import { AppProps, AppContext } from 'next/app';
import React, { Suspense, useEffect } from 'react';
import { Provider } from 'jotai';
import dynamic from 'next/dynamic';
import { Hydrate, QueryClient, QueryClientProvider, useQuery } from 'react-query';
import Router, { useRouter } from 'next/dist/client/router';
import { EmotionCache } from '@emotion/react';
import NProgress from 'nprogress';
import 'src/styles/reset.css';
import createEmotionCache from 'src/components/createEmotionCache';
import { CssBaseline } from '@mui/material';
import SuspenseLoader from 'src/components/SuspenseLoader';
import Head from 'next/head';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import * as ReactDOM from 'react-dom';

const clientSideEmotionCache: EmotionCache = createEmotionCache();

const ThemeWrapper = dynamic(() => import('src/themes/ThemeWrapper'));

Router.events.on('routeChangeStart', url => {
  console.log(`Loading: ${url}`);
  NProgress.start();
  document.body.classList.add('body-page-transition');
  ReactDOM.render(<SuspenseLoader />, document.getElementById('page-transition'));
});
Router.events.on('routeChangeComplete', () => {
  NProgress.done();
  const transition = document.getElementById('page-transition');
  transition && ReactDOM.unmountComponentAtNode(transition);
  document.body.classList.remove('body-page-transition');
});
Router.events.on('routeChangeError', () => {
  NProgress.done();
  const transition = document.getElementById('page-transition');
  transition && ReactDOM.unmountComponentAtNode(transition);
  document.body.classList.remove('body-page-transition');
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

  React.useEffect(() => {
    registerServiceWorker();

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeWrapper emotionCache={emotionCache}>
      <CssBaseline />
      <Suspense fallback={<SuspenseLoader></SuspenseLoader>}>{children}</Suspense>
    </ThemeWrapper>
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
  const [queryClient] = React.useState(() => new QueryClient());
  const { initialState } = pageProps;
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Provider>
        <NextThemeProvider defaultTheme='system'>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <AppWrapper emotionCache={emotionCache} pageProps={pageProps}>
                <Component {...pageProps} />
              </AppWrapper>
            </Hydrate>
          </QueryClientProvider>
        </NextThemeProvider>
      </Provider>
    </>
  );
};
export default MyApp;
