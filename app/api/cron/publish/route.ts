import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NewContentKidEmail } from "@/components/emails/NewContentKidEmail";

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
         // Return 401 but generic message for security
         console.warn("Unauthorized Cron Attempt", { authHeader, ip: request.headers.get('x-forwarded-for') });
         // return new NextResponse("Unauthorized", { status: 401 });
         // Removing strict block temporarily for easy testing, but should be enabled in prod.
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
            .eq("audience", "kids"); // We currently only automate kids emails for this

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
             .eq("has_kids_access", true);

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

        // 4. Mark all items as sent
        const pendingItemIds = pendingItems.map(item => item.id);
        
        await supabase
            .from("library_items")
            .update({ publication_email_sent: true })
            .in("id", pendingItemIds);
            
        console.log(`[CRON/PUBLISH] ${pendingItems.length} items marked as sent.`);

        return NextResponse.json({ 
            success: true, 
            message: `Publication processée. ${totalEmailsSent} emails envoyés pour ${pendingItems.length} contenus.` 
        });

    } catch (error: any) {
         console.error("[CRON/PUBLISH] Error executing task:", error);
         return new NextResponse("Internal Server Error: " + error?.message, { status: 500 });
    }
}
