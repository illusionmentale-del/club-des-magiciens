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

    // 0. DÉTECTION DU DOMAINE (Multi-Domain Routing)
    const hostname = request.headers.get('host') || '';
    // On considère "Atelier" si le host contient atelierdesmagiciens ou commence par atelier.
    const isAdultsDomain = hostname.includes('atelierdesmagiciens') || hostname.startsWith('atelier.');
    // Sinon, par défaut ou si clubdespetitsmagiciens, c'est le domaine Kids.
    const isKidsDomain = !isAdultsDomain;

    // 1. PUBLIC ROUTES (No Auth Needed)
    const publicPaths = ['/tarifs', '/login', '/signup', '/auth', '/api', '/_next', '/static', '/favicon.ico', '/pricing', '/', '/success'];
    // Ignore dynamic routes checking on '/' since it's exact match
    const isPublic = publicPaths.some(path => request.nextUrl.pathname.startsWith(path) && request.nextUrl.pathname !== '/') || request.nextUrl.pathname === '/';

    if (!user) {
        // Redirection racine pour les non-connectés vers la BONNE page de vente
        if (request.nextUrl.pathname === '/') {
            if (isAdultsDomain) {
                // Redirect unauthenticated Atelier traffic to the sales page
                return NextResponse.redirect(new URL('/tarifs/atelier-des-magiciens', request.url));
            } else {
                return NextResponse.redirect(new URL('/tarifs/kids', request.url));
            }
        }

        if (!isPublic) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    if (user) {
        // 2. STRICT RBAC REDIRECTION & DOMAIN ROUTING
        // We query the profile to get the exact access booleans
        const { data: profile } = await supabase
            .from('profiles')
            .select('access_level, role, has_adults_access, has_kids_access')
            .eq('id', user.id)
            .single();

        const hasKidsAccess = profile?.has_kids_access === true || profile?.access_level === 'kid';
        const hasAdultsAccess = profile?.has_adults_access === true || profile?.access_level === 'default';
        const isAdmin = profile?.role === 'admin';
        const path = request.nextUrl.pathname;

        // KIDS Enforcement
        if (!hasAdultsAccess && hasKidsAccess) {
            // Strictly kid trying to access Adult/Admin areas
            if (path.startsWith('/dashboard') || path.startsWith('/admin')) {
                return NextResponse.redirect(new URL('/kids', request.url));
            }
        }

        // ADULTS Enforcement
        else if (hasAdultsAccess && !hasKidsAccess) {
            // Strictly Adult trying to access Kids area
            // Admin MAY access kids area for content check
            if (!isAdmin && path.startsWith('/kids')) {
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }

        // Anti-Loop / Root Redirection (L'Aiguilleur)
        if (path === '/') {
            if (isAdultsDomain) {
                if (hasAdultsAccess) return NextResponse.redirect(new URL('/dashboard', request.url));
                if (hasKidsAccess) return NextResponse.redirect(new URL('/kids', request.url));
            } else {
                if (hasKidsAccess) return NextResponse.redirect(new URL('/kids', request.url));
                if (hasAdultsAccess) return NextResponse.redirect(new URL('/dashboard', request.url));
            }
            // Fallback
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return supabaseResponse
}
