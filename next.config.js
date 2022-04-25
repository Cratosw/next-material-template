const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const withTM = require('next-transpile-modules')([
  '@mui/material',
  '@mui/system',
  '@mui/icons-material'
]);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ['jsx', 'js', 'ts', 'tsx'],
  productionBrowserSourceMaps: true,
  typescript: {
    // Motivated by https://github.com/zeit/next.js/issues/7687
    ignoreDevErrors: false,
    ignoreBuildErrors: false
  },
  //该函数执行两次，一次用于服务器，一次用于客户端。这允许您使用 属性区分客户端和服务器配置。webpackisServer
  //dev： - 指示是否将在开发中完成编译Boolean
  //isServer： - 用于服务器端编译和客户端编译Booleantruefalse
  //defaultLoaders： - Next.js 内部使用的默认加载程序：Object
  //babel： - 默认配置Objectbabel-loader
  webpack: (config, {
    buildId,
    dev,
    isServer,
    defaultLoaders,
    webpack
  }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env': {
          ENABLE_AD: JSON.stringify(process.env.ENABLE_AD),
          GITHUB_AUTH: JSON.stringify(process.env.GITHUB_AUTH),
        }
      })
    );
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000
        }
      }
    });
    return config;
  },
   // 是否为每个路由生成Etags
  // HTTP ETag是HTTP协议提供的若干机制中的一种Web缓存验证机制，并且允许客户端进行缓存协商。
  generateEtags: true,
  // 页面内容缓存配置
  onDemandEntries: {
    // 页面在内存中缓存的时间（单位：秒）
    maxInactiveAge: 25 * 1000,
    // 同时缓存几个页面
    pagesBufferLength: 2
  },
  compress: true,
  // 在pages目录下哪种文件后缀会被认为是页面
  // eslint-disable-next-line no-dupe-keys
 
  // 可以通过process.env.customKey获取value
  env: {
    customKey: 'value'
  },
  node: {
    fs: 'empty'
  },
  async redirects() {
    return [
      {
        source: "/baidu",
        destination: "https://www.baidu.com/",
        permanent: true,
      },
    ];
  },
}

module.exports = withBundleAnalyzer(withTM(nextConfig));
