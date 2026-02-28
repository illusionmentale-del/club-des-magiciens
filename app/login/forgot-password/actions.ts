"use server";

import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export async function requestPasswordReset(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const supabase = await createClient();
    const { data: profile } = await supabase.from('profiles').select('access_level').eq('email', email).maybeSingle();
    const redirectPath = profile?.access_level === 'kid' ? '/kids/account?view=settings' : '/dashboard/settings';

    const headerList = await headers();
    const host = headerList.get("host") || "clubdespetitsmagiciens.fr";
    const protocol = host.includes("localhost") ? "http" : "https";
    const origin = `${protocol}://${host}`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
    });

    if (error) {
        console.error("Reset password error:", error);
        return { error: "Impossible d'envoyer l'email. Vérifie l'adresse." };
    }

    return { success: true };
}
