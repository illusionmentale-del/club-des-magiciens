"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { WelcomeKidEmail } from "@/components/emails/WelcomeKidEmail";

export async function approveVipRequest(requestId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Unauthorized" };

    // Fetch request
    const { data: request, error: reqError } = await supabaseAdmin
        .from("vip_requests")
        .select("*")
        .eq("id", requestId)
        .single();

    if (reqError || !request) return { error: "Request not found" };
    if (request.status !== 'en_attente') return { error: "Déjà traité" };

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUsers?.users.find(u => u.email === request.parent_email);

    if (userExists) {
        // User already exists, just update request status
        await supabaseAdmin.from("vip_requests").update({ status: 'approuve' }).eq("id", requestId);
        revalidatePath("/admin/kids/vip-requests");
        return { success: true, message: "Utilisateur déjà existant. Statut mis à jour." };
    }

    // Generate random pass
    const password = Math.random().toString(36).slice(-10) + "A1!";

    // Create user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: request.parent_email,
        password: password,
        email_confirm: true,
        user_metadata: { full_name: request.child_name }
    });

    if (createError || !newUser.user) {
        console.error("Error creating user:", createError);
        return { error: "Impossible de créer le compte." };
    }

    // Profile creation should be handled by trigger, but we ensure access_level is Kid
    await supabaseAdmin.from("profiles").upsert({
        id: newUser.user.id,
        username: request.child_name,
        full_name: request.child_name,
        role: "kid",
        access_level: "kid",
        is_kid: true
    });

    // Send Welcome Email
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.NODE_ENV === 'development'
            ? 'Club des Petits Magiciens <onboarding@resend.dev>'
            : 'Club des Petits Magiciens <contact@clubdespetitsmagiciens.fr>';

        // Generate magic link
        const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: request.parent_email,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://clubdespetitsmagiciens.fr'}/login`
            }
        });

        await resend.emails.send({
            from: fromEmail,
            to: [request.parent_email],
            subject: 'Magie ! Ton accès offert au Club 🎩✨',
            react: WelcomeKidEmail({
                username: request.child_name,
                loginUrl: "https://clubdespetitsmagiciens.fr/login",
                recoveryUrl: linkData?.properties?.action_link
            }) as React.ReactElement,
        });
    } catch (e) {
        console.error("Error sending welcome email:", e);
    }

    // Mark as approved
    await supabaseAdmin.from("vip_requests").update({ status: 'approuve' }).eq("id", requestId);
    
    revalidatePath("/admin/kids/vip-requests");
    return { success: true };
}

export async function rejectVipRequest(requestId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    await supabaseAdmin.from("vip_requests").update({ status: 'rejete' }).eq("id", requestId);
    revalidatePath("/admin/kids/vip-requests");
    return { success: true };
}
