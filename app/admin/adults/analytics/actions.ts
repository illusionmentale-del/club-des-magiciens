"use server";

import { createClient } from "@/lib/supabase/server";

export type AdultUserDetails = {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string | null;
    xp: number;
    created_at: string;
    last_adults_login: string | null;
    has_active_push: boolean;
    last_email_open: string | null;
    magicLevel: string;
};

export async function getAdultsUsersDetailed(): Promise<AdultUserDetails[]> {
    const supabase = await createClient();

    // 1. Fetch all adult profiles
    const { data: profiles, error: profileErr } = await supabase
        .from("profiles")
        .select("id, email, full_name, xp, created_at, last_adults_login, avatar_skins(image_url)")
        .eq("has_adults_access", true)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

    if (profileErr || !profiles) {
        console.error("Error fetching adult profiles:", profileErr);
        return [];
    }

    // Bypass RLS using service role client for sensitive logs and push
    const { createClient: createAdminClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 2. Fetch push subscriptions
    const { data: pushSubs } = await supabaseAdmin
        .from("push_subscriptions")
        .select("user_id");
    
    const pushUserIds = new Set(pushSubs?.map(s => s.user_id) || []);

    // 3. Fetch latest email open logs for these users
    // user_xp_logs has action_type = 'email_opened'
    const { data: emailLogs } = await supabaseAdmin
        .from("user_xp_logs")
        .select("user_id, created_at")
        .eq("action_type", "email_opened")
        .order("created_at", { ascending: false });

    // Map the most recent email open date per user
    const lastEmailMap = new Map<string, string>();
    if (emailLogs) {
        for (const log of emailLogs) {
            if (!lastEmailMap.has(log.user_id)) {
                lastEmailMap.set(log.user_id, log.created_at);
            }
        }
    }

    // 4. Combine all data
    const detailedUsers: AdultUserDetails[] = profiles.map(profile => {
        const xp = profile.xp || 0;
        let magicLevel = "Initié";
        if (xp >= 150) magicLevel = "Illusionniste Confirmé";
        else if (xp >= 50) magicLevel = "Praticien";

        let avatarUrl = null;
        if (profile.avatar_skins && !Array.isArray(profile.avatar_skins) && typeof profile.avatar_skins === 'object') {
            avatarUrl = (profile.avatar_skins as any).image_url || null;
        }

        return {
            id: profile.id,
            email: profile.email || "Non renseigné",
            full_name: profile.full_name || "Élève Mystère",
            avatar_url: avatarUrl,
            xp: xp,
            created_at: profile.created_at,
            last_adults_login: profile.last_adults_login,
            has_active_push: pushUserIds.has(profile.id),
            last_email_open: lastEmailMap.get(profile.id) || null,
            magicLevel: magicLevel
        };
    });

    return detailedUsers;
}
