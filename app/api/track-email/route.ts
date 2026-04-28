import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('e');

    if (email) {
        try {
            // Determine real email since it was encoded in the template
            const decodedEmail = decodeURIComponent(email);
            
            // Bypass RLS completely for this tracking route by using the service role key internally, 
            // OR use the regular server client. Since server client without session only has anon access, 
            // and profiles table might be protected, we should use the service role key to log the XP reliably.
            // However, `createClient()` from `@/lib/supabase/server` uses cookies, which are empty here.
            // Let's create a direct service role client for this background task.
            const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
            const supabaseAdmin = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            // Find the user ID
            const { data: profile } = await supabaseAdmin
                .from('profiles')
                .select('id')
                .eq('email', decodedEmail)
                .single();

            if (profile?.id) {
                // Log the email open event in user_xp_logs
                // We use a general reference_id. If we had a campaign ID we would use it.
                // To avoid spamming, we can just insert it. Or we can upsert if we only care about the latest,
                // but user_xp_logs is an append-only log. 
                // We'll just insert a 0 XP log for tracking purposes.
                await supabaseAdmin.from('user_xp_logs').insert({
                    user_id: profile.id,
                    action_type: 'email_opened',
                    xp_awarded: 0,
                    reference_id: `email_open_${new Date().toISOString().split('T')[0]}` // One log per day max via reference_id if unique constraint exists, else just inserts.
                });
            }
        } catch (err) {
            // Ignore errors to always return the image quickly
            console.error("Email tracking error:", err);
        }
    }

    // Return a 1x1 transparent GIF
    const transparentGif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    
    return new NextResponse(transparentGif, {
        status: 200,
        headers: {
            'Content-Type': 'image/gif',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
            'Surrogate-Control': 'no-store'
        },
    });
}
