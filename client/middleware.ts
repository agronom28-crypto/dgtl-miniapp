import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Paths that don't require authentication
const publicPaths = [
  '/_next',
  '/api/auth',
  '/api/shop',
  '/api/users',
  '/api/staking',
  '/api/minerals',
  '/api/levels',
  '/api/stars',
  '/api/admin',
  '/static',
  '/fonts',
  '/images',
    '/icons',
  '/auth/error',
  '/auth/signout',
  '/shop',
  '/staking',
  '/authpage',
  '/payment',
  '/boosts',
  '/collection',
  '/friends',
  '/tasks',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check authentication
  const token = await getToken({ req: request });

  if (!token) {
    const signInUrl = new URL('/authpage', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
