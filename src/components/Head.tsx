import React from 'react';
import NextHead from 'next/head';

interface HeadProps {
  description?: string;
  title?: string;
  children?: React.ReactNode;
}

export default function Head(props: HeadProps): JSX.Element {
  const { description = 'Cratosw', title = 'Cratosw', children } = props;

  return (
    <NextHead>
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover"
      />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta httpEquiv="Content-Type" content="text/html;charset=utf-8" />
      <meta httpEquiv="x-ua-compatible" content="IE=edge" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:ttl" content="604800" />
      {children}
    </NextHead>
  );
}
