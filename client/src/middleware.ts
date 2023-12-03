import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from 'next-auth/react'

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path === '/' ) {
    return NextResponse.next()
  }

  const session = await getSession({ req: request as any })

  const isProtected = /^(\/mahasiswa|\/dosen|\/departemen|\/operator)/.test(path);

  if (!session && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  } else if (session && path === '/login') {
    return NextResponse.redirect(new URL('/mhs/dashboard', request.url))
  }
  return NextResponse.next()
}
