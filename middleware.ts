import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { guestRegex, isDevelopmentEnvironment, getAuthSecret } from './lib/constants';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Playwright starts the dev server and requires a 200 status to
   * begin the tests, so this ensures that the tests can start
   */
  if (pathname.startsWith('/ping')) {
    return new Response('pong', { status: 200 });
  }

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  try {
    const token = await getToken({
      req: request,
      secret: getAuthSecret(),
      secureCookie: !isDevelopmentEnvironment,
    });

    if (!token) {
      const redirectUrl = encodeURIComponent(request.url);

      return NextResponse.redirect(
        new URL(`/api/auth/guest?redirectUrl=${redirectUrl}`, request.url),
      );
    }

    const isGuest = guestRegex.test(token?.email ?? '');

    if (token && !isGuest && ['/login', '/register'].includes(pathname)) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    
    // If AUTH_SECRET is missing, redirect to a setup/error page
    if (error instanceof Error && error.message.includes('AUTH_SECRET')) {
      // Allow access to static files and auth endpoints
      if (pathname.startsWith('/_next/') || 
          pathname.startsWith('/api/auth') || 
          pathname === '/favicon.ico') {
        return NextResponse.next();
      }
      
      // For other routes, redirect to login with error message
      return NextResponse.redirect(
        new URL('/api/auth/error?error=Configuration', request.url),
      );
    }
    
    // For other errors, return 500
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'content-type': 'application/json' } }
    );
  }
}

export const config = {
  matcher: [
    '/',
    '/chat/:id',
    '/api/:path*',
    '/login',
    '/register',

    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
