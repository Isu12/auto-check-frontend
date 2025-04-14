import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authApi } from '../auth/services/auth/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublicPath = path.startsWith('/auth') || path === '/';
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (path.startsWith('/dashboard')) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url));
    }

    if (!accessToken && refreshToken) {
      try {
        const data = await authApi.refreshToken(refreshToken);
        const response2 = NextResponse.next();

        response2.cookies.set('accessToken', data.data.accessToken, {
          maxAge: 60 * 60,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });

        response2.cookies.set('refreshToken', data.data.refreshToken, {
          maxAge: 4 * 60 * 60,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });

        return response2;
      } catch {
        return NextResponse.redirect(new URL('/auth/sign-in', request.url));
      }
    }
  }

  if (isPublicPath) {
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};