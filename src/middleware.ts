import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin-only routes
    const adminRoutes = ['/products', '/customers', '/suppliers', '/purchases'];
    const isAdminRoute = adminRoutes.some(route => path.startsWith(route));

    if (isAdminRoute && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // API protection for admin endpoints
    if (path.startsWith('/api/products') ||
        path.startsWith('/api/customers') ||
        path.startsWith('/api/suppliers') ||
        path.startsWith('/api/purchases')) {
      if (token?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }

    // Order confirmation - admin only
    if (path.includes('/confirm') && token?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/products/:path*',
    '/customers/:path*',
    '/suppliers/:path*',
    '/orders/:path*',
    '/purchases/:path*',
    '/api/products/:path*',
    '/api/customers/:path*',
    '/api/suppliers/:path*',
    '/api/orders/:path*',
    '/api/purchases/:path*',
  ],
};
