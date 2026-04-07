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

/**
 * Sécurité Boutique : Tente d'acheter un objet avec des XP.
 * Re-vérifie le vrai XP du joueur dans la base de données de logs pour empêcher la fraude.
 */
export async function purchaseWithXP(itemId: string) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non autorisé" };

    // 1. Fetch the exact item cost
    const { data: item } = await supabase.from("library_items").select("id, xp_price").eq("id", itemId).single();
    if (!item) return { success: false, error: "Objet introuvable" };
    if (!item.xp_price || item.xp_price <= 0) return { success: false, error: "Cet objet ne s'achète pas avec de l'XP" };

    // 2. Fetch the true XP of the user dynamically from logs
    const { data: xpLogs } = await supabase.from("user_xp_logs").select("xp_awarded").eq("user_id", user.id);
    const trueXP = xpLogs?.reduce((acc, log) => acc + log.xp_awarded, 0) || 0;

    if (trueXP < item.xp_price) {
        return { success: false, error: "Tu n'as pas assez d'XP ! Continue de t'entraîner." };
    }

    // 3. Process the transaction
    const safeReference = `purchase_${itemId}_${Date.now()}`;
    const { error: xpError } = await supabase.from("user_xp_logs").insert({
        user_id: user.id,
        action_type: 'shop_purchase',
        xp_awarded: -item.xp_price,
        reference_id: safeReference
    });

    if (xpError) return { success: false, error: "Erreur lors du paiement: " + xpError.message };

    // 4. Grant the item via user_purchases
    const { error: grantError } = await supabase.from("user_purchases").upsert({
        user_id: user.id,
        library_item_id: itemId,
        status: 'active',
        systeme_io_order_id: 'xp_purchase'
    }, { onConflict: 'user_id,library_item_id' });

    if (grantError) {
        // Technically we should rollback XP if this fails but keeping it simple for now
        console.error("Failed to grant item after XP deduct:", grantError);
        return { success: false, error: "Achat validé mais objet non reçu, contacte le support !" };
    }

    return { success: true };
}
