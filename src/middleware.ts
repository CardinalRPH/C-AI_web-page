import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;
    const isProtectedRoute = pathname.startsWith('/chats');
    const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/signup');

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/chats', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/chats/:path*', '/login', '/signup'],
};