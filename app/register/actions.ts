"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function registerAccount(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;
    const redirectUrl = formData.get("redirect") as string || "/kids";

    if (!email || !password || !username) {
        return { error: "Tous les champs sont requis." };
    }

    const supabaseAdmin = createAdminClient();
    const supabase = await createClient();

    // 1. Create User via Admin (bypasses email confirmation requirement)
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: username }
    });

    if (error) {
        console.error("Error creating user:", error);
        return { error: error.message };
    }

    // 2. Ensure Profile Exists with Kid Access Level
    if (data.user) {
        const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
            id: data.user.id,
            username: username.toLowerCase().replace(/\s+/g, ''),
            full_name: username,
            role: 'kid', // Changed from user to kid for dashboard visibility
            access_level: 'kid',
            is_kid: true
        });

        if (profileError) console.error("Profile update error:", profileError);
    }

    // 3. Log the user in their current browser session
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (signInError) {
        return { error: "Compte créé mais erreur de connexion automatique." };
    }

    // 4. Redirect them to where they were going (e.g. /tarifs/kids)
    redirect(redirectUrl);
}
