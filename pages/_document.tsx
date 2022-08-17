import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import createEmotionServer, { EmotionCriticalToChunks } from '@emotion/server/create-instance';
import createEmotionCache from 'src/components/createEmotionCache';
import { GlobalStyles } from '@mui/material';
import { AppType } from 'next/dist/shared/lib/utils';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="Zh_CN">
        <Head>
          <meta name="theme-color" content="#ecd96f" media="(prefers-color-scheme: light)" />
          <meta name="theme-color" content="#0b3e05" media="(prefers-color-scheme: dark)" />
          <script
            id="theme-setup"
            async
            dangerouslySetInnerHTML={{
              __html: `const theme = document.cookie
            .split("; ")
            .find((row) => row.startsWith("theme="));
          const value = theme ? theme.split("=")[1] : "light";
          document.documentElement.dataset.theme = value;`
            }}
          ></script>

          <GlobalStyles
            styles={{
              // First SSR paint
              '.only-light-mode': {
                display: 'block'
              },
              '.only-dark-mode': {
                display: 'none'
              },
              // Post SSR Hydration
              '.mode-dark .only-light-mode': {
                display: 'none'
              },
              '.mode-dark .only-dark-mode': {
                display: 'block'
              }
            }}
          />
          {(this.props as any).emotionStyleTags}
        </Head>
        <body>
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);
  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line react/display-name
      enhanceApp: (App: any) => (props: any) => <App emotionCache={cache} {...props} />
    });
  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles: EmotionCriticalToChunks = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map(style => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));
  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags]
  };
};
