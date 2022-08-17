import _ from 'lodash-es';
import Cookies from 'js-cookie';
import decodeJwt from 'jwt-decode';
import { isSSR } from 'src/utils/util';
import { USER_CONSTANT } from 'src/config/constants';
import { addDays,differenceInMinutes,fromUnixTime } from 'date-fns';

/**
 *获取token
 * @param 
 * @returns
 */
export const getCookieUserToken = (opts: { token?: string | null } = { token: null }): string => {
  const userToken = opts?.token || Cookies.get(USER_CONSTANT.USER_TOKEN_NAME);
  if (!userToken) {
    return '';
  }
  const content = decodeJwt<_User.JwtToken>(userToken);
  if(!content){
    Cookies.remove(USER_CONSTANT.USER_TOKEN_NAME);
    return '';
  }
  const expired =differenceInMinutes(fromUnixTime(content.exp),new Date())<=5;
  if (expired) {
    Cookies.remove(USER_CONSTANT.USER_TOKEN_NAME);
    return '';
  }
  return userToken;
};

export const setCookieUserToken = (token: string, expiresIn: number) => {
  const expires = fromUnixTime(expiresIn);

  Cookies.set(USER_CONSTANT.USER_TOKEN_NAME, token, { expires });
};

export const removeCookieUserToken = (): boolean => {
  if (!getCookieUserToken) return false;
  Cookies.remove(USER_CONSTANT.USER_TOKEN_NAME);
  return true;
};

export const getCookieUserInfoStr = (userInfoStr?: string) => {
  return userInfoStr || Cookies.get(USER_CONSTANT.USER_INFO_NAME);
};


export const clearCookieUser = (): boolean => {
  const removedUserToken = removeCookieUserToken();
  return removedUserToken;
};
