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

    // 1. Update Profile Info
    const updates: any = {
        updated_at: new Date().toISOString(),
    };
    if (username) updates.username = username;
    if (city) updates.city = city;
    if (bio) updates.bio = bio;
    if (magic_level) updates.magic_level = magic_level;

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
    return { success: "Profil mis à jour avec succès !" };
}
