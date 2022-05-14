import NextAuth, { Account, Awaitable, Profile, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { SignInResponse } from 'next-auth/react';

export default NextAuth({
    // https://next-auth.js.org/configuration/providers
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'userName', type: 'text', placeholder: 'jsmith' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials, req) {
                if (credentials != null) {
                    try {
                        const user = { id: 1, name: "cratosw", email: "cratosw@163.com", theme:'light'}
                        return user;
                    } catch (error) {
                        throw new Error(error as string);
                    }
                } else {
                    return Promise.reject(null);
                }
            }
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    theme: {
        colorScheme: 'light'
    },
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }: {
            token: JWT;
            user?: User | undefined;
            account?: Account | undefined;
            profile?: Profile | undefined;
            isNewUser?: boolean | undefined;
        }) {
            if (user) {
                token.theme=user.theme;
            }
            token.id=user?.id;
            token.userRole = "admin";
            return token;
        },
        async signIn({ user, account, profile, email, credentials }) {
            return true;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) return baseUrl;
            else if (url.startsWith("/")) return new URL(url, baseUrl).toString();
            return baseUrl
        },
        async session({ session, token, user }: {
            session: Session;
            user: User;
            token: JWT;
        }) {
            // if (session?.user) {
            //     session.user.id = user.id;
            // }
            session.theme=token.theme;
            session.id = token.id;
            return session;
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 2 * 60 * 60,
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
        maxAge: 2 * 60 * 60,
    },
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    // Enable debug messages in the console if you are having problems
    debug: true
});
