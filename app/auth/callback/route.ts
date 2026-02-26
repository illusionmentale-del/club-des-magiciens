import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

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
                    .select('has_adults_access, has_kids_access, role')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    if (profile.role === 'admin') {
                        redirectPath = '/admin/adults/dashboard';
                    } else if (profile.has_adults_access) {
                        redirectPath = '/dashboard/courses';
                    } else if (profile.has_kids_access) {
                        redirectPath = '/kids/courses';
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
