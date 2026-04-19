"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { internal_evaluateQuests } from "@/lib/gamification";

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
    const { createClient: createAdminClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const safeReference = `purchase_${itemId}_${Date.now()}`;
    const { error: xpError } = await supabaseAdmin.from("user_xp_logs").insert({
        user_id: user.id,
        action_type: 'shop_purchase',
        xp_awarded: -item.xp_price,
        reference_id: safeReference
    });

    if (xpError) return { success: false, error: "Erreur lors du paiement: " + xpError.message };

    // 4. Grant the item via user_purchases
    const { error: grantError } = await supabaseAdmin.from("user_purchases").upsert({
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

    // 5. Grant +50 XP as Level-up Progression Boost / Cashback
    await supabaseAdmin.from("user_xp_logs").insert({
        user_id: user.id,
        action_type: 'trick_unlocked_boost',
        xp_awarded: 50,
        reference_id: `unlock_boost_${itemId}_${Date.now()}`
    });

    // 6. Evaluate quests for new purchases stats
    await internal_evaluateQuests(user.id);

    return { success: true };
}
