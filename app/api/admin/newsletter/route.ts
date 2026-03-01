import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // Security checks
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });

        // Ensure user is admin (checking email domain or specific email)
        const isSuperAdmin = user.email === 'illusionmentale@gmail.com' || user.email?.endsWith('@jeremymarouani.com');
        if (!isSuperAdmin) {
            return NextResponse.json({ error: 'Accès interdit. Seuls les administrateurs peuvent envoyer des newsletters.' }, { status: 403 });
        }

        const { subject, content, targetAudience, isTest } = await req.json();

        if (!subject || !content) {
            return NextResponse.json({ error: 'Sujet et contenu obligatoires.' }, { status: 400 });
        }

        const fromEmail = process.env.NODE_ENV === 'development'
            ? "L'Atelier des Magiciens <onboarding@resend.dev>"
            : "L'Atelier des Magiciens <contact@clubdespetitsmagiciens.fr>"; // Enforced fallback domain

        let emailsToTarget: string[] = [];

        if (isTest) {
            // Send only to the active admin user
            emailsToTarget = [user.email!];
        } else {
            // Fetch relevant users who opted in
            let query = supabase.from('profiles').select('email, first_name').eq('newsletter_opt_in', true).is('deleted_at', null);

            if (targetAudience === 'adults') {
                query = query.eq('has_adults_access', true);
            } else if (targetAudience === 'kids') {
                query = query.eq('has_kids_access', true);
            }

            const { data: profiles, error } = await query;

            if (error) {
                console.error("Erreur récupération:", error);
                throw error;
            }

            if (!profiles || profiles.length === 0) {
                return NextResponse.json({ error: "Aucun utilisateur inscrit à la newsletter pour cette cible." }, { status: 400 });
            }

            emailsToTarget = profiles.map(p => p.email);
        }

        // Send via Resend (Using Audience/Batch if more than 50 emails ideally, but Resend handles reasonable arrays in `to` up to 50 for standard sends. For broader broadcasts, batching is needed).
        // Best approach for mass sending with variables is using Resend Batch API, but let's try a simple broadcast loop or using the Broadcast `bcc` trick if free tier allows it, or map them into a batch.

        const BATCH_SIZE = 50; // Resend limit is usually 50 per API call for Batch, sometimes 100
        const batchRequests = [];

        let sentCount = 0;

        // Basic Text to HTML converter if they just use newlines
        const formatMessage = (text: string) => text.replace(/\n/g, '<br />');

        for (let i = 0; i < emailsToTarget.length; i += BATCH_SIZE) {
            const batch = emailsToTarget.slice(i, i + BATCH_SIZE);

            const payload = batch.map(email => ({
                from: fromEmail,
                to: [email],
                subject: subject,
                html: `
                    <div style="font-family: sans-serif; color: #111; max-width: 600px; margin: 0 auto;">
                        <img src="https://zcljymosqckntukshzrm.supabase.co/storage/v1/object/public/website-assets/logo-v2.png" width="150" alt="Logo" style="margin-bottom: 20px; border-radius: 8px;">
                        ${formatMessage(content)}
                        <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 30px 0;" />
                        <p style="font-size: 12px; color: #888; text-align: center;">
                            Vous recevez cet e-mail car vous êtes inscrit(e) aux actualités de L'Atelier / Club des Magiciens.
                        </p>
                    </div>
                `
            }));

            const { data, error } = await resend.batch.send(payload);

            if (error) {
                console.error(`Erreur envoi batch de l'index ${i}:`, error);
                // Keep trying other batches instead of failing entirely
            } else {
                sentCount += batch.length;
            }
        }

        return NextResponse.json({ success: true, count: sentCount }, { status: 200 });

    } catch (error: any) {
        console.error("Newsletter API Error:", error);
        return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
    }
}
