"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function loginWithPassword(prevState: any, formData: FormData) {
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

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

    redirect("/dashboard");
}
