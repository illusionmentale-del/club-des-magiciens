"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfile(prevState: any, formData: FormData) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Non connecté" };

    const username = formData.get("username") as string;
    const city = formData.get("city") as string;
    const bio = formData.get("bio") as string;
    const magic_level = formData.get("magic_level") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const avatarUrl = formData.get("avatarUrl") as string;
    const theme = formData.get("theme") as string;

    // 1. Update Profile Info
    const updates: any = {
        updated_at: new Date().toISOString(),
    };
    if (username) updates.username = username;
    if (city) updates.city = city;
    if (bio) updates.bio = bio;
    if (magic_level) updates.magic_level = magic_level;

    const targetProfile = formData.get("targetProfile") as string; // 'kid' or 'adult'

    // Avatar Logic: Separate fields based on targetProfile
    if (avatarUrl) {
        if (targetProfile === 'kid') {
            updates.avatar_url_kids = avatarUrl;
            // Also ensure we update the main one if it's empty? No, keep separate.
        } else {
            updates.avatar_url = avatarUrl;
        }
    }

    const { error: profileError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", user.id);

    if (profileError) {
        return { error: "Erreur lors de la mise à jour du profil: " + profileError.message };
    }

    // 2. Update Password (Optional)
    if (password && password.length > 0) {
        if (password !== confirmPassword) {
            return { error: "Les mots de passe ne correspondent pas", success: "Profil mis à jour, mais mot de passe échoué." };
        }
        if (password.length < 6) {
            return { error: "Mot de passe trop court", success: "Profil mis à jour, mais mot de passe échoué." };
        }

        const { error: passwordError } = await supabase.auth.updateUser({ password: password });
        if (passwordError) {
            return { error: "Erreur mot de passe: " + passwordError.message, success: "Profil mis à jour." };
        }
    }

    revalidatePath("/dashboard/account");
    revalidatePath("/kids/account");
    revalidatePath("/kids");
    return { success: "Profil mis à jour avec succès !" };
}
