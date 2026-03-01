import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const token = request.cookies.get('admin_token')?.value

    // Protect all routes starting with /dashboard
    if (request.nextUrl.pathname.startsWith('/dashboard')) {
        if (token !== 'authenticated') {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // If trying to access /login and already logged in, redirect to dashboard
    if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/') {
        if (token === 'authenticated') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
