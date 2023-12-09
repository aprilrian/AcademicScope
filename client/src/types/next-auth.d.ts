import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      image: string;
      id: string;
      username: string;
      email: string;
      role: string;
      password: string;
      access_token: string;
      refreshToken: string;
      nama: string;
      isFirstLogin?: boolean;

    };
  }
};
