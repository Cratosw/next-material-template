import React from 'react';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheets } from '@mui/styles';
import createEmotionServer, { EmotionCriticalToChunks } from '@emotion/server/create-instance';
import createEmotionCache from 'src/components/createEmotionCache';
import { GlobalStyles } from '@mui/material';
import { getMetaThemeColor } from 'src/themes/ThemeWrapper';

export default class MyDocument extends Document {
  render() {
    const setInitialTheme = `
      function getUserPreference() {
        if(window.localStorage.getItem('theme')) {
          return window.localStorage.getItem('theme')
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches 
          ? 'dark' 
          : 'light'
      }
      document.body.dataset.theme = getUserPreference();
    `;
    return (
      <Html lang="cn">
        <Head>
          <meta
            name="theme-color"
            content={getMetaThemeColor('light')}
            media="(prefers-color-scheme: light)"
          />
          <meta
            name="theme-color"
            content={getMetaThemeColor('dark')}
            media="(prefers-color-scheme: dark)"
          />
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
           {/* Inject MUI styles first to match with the prepend: true configuration. */}
           {(this.props as any).emotionStyleTags}
        </Head>
        <body>
          <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
MyDocument.getInitialProps = async (ctx: DocumentContext) => {
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) => props => sheets.collect(<App emotionCache={cache} {...props} />)
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
  const css = sheets.toString();
  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      sheets.getStyleElement(),
      ...emotionStyleTags,
      <style
        id="jss-server-side"
        key="jss-server-side"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: css }}
      />,
      ...React.Children.toArray(initialProps.styles)
    ]
  };
};
