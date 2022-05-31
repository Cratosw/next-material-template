// pages/_middleware.ts

import { NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import type { JWT } from "next-auth/jwt"

import { NextAuthMiddlewareOptions, withAuth } from "next-auth/middleware"
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { RequestQuote } from '@mui/icons-material';

const nextAuthMiddlewareOptions:NextAuthMiddlewareOptions={
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: '/auth/new-user'
    },
    callbacks: {
        authorized: ({ token, req }) => {
            if(["/Auth"].includes(req.nextUrl.pathname)){
                return token?.userRole === "admin";
            }else{
                return true;
            }
            
        }
    },
};
export default withAuth(
    function middleware(request: NextRequest, event: NextFetchEvent):NextMiddlewareResult {
        console.log("Middleware token", request.nextauth.token);
        return NextResponse.next()
    },
    nextAuthMiddlewareOptions
)