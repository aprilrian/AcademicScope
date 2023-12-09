import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptionConfig";

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (path === "/") {
    return NextResponse.next();
  }

  const session = request.cookies.get("next-auth.session-token");
  console.log(session);

  //  const session = await getServerSession(authOptions);
  //   ({ req: request as any })
  //   console.log(session)

  const isProtected = /^(\/mhs|\/doswal|\/dept|\/admin)/.test(path);

  if (!session && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // else if (session && path === '/login') {
  //   return NextResponse.redirect(new URL('/mhs/dashboard', request.url))
  // }
  return NextResponse.next();
}
