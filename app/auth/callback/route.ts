import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    let next = searchParams.get('next') ?? '/'
    // SECURITY: Prevent Open Redirect
    if (!next.startsWith('/') || next.startsWith('//')) {
        next = '/'
    }

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Determine redirect path based on user role
            const { data: { user } } = await supabase.auth.getUser();
            let redirectPath = next;

            if (user && next === '/') {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('has_adults_access, has_kids_access, kids_trial_expires_at, role')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    let hasTrial = false;
                    if (profile.kids_trial_expires_at) {
                        const expiry = new Date(profile.kids_trial_expires_at);
                        if (expiry > new Date()) {
                            hasTrial = true;
                        }
                    }

                    if (profile.role === 'admin') {
                        redirectPath = '/admin/adults/dashboard';
                    } else if (profile.has_adults_access) {
                        redirectPath = '/dashboard/courses';
                    } else if (profile.has_kids_access || hasTrial) {
                        redirectPath = '/kids';
                    } else {
                        // Fallback
                        redirectPath = '/dashboard';
                    }
                }
            }

            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'

            if (isLocalEnv) {
                return NextResponse.redirect(`${origin}${redirectPath}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`)
            } else {
                return NextResponse.redirect(`${origin}${redirectPath}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
