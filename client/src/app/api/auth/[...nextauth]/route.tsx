// import NextAuth from "next-auth";
// import type { AuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";

// export const authOptions: AuthOptions = {
//   session: { strategy: "jwt" },
//   secret: process.env.SECRET,

//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: {  label: "Password", type: "password" }
//       },
//       async authorize(credentials) {
//         const { email, password } = credentials as {
//           email: string;
//           password: string;
//         };
//         const user: any = {
//           id: 1,
//           name: "John Doe",
//           email: "john.doe@mailinator.com",
//           role: "SUPER",
//           createdAt: "2021-05-30T06:45:19.000Z"
//         };
//         if (user) {
//           return Promise.resolve(user);
//         } else {
//           return Promise.resolve(null);
//         }
//       }
//     })
//   ],

//   callbacks: {
//     async jwt(token, user) {
//       if (user?.provider == "credentials") {
//         token.email = user.email;
//       }
//       return token;
//     },

//     async session(session, token) {
//       if (token?.email) {
//         session.user.email = token.email;
//       }
//       return session;
//     }
//   }
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };

// anjengg

import type { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// import authService from '@/services/auth'

export const OPTIONS: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
        },
        password: {
          label: 'Password',
          type: 'password' },
      },
      async authorize(credentials) {
        // const loginErrorMessage = 'Invalid email or password'

        // const res = await authService.login(credentials?.email!, credentials?.password!)

        // if (res?.status !== 200) {
        //   throw Error(loginErrorMessage)
        // }

        // const user = res?.data

        // if (user) {
        //   return {
        //     id: user?.id,
        //     name: user?.name,
        //     email: user?.email,
        //     accessToken: user?.accessToken,
        //   }
        // } else {
        //   return null
        // }

        if (credentials?.email === 'admin@ppl.com' && credentials?.password === 'admin') {
          return {
            name: 'admin',
            email: 'admin',
            role: 'dosen',
            id: '1',
            image: 'https://github.com/nathanndk.png',
          }
        } else {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user }
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      session.user.accessToken = token.accessToken

      return session
    },
  },
}

const handler = NextAuth(OPTIONS)

export { handler as GET, handler as POST }

// import type { NextAuthOptions } from "next-auth";
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import axios from "axios";

// export const OPTIONS: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: {
//           label: "Email",
//           type: "text",
//         },
//         password: {
//           label: "Password",
//           type: "password",
//         },
//       },
//       async authorize(credentials, req) {
//         // if (credentials) {
//         //   try {
//         //     const response = await axios.post("URL_API_AUTH", {
//         //       email: credentials.email,
//         //       password: credentials.password,
//         //     });

//         //     if (response.status === 200) {
//         //       const user = response.data;

//         //       return {
//         //         name: user.name,
//         //         email: user.email,
//         //         role: user.role,
//         //         id: user.id,
//         //         image: user.image,
//         //         accessToken: user.accessToken,
//         //       };
//         //     }
//         //   } catch (error) {
//         //     console.error("Error during authorization:", error);
//         //   }
//         // }
//         // return null;

//         // Data pengguna dummy untuk otentikasi
//         if (credentials) {
//           const user = {
//             email: "yanto@email.com",
//             password: "rahasia123",
//             name: "Yanto Siburian",
//             role: "mahasiswa",
//             id: 1,
//             image: "https://example.com/user-avatar.jpg",
//             accessToken: "dummy-access-token",
//           };

//           if (
//             credentials.email === user.email &&
//             credentials.password === user.password
//           ) {
//             return {
//               name: user.name,
//               email: user.email,
//               role: user.role,
//               id: user.id,
//               image: user.image,
//               accessToken: user.accessToken,
//             };
//           }
//         }
//         return null; // Otentikasi gagal
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

// const handler = NextAuth(OPTIONS);

// export { handler as GET, handler as POST };

// import NextAuth from "next-auth"
// import CredentialsProvider from "next-auth/providers/credentials"

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       type: 'credentials',
//       credentials: {},
//       async authorize(credentials, req) {
//         const {email, password} = credentials as {
//           email: string,
//           password: string,
//         };
//         // validate here your username and password
//         if(email !== 'alex@email.com' && password !== "qqqqq") {
//           throw new Error('invalid credentials');
//         }
//         // confirmed users
//         return {id: 1, name: 'Alex', email: 'alex@email.com'}
//       }
//     }),
//   ],
//   pages: {
//     signIn: "/auth/login",
//   }
// })
