import type { NextComponentType, NextPageContext } from 'next';
import type { NextPage } from 'next';
import type { EmotionCache } from '@emotion/react';
import type { Router } from 'next/router';
import type { ReactElement, ReactNode } from 'next/router';

declare module 'next/app' {
  type AppProps<P = Record<string, unknown>> = {
    Component: NextComponentType<NextPageContext, any, P> & { auth: boolean } & {
      getLayout?: (page: ReactElement) => ReactNode;
    };
    emotionCache: EmotionCache;
    router: Router;
    __N_SSG?: boolean;
    __N_SSP?: boolean;
    pageProps: P & CommonServerResult;
  };
}
declare module 'next/server' {
  export declare class NextRequest extends Request {
    nextauth: { token: JWT };
  }
}
declare module 'next' {
  export type NextPage<P = Record<string, unknown>, IP = P> = NextComponentType<
    NextPageContext,
    IP,
    P
  > & {
    getLayout?: (page: ReactElement) => ReactNode;
  };
}
