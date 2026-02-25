"use server";

import { createClient } from "@/lib/supabase/server";

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const supabase = await createClient();
    const { data: profile } = await supabase.from('profiles').select('access_level').eq('email', email).maybeSingle();
    const redirectPath = profile?.access_level === 'kid' ? '/kids/account?view=settings' : '/dashboard/settings';

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://clubdespetitsmagiciens.fr'}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
    });

    if (error) {
        console.error("Reset password error:", error);
        return { error: "Impossible d'envoyer l'email. Vérifie l'adresse." };
    }

    return { success: true };
}
