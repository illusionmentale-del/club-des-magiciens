"use server";

import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Initialization of the bypass admin client
const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

// Verify admin authorization
async function verifyAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Non autorisé");

    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Accès refusé - Réservé aux administrateurs");
    return user;
}

// === BADGES ===
export async function createBadgeAdmin(payload: any) {
    await verifyAdmin();
    const { error } = await supabaseAdmin.from('badges').insert([payload]);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/kids/gamification");
    revalidatePath("/admin/adults/gamification");
    return { success: true };
}

export async function deleteBadgeAdmin(id: string) {
    await verifyAdmin();
    const { error } = await supabaseAdmin.from('badges').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/kids/gamification");
    revalidatePath("/admin/adults/gamification");
    return { success: true };
}

// === LEVELS ===
export async function createLevelAdmin(payload: any) {
    await verifyAdmin();
    const { error } = await supabaseAdmin.from('gamification_levels').insert([payload]);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/kids/gamification");
    revalidatePath("/admin/adults/gamification");
    return { success: true };
}

export async function deleteLevelAdmin(id: string) {
    await verifyAdmin();
    const { error } = await supabaseAdmin.from('gamification_levels').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/kids/gamification");
    revalidatePath("/admin/adults/gamification");
    return { success: true };
}

// === SKINS ===
export async function createSkinAdmin(payload: any) {
    await verifyAdmin();
    const { error } = await supabaseAdmin.from('avatar_skins').insert([payload]);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/kids/gamification");
    revalidatePath("/admin/adults/gamification");
    return { success: true };
}

export async function deleteSkinAdmin(id: string) {
    await verifyAdmin();
    const { error } = await supabaseAdmin.from('avatar_skins').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/kids/gamification");
    revalidatePath("/admin/adults/gamification");
    return { success: true };
}

// === QUESTS ===
export async function createQuestAdmin(payload: any) {
    await verifyAdmin();
    const { error } = await supabaseAdmin.from('gamification_quests').insert([payload]);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/kids/gamification");
    revalidatePath("/admin/adults/gamification");
    return { success: true };
}

export async function deleteQuestAdmin(id: string) {
    await verifyAdmin();
    const { error } = await supabaseAdmin.from('gamification_quests').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath("/admin/kids/gamification");
    revalidatePath("/admin/adults/gamification");
    return { success: true };
}
