"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";

export async function sendBroadcastAlert(formData: FormData) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    const supabaseAuth = await createClient();
    const { data: { user } } = await supabaseAuth.auth.getUser();

    if (!user) {
        return { error: "Non autorisé" };
    }

    const { data: profile } = await supabaseAuth.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        return { error: "Accès refusé" };
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const linkUrl = formData.get("linkUrl") as string;
    const audience = formData.get("audience") as string || 'kids';

    if (!title || !content) {
        return { error: "Le titre et le contenu sont obligatoires." };
    }

    // 1. Insert Alert into Database
    const { data: newAlert, error: insertError } = await supabaseAdmin.from("global_alerts").insert({
        title,
        content,
        link_url: linkUrl || null,
        target_audience: audience
    }).select().single();

    if (insertError) {
        console.error("Error creating global alert:", insertError);
        return { error: "Erreur lors de la création de l'alerte." };
    }

    // 2. Send Emails to Target Audience
    const { data: profiles, error: fetchError } = await supabaseAdmin
        .from('profiles')
        .select('email')
        .eq('access_level', 'kid')
        .not('email', 'is', null)
        .not('deleted_at', 'is', null); // Wait, we want active users! 

    // Correcting the query above.
    const { data: activeProfiles, error: fetchProfilesError } = await supabaseAdmin
        .from('profiles')
        .select('email')
        .eq('access_level', 'kid')
        .is('deleted_at', null)
        .not('email', 'is', null);

    if (fetchProfilesError) {
        console.error("Error fetching profiles for broadcast:", fetchProfilesError);
        return { error: "L'alerte est créée, mais l'envoi des emails a échoué." };
    }

    const validEmails = activeProfiles?.map(p => p.email).filter(Boolean) as string[];

    if (validEmails && validEmails.length > 0 && process.env.RESEND_API_KEY) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const fromEmail = 'Club des Petits Magiciens <contact@clubdespetitsmagiciens.fr>';

            // Mass email (up to 50 at a time with Resend standard, but we'll try a batch send or BCC if they support it.
            // Actually, Resend supports an array of up to 50 recipients in the "to" field for a single send.
            // If more than 50, we might need a loop. But BCC is safer for privacy if sending directly, 
            // BUT Resend's best practice for broadcast is Batch API. Let's use loop.

            // Chunk array into pieces of 50
            const chunkSize = 50;
            for (let i = 0; i < validEmails.length; i += chunkSize) {
                const chunk = validEmails.slice(i, i + chunkSize);

                // For a broadcast, we shouldn't put everyone in "to" because they see each other! 
                // Wait, Resend batch endpoint is better: `resend.batch.send`
                const emailPayloads = chunk.map(email => ({
                    from: fromEmail,
                    to: [email],
                    subject: `📢 ${title}`,
                    html: `
                        <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 10px;">
                            <h2 style="color: #6b21a8;">${title}</h2>
                            <p style="color: #333; line-height: 1.6;">${content.replace(/\n/g, '<br/>')}</p>
                            ${linkUrl ? `<br/><a href="${linkUrl}" style="background-color: #9333ea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Découvrir la surprise !</a>` : ''}
                            <hr style="border: none; border-top: 1px solid #e5e5e5; margin-top: 30px; margin-bottom: 20px;" />
                            <p style="font-size: 12px; color: #888; text-align: center;">Tu reçois cet email car tu fais partie du Club des Petits Magiciens 🪄</p>
                        </div>
                    `
                }));

                await resend.batch.send(emailPayloads);
            }

        } catch (emailError) {
            console.error("Resend broadcast error:", emailError);
            // Non blocking
        }
    }

    revalidatePath("/admin/kids/library");
    revalidatePath("/kids");
    return { success: true };
}
