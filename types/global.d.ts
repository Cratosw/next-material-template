import { Theme } from '@mui/material/styles/createTheme';
import { Breakpoint } from '@mui/material/styles/createBreakpoints';
import {Palette} from '@mui/material/styles/createPalette';
import { SSRConfig } from 'next-i18next';
import { AxiosResponse } from 'axios';

declare global {
  interface Window {
    Aurora: { [key: string]: string };
    dojoConfig: { [key: string]: string };
    theme: { [key: string]: string };
    requestIdleCallback: ((
      callback: ((deadline: {
        readonly didTimeout: boolean;
        timeRemaining: () => DOMHighResTimeStamp;
      }) => void),
      opts?: {
        timeout: number| undefined;
      },
    ) => number);
    cancelIdleCallback: ((handle: number) => void);
  }
  type ResponseProps<T>=AxiosResponse<{
    succeeded:boolean;
    statusCode:number;
    messages?:string[];
    data:T
  }>
  type ResponseListProps<T>=AxiosResponse<{
    total?:number;
    succeeded:boolean;
    statusCode:number;
    messages?:string[];
    data:T[],
  }>
  type ResponsePaginatedProps<T>=AxiosResponse<{
    currentPage: number,
    totalPages: number,
    total: number,
    pageSize: number,
    hasPreviousPage: boolean,
    hasNextPage: boolean,
    statusCode: number,
    messages: string[],
    succeeded: boolean
    data:T[],
  }>
  interface  CanvasRenderingContext2D{
    drawCratosw(): void;
  }
  interface CommonServerResult extends SSRConfig{
    
  }
  interface bundleMDXResult{
    code: string;
    frontmatter: {
        [key: string]: any;
    };
    errors: Message[];
    matter: Omit<matter.GrayMatterFile<string>, "data"> & {
        data: {
            [key: string]: any;
        };
    };
  }
}
declare namespace NodeJS {
  interface Process {
    browser: boolean;
  }
}

declare module 'react-router-scroll-memory';
declare module 'video-react';
declare module '*.graphqls' {
  import { DocumentNode } from 'graphql';
  export default typeof DocumentNode;
}

declare module '*.yml';

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module 'fg-loadcss' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module 'fg-loadcss' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}
declare module '*.module.less' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
}