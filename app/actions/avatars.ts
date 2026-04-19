"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function equipSkin(skinId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Non connecté" };

    // 1. Verify if skin exists and if it is default
    const { data: skin } = await supabase.from('avatar_skins').select('is_default').eq('id', skinId).single();
    if (!skin) return { success: false, error: "Skin introuvable" };

    // 2. If not default, verify ownership
    if (!skin.is_default) {
        const { data: ownership } = await supabase
            .from('user_unlocked_skins')
            .select('id')
            .eq('user_id', user.id)
            .eq('skin_id', skinId)
            .single();
            
        if (!ownership) {
            return { success: false, error: "Tu dois d'abord débloquer ce skin" };
        }
    }

    // 3. Update profile
    const { error } = await supabase
        .from('profiles')
        .update({ equipped_skin_id: skinId })
        .eq('id', user.id);

    if (error) {
        console.error("Failed to equip skin:", error);
        return { success: false, error: "Erreur lors de l'équipement" };
    }

    revalidatePath("/", "layout");
    return { success: true };
}

export async function buySkinWithXP(skinId: string, _clientPrice?: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Non connecté" };

    // 0. Security: fetch REAL price from database to avoid client tampering
    const { data: skinData } = await supabase.from('avatar_skins').select('price_xp').eq('id', skinId).single();
    if (!skinData) return { success: false, error: "Cet objet est introuvable" };
    
    const truePrice = skinData.price_xp;

    // 1. Calculate balance
    const { data: xpLogs } = await supabase.from("user_xp_logs").select("xp_awarded").eq("user_id", user.id);
    const balance = xpLogs ? xpLogs.reduce((acc, log) => acc + log.xp_awarded, 0) : 0;

    if (balance < truePrice) {
        return { success: false, error: "Fonds insuffisants" };
    }

    // Use admin client to bypass insert RLS restrictions
    const { createClient: createAdminClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 2. Unlock the skin
    const { error: insertError } = await supabaseAdmin.from('user_unlocked_skins').insert({
        user_id: user.id,
        skin_id: skinId
    });

    if (insertError) {
        console.error("Failed to unlock skin:", insertError);
        return { success: false, error: "Tu possèdes peut-être déjà cet objet" };
    }

    // 3. Deduct XP
    await supabaseAdmin.from("user_xp_logs").insert({
        user_id: user.id,
        action_type: "skin_purchase",
        xp_awarded: -Math.abs(truePrice), // Negative
        reference_id: `skin_${skinId}_${Date.now()}`
    });

    // 4. Optionally equip it immediately
    await equipSkin(skinId);

    // 5. Evaluate Quests (for 'shop_purchases' trigger)
    const { internal_evaluateQuests } = await import('@/lib/gamification');
    const questResult = await internal_evaluateQuests(user.id);

    return { success: true, newQuestsData: questResult.newQuestsData };
}
