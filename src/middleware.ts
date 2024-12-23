import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes pattern
  const protectedPaths = ['/dashboard', '/profile', '/workouts'];
  const isProtectedPath = protectedPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedPath && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Auth routes pattern (prevent authenticated users from accessing)
  const authPaths = ['/login', '/signup'];
  const isAuthPath = authPaths.some(path => 
    req.nextUrl.pathname.startsWith(path)
  );

  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/workouts/:path*',
    '/login',
    '/signup',
  ],
};
