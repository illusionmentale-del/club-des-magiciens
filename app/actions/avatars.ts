"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function equipSkin(skinId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Non connecté" };

    // Update profile
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

export async function buySkinWithXP(skinId: string, itemPrice: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Non connecté" };

    // 1. Calculate balance
    const { data: xpLogs } = await supabase.from("user_xp_logs").select("xp_awarded").eq("user_id", user.id);
    const balance = xpLogs ? xpLogs.reduce((acc, log) => acc + log.xp_awarded, 0) : 0;

    if (balance < itemPrice) {
        return { success: false, error: "Fonds insuffisants" };
    }

    // 2. Unlock the skin
    const { error: insertError } = await supabase.from('user_unlocked_skins').insert({
        user_id: user.id,
        skin_id: skinId
    });

    if (insertError) {
        console.error("Failed to unlock skin:", insertError);
        return { success: false, error: "Tu possèdes peut-être déjà cet objet" };
    }

    // 3. Deduct XP
    await supabase.from("user_xp_logs").insert({
        user_id: user.id,
        action_type: "skin_purchase",
        xp_awarded: -Math.abs(itemPrice), // Negative
        reference_id: `skin_${skinId}_${Date.now()}`
    });

    // 4. Optionally equip it immediately
    await equipSkin(skinId);

    // 5. Evaluate Quests (for 'shop_purchases' trigger)
    const { evaluateQuests } = await import('./quests');
    const questResult = await evaluateQuests(user.id);

    return { success: true, newQuestsData: questResult.newQuestsData };
}
