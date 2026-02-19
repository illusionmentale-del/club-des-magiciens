"use server";

import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard/settings`, // Redirect to settings to change password
    });

    if (error) {
        console.error("Reset password error:", error);
        return { error: "Impossible d'envoyer l'email. Vérifie l'adresse." };
    }

    return { success: true };
}
