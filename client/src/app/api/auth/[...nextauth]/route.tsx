// import type { NextAuthOptions } from "next-auth";
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// // import authService from '@/services/auth'

// export const OPTIONS: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "text" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (
//           credentials?.email === "admin@ppl.com" &&
//           credentials?.password === "admin"
//         ) {
//           return {
//             name: "admin",
//             email: "admin",
//             role: "dosen",
//             id: "1",
//           };
//         } else {
//           return null;
//         }
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       return { ...token, ...user };
//     },
//     async session({ session, token }) {
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-ignore
//       session.user.accessToken = token.accessToken;

//       return session;
//     },
//   },
// };

import axios from "axios";
import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
declare module "next-auth" {
  interface Session {
    refreshToken: string;
  }
}

// declare module "next-auth" {
//   interface Session {
//     refreshToken: string;
//   }
// }

//
import { authOptions } from "./authOptionConfig";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
