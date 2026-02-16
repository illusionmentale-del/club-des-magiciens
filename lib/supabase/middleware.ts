import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // refresh session if expired
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // 1. PUBLIC ROUTES (No Auth Needed)
    const publicPaths = ['/login', '/signup', '/auth', '/api', '/_next', '/static', '/favicon.ico', '/pricing', '/'];
    const isPublic = publicPaths.some(path => request.nextUrl.pathname.startsWith(path) || request.nextUrl.pathname === '/');

    if (!user && !isPublic) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    if (user) {
        // 2. STRICT RBAC REDIRECTION
        // We query the profile to get the exact role/access_level
        const { data: profile } = await supabase
            .from('profiles')
            .select('access_level, role')
            .eq('id', user.id)
            .single();

        const isKid = profile?.access_level === 'kid';
        const isAdmin = profile?.role === 'admin';
        const path = request.nextUrl.pathname;

        // KIDS Enforcement
        if (isKid) {
            // Kid trying to access Adult/Admin areas
            if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
                return NextResponse.redirect(new URL('/kids', request.url));
            }
            // Allow /kids, /watch, /account
        }

        // ADULTS Enforcement
        else {
            // Adult trying to access Kids area
            // Admin MAY access kids area for content check, but Regular Adult should NOT.
            if (!isAdmin && path.startsWith('/kids')) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }

        // Anti-Loop / Root Redirection
        if (path === '/') {
            if (isKid) return NextResponse.redirect(new URL('/kids', request.url));
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return supabaseResponse
}
