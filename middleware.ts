import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const hostname = request.headers.get('host');

    // Domain-Based Routing for "Club des Petits Magiciens"
    // Checks for production domain OR local subdomain/custom hosts for testing
    // Support both hyphenated and non-hyphenated versions just in case
    const isKidsDomain = hostname?.includes('clubdespetitsmagiciens') || hostname?.includes('club-des-petits-magiciens') || hostname?.startsWith('kids.');

    if (isKidsDomain) {
        // Rewrite root and login paths to the kids login page
        if (requestUrl.pathname === '/' || requestUrl.pathname === '/login') {
            return NextResponse.rewrite(new URL('/login/kids', request.url));
        }
    }

    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
