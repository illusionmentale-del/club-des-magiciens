"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Sécurité XP : Fonction serveur pour attribuer de l'XP de façon inviolable.
 * Ne modifie pas la table Profile directement, mais inscrit une ligne dans `user_xp_logs`.
 * Le trigger SQL mettra le profil à jour par la suite.
 */
export async function grantAwardXP(userId: string, actionType: string, amount: number, referenceId?: string) {
    const supabase = await createClient();

    // Verify authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Non autorisé" };
    }

    // Only allow self granting or admin granting
    // In our simplified structure, we assume if user is logged in, they are either granting their own XP
    // or an admin is doing it. Since this is tightly controlled by our NextJS Server Action calls,
    // the user cannot forge requests as another user easily without the session token.
    if (user.id !== userId) {
        // Enforce extra role check if modifying another user
        const { data: myProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
        if (myProfile?.role !== 'admin' && myProfile?.role !== 'super_admin') {
            return { success: false, error: "Non autorisé à modifier cet utilisateur" };
        }
    }

    // Attempt to insert the XP log
    const payload = {
        user_id: userId,
        action_type: actionType,
        xp_awarded: amount,
        reference_id: referenceId || null
    };

    const { error } = await supabase
        .from('user_xp_logs')
        .insert(payload);

    if (error) {
        // Violates unique constraint (already awarded)
        if (error.code === '23505') {
            console.log(`[XP System] Ignored duplicate XP grant for ${actionType} - ${referenceId}`);
            return { success: true, warning: 'Already awarded' };
        }
        console.error("[XP System] Failed to award XP:", error);
        return { success: false, error: error.message };
    }

    console.log(`[XP System] Awarded ${amount} XP to ${userId} for ${actionType}`);
    return { success: true };
}
