import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import SnackbarUtils from 'src/components/NotistackUtils';
import { getCookieUserToken } from 'src/components/UserToken';
import { isSSR } from 'src/utils/util';

export const FETCHER_TIMEOUT = 50000;

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASHURL,
  timeout: FETCHER_TIMEOUT,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': '*',
    'Content-Type': 'application/json;charset=UTF-8'
  }
});
axiosInstance.defaults.headers.common.lang = 'zh_CN';
axiosInstance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getCookieUserToken();
    if (token) {
      (config.headers as any).common.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.resolve(error.response);
  }
);

axiosInstance.interceptors.response.use(
  (data: AxiosResponse) => {
    if (data.status === 200) {
      return data.data;
    }
    SnackbarUtils.error(data.statusText);
    return null;
  },
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      if (!isSSR) {
        window.location.href = '/login';
      }
      return Promise.resolve(err?.response);
    }
    SnackbarUtils.error('服务器异常');
    return Promise.reject(err?.response);
  }
);

export const setAxiosToken = (token: string) => {
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAxiosToken = () => {
  delete axiosInstance.defaults.headers.common.Authorization;
};

export const getFileUploadHeaders = () => ({
  Authorization: axiosInstance.defaults.headers.common.Authorization,
  'Accept-Language': axiosInstance.defaults.headers.common['Accept-Language']
});
