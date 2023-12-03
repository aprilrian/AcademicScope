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
      async authorize(credentials) {
        if (typeof credentials !== "undefined") {
          try {
            
            const res = await axios.post(
              "http://localhost:8080/auth/signin",
              credentials
            );


            if (res.status === 200) {
              const data = res.data;
              const user = {

                username: data.username,
                email: data.email,
                password: data.password,
                role: data.role,
                access_token: data.access_token,
                nama : data.nama,
                isFirstLogin : data.isFirstLogin,

                // image : data.foto,
                // refreshToken: data.refreshToken,
              };
              return {
                    username: user?.username,
                    email: user?.email,
                    role: user?.role,
                    access_token: user?.access_token,
                    nama : user?.nama,
                    isFirstLogin : user?.isFirstLogin,
                    // image : user?.image,

                    // refreshToken: user?.refreshToken,
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
    async signIn({ user, email, credentials} : any) {
      console.log("signIn", user, email, credentials);
      if (user?.isFirstLogin) {
        // Redirect to the update profile page
        return '/mhs/updProfil';
      }
  
      return true;

      
    }
  },
  session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

