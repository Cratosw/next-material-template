import { differenceInMinutes, fromUnixTime } from 'date-fns';
import decodeJwt from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';
import { USER_CONSTANT } from 'src/config/constants';

const BASIC_AUTH_WHITELIST = new Set(['/', '/auth/login']);

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = new URL(request.nextUrl);
  if (pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  if (BASIC_AUTH_WHITELIST.has(pathname)) {
    return NextResponse.next();
  }
  const allCookies = request.cookies.entries();
  const { value, options } = response.cookies.getWithOptions(USER_CONSTANT.USER_TOKEN_NAME);
  const token = request.cookies.get(USER_CONSTANT.USER_TOKEN_NAME);
  if (!token) {
    response.cookies.delete(USER_CONSTANT.USER_TOKEN_NAME);
    return NextResponse.redirect(new URL(`/auth/login?redirecturl=${request.url}`, request.url));
  }
  const content = decodeJwt<_User.JwtToken>(token);
  const expired = differenceInMinutes(fromUnixTime(content.exp), new Date()) <= 5;
  if (expired) {
    response.cookies.delete(USER_CONSTANT.USER_TOKEN_NAME);
    return NextResponse.redirect(new URL(`/auth/login?redirecturl=${request.url}`, request.url));
  }
  return NextResponse.next();
}
