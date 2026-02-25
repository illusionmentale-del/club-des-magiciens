"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function loginWithPassword(prevState: any, formData: FormData) {
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;
    const redirectUrl = formData.get("redirect") as string || "/dashboard";

    if (!identifier || !password) {
        return { error: "Identifiant et mot de passe requis." };
    }

    const supabase = await createClient(); // For Auth/Cookies (Standard Client)
    let email = identifier;

    // Logic: If identifier is NOT an email, treat as Username
    if (!identifier.includes("@")) {
        const admin = createAdminClient(); // Service Role Client (to lookup profiles)

        // 1. Find Profile by Username
        const { data: profile } = await admin
            .from("profiles")
            .select("id")
            .eq("username", identifier.toLowerCase().trim())
            .single();

        if (!profile) {
            return { error: "Identifiant inconnu." };
        }

        // 2. Get Email from User ID
        const { data: { user }, error: userError } = await admin.auth.admin.getUserById(profile.id);

        if (userError || !user || !user.email) {
            return { error: "Erreur lors de la récupération du compte." };
        }

        email = user.email;
    }

    // 3. Sign In with Email (resolved or direct) & Password
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: "Mot de passe incorrect ou compte inexistant." };
    }

    // 4. First Login Onboarding Check
    let finalRedirectUrl = redirectUrl;
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data: profile } = await supabase
            .from("profiles")
            .select("access_level, username")
            .eq("id", user.id)
            .single();

        if (profile && profile.access_level === 'kid') {
            if (!profile.username || profile.username.trim() === '') {
                finalRedirectUrl = '/kids/account?view=settings';
            } else if (finalRedirectUrl === '/dashboard') {
                finalRedirectUrl = '/kids/courses'; // Default safe route for kids
            }
        }
    }

    redirect(finalRedirectUrl);
}
