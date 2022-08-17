import 'react-i18next';
import color from 'public/locales/zh/color.json';
import common from 'public/locales/zh/common.json';

declare module 'react-i18next' {
  interface Resources {
    color: typeof color;
    common: typeof common;
  }
}

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      color: typeof color;
    };
  }
}
