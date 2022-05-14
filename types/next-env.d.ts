/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
import "next-auth/jwt";
import "next-auth/server";
// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    userRole?: "admin"|"guest"
  }
}
// declare module 'next-auth' {
//   interface Session {
//     user?: { 
//       id: string;
//     } & DefaultSession["user"];
//   }
// }

declare module "next/server" {
  export declare class NextRequest extends Request {
    /** The user's role. */
    nextauth: { token: JWT }
  }
}