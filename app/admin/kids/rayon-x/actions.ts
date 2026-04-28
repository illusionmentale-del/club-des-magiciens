"use server";

import { createClient } from "@/lib/supabase/server";

export type KidUserDetails = {
    id: string;
    email: string;
    full_name: string;
    avatar_url_kids: string;
    magic_level: number;
    xp: number;
    created_at: string;
    last_kids_login: string | null;
    has_active_push: boolean;
    last_email_open: string | null;
};

export async function getKidsUsersDetailed(): Promise<KidUserDetails[]> {
    const supabase = await createClient();

    // 1. Fetch all kids profiles
    const { data: profiles, error: profileErr } = await supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url_kids, magic_level, xp, created_at, last_kids_login")
        .eq("has_kids_access", true)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

    if (profileErr || !profiles) {
        console.error("Error fetching kids profiles:", profileErr);
        return [];
    }

    // 2. Fetch push subscriptions
    const { data: pushSubs } = await supabase
        .from("push_subscriptions")
        .select("user_id");
    
    const pushUserIds = new Set(pushSubs?.map(s => s.user_id) || []);

    // 3. Fetch latest email open logs for these users
    // user_xp_logs has action_type = 'email_opened'
    const { data: emailLogs } = await supabase
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
    const detailedUsers: KidUserDetails[] = profiles.map(profile => ({
        ...profile,
        has_active_push: pushUserIds.has(profile.id),
        last_email_open: lastEmailMap.get(profile.id) || null,
        full_name: profile.full_name || "Élève Mystère",
        email: profile.email || "Non renseigné",
    }));

    return detailedUsers;
}
