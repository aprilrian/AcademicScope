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

import axios from "axios"; // Import Axios
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
export const authOptions: AuthOptions = {
  
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (typeof credentials !== "undefined") {
          try {
            // Make an Axios request to your server endpoint
            const res = await axios.post(
              "http://localhost:3000/login",
              credentials
            );

            // Check if the response status is successful (e.g., 200)
            if (res.status === 200) {
              const data = res.data;
              const user = {

                username: data.username,
                email: data.email,
                password: data.password,
                role: data.role,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              };
              return {
                    username: user?.username,
                    email: user?.email,
                    role: user?.role,
                    accessToken: user?.accessToken,
                    refreshToken: user?.refreshToken,
                  }
            } else {
              return null; // Return null if the request was not successful
            }
          } catch (error) {
            console.error("Error authenticating:", error);
            return null; // Return null in case of an error
          }
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      session.user = token;
      return session;
    },
    async signIn({ user, email, credentials }) {
      console.log("signIn", user, email, credentials);
      return true;

      
    }
  },
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// import { verify } from 'jsonwebtoken';
// import NextAuth from 'next-auth';
// import type { AuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';

// export const authOptions: AuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials, req) {
//         if (typeof credentials !== 'undefined') {
//           // Dapatkan token dari .json yang telah disediakan
//           const tokenData = {
//             accessToken:
//               'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJnZWxlayIsImVtYWlsIjoiZ2VsZWtAc3R1ZGVudHMudW5kaIPA7aWQiLCJwYXNzd29yZCI6IiQyYiQxMCQxRGFpZExPNHgxcW1Tcmthd08zRGRPRjYvenRtVDRkMTJ5RG14bnJuRDhEcHQvVUg1dm9HdSIsInJvbGUiOiJvcGVyYXRvciIsImlhdCI6MTY5OTQ2NDYyMiwiZXhwIjoxNjk5NDY0NjUyfQ.0zof2iWkZwChaC4yhoW7MsDqZBc9Wk0M4nnjyZZ26U4',
//             refreshToken:
//               'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJnZWxlayIsImVtYWlsIjoiZ2VsZWtAc3R1ZGVudHMudW5kaXAuYWMuaWQiLCJwYXNzd29yZCI6IiQyYiQxMCQxRGFpZExPNHgxcW1Scmthd08zRGRPRjYvenRtVDRkMTJ5RG14bnJuRDhEcHQvVUg1dm9HdSIsInJvbGUiOiJvcGVyYXRvciIsImlhdCI6MTY5OTQ2NDYyMn0.nRll4-temqZOTv-k_vmZFaf32408v3OWVrjVioCrVcM',
//           };

//           // Verifikasi token menggunakan secret yang sesuai
//           try {
//             const secret = 'your_jwt_secret'; // Gantilah dengan secret Anda sendiri
//             const decodedToken = verify(tokenData.accessToken, secret);

//             if (decodedToken) {
//               return {
//                 ...decodedToken, // Sesuaikan dengan format data yang diperlukan
//                 apiToken: tokenData.accessToken,
//               };
//             }
//           } catch (error) {
//             // Token tidak valid, atau ada kesalahan lain
//             return null;
//           }
//         } else {
//           return null;
//         }
//       },
//     }),
//   ],
//   session: { strategy: 'jwt' },
// };

// export default NextAuth(authOptions);
