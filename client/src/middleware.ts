import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  if (path === '/' ) {
    return NextResponse.next()
  }

  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isProtected = /^(\/mahasiswa|\/dosen|\/departemen|\/operator)/.test(path);

  if (!session && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  } else if (session && path === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return NextResponse.next()
}

// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { getToken } from 'next-auth/jwt'

// export default async function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;

//   if (path === '/') {
//     return NextResponse.next();
//   }

//   const session = await getToken({
//     req: request,
//     secret: process.env.NEXTAUTH_SECRET,
//   });

//   if (!session) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   } else {
//     // Dapatkan peran (role) pengguna dari sesi
//     const userRole = session.role;

//     if (path === '/login' || path === '/dashboard') {
//       // Redirect ke dashboard berdasarkan peran pengguna
//       switch (userRole) {
//         case 'operator':
//           return NextResponse.redirect(new URL('/operator/dashboard', request.url));
//         case 'dosen':
//           return NextResponse.redirect(new URL('/dosen/dashboard', request.url));
//         case 'mahasiswa':
//           return NextResponse.redirect(new URL('/mahasiswa/dashboard', request.url));
//         case 'departemen':
//           return NextResponse.redirect(new URL('/departemen/dashboard', request.url));
//         default:
//           return NextResponse.redirect(new URL('/login', request.url));
//       }
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/app/:path*"],
// };

