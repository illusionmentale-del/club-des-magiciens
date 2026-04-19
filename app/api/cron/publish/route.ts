import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NewContentKidEmail } from "@/components/emails/NewContentKidEmail";
import webPush from 'web-push';

// Configuration VAPID pour les Push
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
if (publicKey && privateKey) {
    webPush.setVapidDetails(
        'mailto:contact@clubdespetitsmagiciens.fr',
        publicKey,
        privateKey
    );
}

// This route can be called by Vercel Cron or manually for testing
export async function GET(request: Request) {
    // 1. Verify authorization (e.g. cron secret in production)
    const authHeader = request.headers.get('authorization');
    const isCronTask = authHeader === `Bearer ${process.env.CRON_SECRET}` || process.env.NODE_ENV === 'development';
    
    // Allow a manual override via API key for testing via URL
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get('api_key');
    const isManualAllowed = apiKey === process.env.CRON_SECRET;

    if (!isCronTask && !isManualAllowed) {
         console.warn("Unauthorized Cron Attempt", { authHeader, ip: request.headers.get('x-forwarded-for') });
         return new NextResponse("Unauthorized", { status: 401 });
    }

    // Initialize Supabase Admin (bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    try {
        console.log("[CRON/PUBLISH] Starting Check...");

        // 2. Find newly published library items that haven't sent an email yet
        // published_at <= NOW() AND publication_email_sent = false
        const { data: pendingItems, error: itemsError } = await supabase
            .from("library_items")
            .select("id, title, audience")
            .lte("published_at", new Date().toISOString())
            .eq("publication_email_sent", false)
            .eq("audience", "kids") // We currently only automate kids emails for this
            .eq("notify_users", true); // On n'informe pas pour les secrets/QR codes

        if (itemsError) throw itemsError;

        if (!pendingItems || pendingItems.length === 0) {
            console.log("[CRON/PUBLISH] No pending items to publish.");
            return NextResponse.json({ success: true, message: "Aucun contenu en attente de publication." });
        }

        console.log(`[CRON/PUBLISH] Found ${pendingItems.length} items to announce:`, pendingItems.map(i => i.title));

        // 3. For each item, send mass email to relevant audience
        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.NODE_ENV === 'development'
            ? 'Club des Petits Magiciens <onboarding@resend.dev>'
            : 'Club des Petits Magiciens <contact@clubdespetitsmagiciens.fr>';
            
        // Fetch users who should receive the email (all kids)
        const { data: kidsProfiles, error: profilesError } = await supabase
             .from("profiles")
             .select("email, full_name, username, id")
             .eq("has_kids_access", true)
             .is("deleted_at", null)
             .eq("email_alerts_opt_in", true);

        if (profilesError) throw profilesError;
        
        let totalEmailsSent = 0;

        // Grouping titles and determining subject
        const itemTitles = pendingItems.map(item => item.title);
        const isPlural = pendingItems.length > 1;
        const emailSubject = isPlural 
            ? `🎩 ${pendingItems.length} nouveaux secrets t'attendent !`
            : `Nouveau contenu magique disponible ! 🎩✨`;

        const emailsBatch = [];
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.clubdespetitsmagiciens.fr';

        if (kidsProfiles && kidsProfiles.length > 0) {
            for (const profile of kidsProfiles) {
                if (!profile.email) continue;
                
                const username = profile.username || profile.full_name || "Jeune Magicien";
                
                emailsBatch.push({
                    from: fromEmail,
                    to: [profile.email],
                    subject: emailSubject,
                    react: NewContentKidEmail({
                        username: username,
                        contentTitles: itemTitles,
                        loginUrl: `${siteUrl}/kids/program`
                    }),
                });
            }
        }

        // Send in chunks of 50 via Resend Batch API
        const chunkSize = 50;
        for (let i = 0; i < emailsBatch.length; i += chunkSize) {
            const chunk = emailsBatch.slice(i, i + chunkSize);
            try {
                await resend.batch.send(chunk);
                totalEmailsSent += chunk.length;
                console.log(`[CRON/PUBLISH] Sent batch of ${chunk.length} emails. Total: ${totalEmailsSent}`);
            } catch (emailErr) {
                console.error("[CRON/PUBLISH] Failed to send batch:", emailErr);
                // Don't throw, we want to update the DB so we don't spam loop if it partially failed
            }
        }

        // --- ENVOI DES NOTIFICATIONS PUSH ---
        let totalPushesSent = 0;
        const validUserIds = kidsProfiles?.map(p => p.id) || [];
        
        if (validUserIds.length > 0 && publicKey && privateKey) {
            const { data: subscriptions } = await supabase
                .from('push_subscriptions')
                .select('*')
                .in('user_id', validUserIds);

            if (subscriptions && subscriptions.length > 0) {
                const pushPayload = JSON.stringify({
                    title: "Nouvelle Magie ! 🎩✨",
                    body: emailSubject, // Reprend "X nouveaux secrets t'attendent !"
                    url: `${siteUrl}/kids/program`,
                    icon: '/icon-192x192.png'
                });

                const staleEndpoints: string[] = [];
                const sendPromises = subscriptions.map(async (sub) => {
                    try {
                        await webPush.sendNotification({
                            endpoint: sub.endpoint,
                            keys: { p256dh: sub.p256dh, auth: sub.auth }
                        }, pushPayload);
                        totalPushesSent++;
                    } catch (pushErr: any) {
                        if (pushErr.statusCode === 404 || pushErr.statusCode === 410) {
                            staleEndpoints.push(sub.endpoint);
                        }
                    }
                });

                await Promise.all(sendPromises);
                console.log(`[CRON/PUBLISH] Sent ${totalPushesSent} push notifications.`);

                if (staleEndpoints.length > 0) {
                    await supabase.from('push_subscriptions').delete().in('endpoint', staleEndpoints);
                }
            }
        }
        // -------------------------------------

        // 4. Mark all items as sent
        const pendingItemIds = pendingItems.map(item => item.id);
        
        await supabase
            .from("library_items")
            .update({ publication_email_sent: true })
            .in("id", pendingItemIds);
            
        console.log(`[CRON/PUBLISH] ${pendingItems.length} items marked as sent.`);

        // ============================================
        // EXPIRING TRIALS CRON LOGIC
        // ============================================
        console.log("[CRON/TRIAL] Checking for expired trials...");
        const { data: expiredTrials, error: trialsError } = await supabase
            .from("profiles")
            .select("id, email, username, full_name")
            .eq("has_kids_access", false)
            .is("deleted_at", null)
            .eq("trial_expiry_email_sent", false)
            .lt("kids_trial_expires_at", new Date().toISOString());

        if (trialsError) throw trialsError;

        if (expiredTrials && expiredTrials.length > 0) {
            console.log(`[CRON/TRIAL] Found ${expiredTrials.length} expired trials to follow up.`);
            
            for (const profile of expiredTrials) {
                if (!profile.email) continue;
                // Send Upsell Email
                try {
                    await resend.emails.send({
                        from: "Jérémy <boutique@atelierdesmagiciens.fr>",
                        to: profile.email,
                        subject: "Ta période d'essai est terminée ! 🎩",
                        html: `
                            <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #222;">
                                <h2>Oh non ! L'accès gratuit prend fin...</h2>
                                <p>Tes 24 heures d'accès magique au Club des Petits Magiciens sont terminées.</p>
                                <p>J'espère que tu as pu apprendre plein de secrets incroyables ! La magie ne s'arrête pas là : pour continuer à épater tous tes copains et débloquer plus de 52 tours étonnants, tu peux redevenir membre officiel.</p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <a href="${siteUrl}/tarifs/kids" style="background-color: #6d28d9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
                                        👉 Rejoindre le Club Définitivement
                                    </a>
                                </div>
                                <p>À très vite de l'autre côté du miroir,</p>
                                <p>Jérémy Marouani</p>
                            </div>
                        `
                    });
                    
                    // Mark as sent
                    await supabase
                        .from("profiles")
                        .update({ trial_expiry_email_sent: true })
                        .eq("id", profile.id);
                        
                } catch (e) {
                    console.error("[CRON/TRIAL] Failed to send to", profile.email, e);
                }
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Publication processée. ${totalEmailsSent} emails et ${totalPushesSent} pushs envoyés pour ${pendingItems?.length || 0} contenus. ${expiredTrials?.length || 0} emails d'essai envoyés.` 
        });

    } catch (error: any) {
         console.error("[CRON/PUBLISH] Error executing task:", error);
         return new NextResponse("Internal Server Error: " + error?.message, { status: 500 });
    }
}
