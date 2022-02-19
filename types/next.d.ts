import type { NextComponentType, NextPageContext } from "next"
import type { EmotionCache } from '@emotion/react';
import type { Router } from "next/router";

declare module "next/app" {
  type AppProps<P = Record<string, unknown>> = {
    Component: NextComponentType<NextPageContext, any, P> & {auth:boolean}
    emotionCache:EmotionCache;
    router: Router
    __N_SSG?: boolean
    __N_SSP?: boolean
    pageProps: P & {
      cookie: string;
      userLanguage: string;
    }
  }
}