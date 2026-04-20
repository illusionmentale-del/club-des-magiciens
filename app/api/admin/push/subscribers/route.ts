import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Fetch all subscriptions
        const { data: subs, error: subsError } = await supabase
            .from("push_subscriptions")
            .select("user_id, platform, created_at");

        if (subsError) throw new Error(subsError.message);
        if (!subs || subs.length === 0) return NextResponse.json([]);

        // Get unique user IDs
        const uniqueUserIds = [...new Set(subs.map(s => s.user_id))];

        // Fetch user profiles
        const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("id, full_name, email, role, has_kids_access, has_adults_access")
            .in("id", uniqueUserIds);

        if (profilesError) throw new Error(profilesError.message);

        // Merge data to return a clean list to the admin
        const enrichedSubs = uniqueUserIds.map(userId => {
            const profile = profiles?.find(p => p.id === userId);
            const userSubs = subs.filter(s => s.user_id === userId);
            
            return {
                id: userId,
                full_name: profile?.full_name || "Utilisateur anonyme",
                email: profile?.email || "N/A",
                role: profile?.role,
                access: {
                    kids: profile?.has_kids_access,
                    adults: profile?.has_adults_access
                },
                devices: userSubs.length,
                platforms: [...new Set(userSubs.map(s => s.platform))]
            };
        });

        // Sort admins first, then by name
        enrichedSubs.sort((a, b) => {
            if (a.role === 'admin' && b.role !== 'admin') return -1;
            if (a.role !== 'admin' && b.role === 'admin') return 1;
            return a.full_name.localeCompare(b.full_name);
        });

        return NextResponse.json(enrichedSubs);

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
