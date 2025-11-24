import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const apiUrl = process.env.API_URL || 'http://localhost:3000';
    
    // /api/books -> /books
    const path = request.nextUrl.pathname.replace(/^\/api/, '');
    
    // Construct target URL
    const targetUrl = new URL(path, apiUrl);
    targetUrl.search = request.nextUrl.search;

    return NextResponse.rewrite(targetUrl);
  }
}

export const config = {
  matcher: '/api/:path*',
}
