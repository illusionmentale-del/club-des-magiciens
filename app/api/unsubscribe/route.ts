import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return new NextResponse("Erreur : Adresse e-mail manquante dans le lien.", { status: 400 });
    }

    try {
        const { createAdminClient } = require('@/lib/supabase/admin');
        const supabaseAdmin = await createAdminClient();
        const decodedEmail = decodeURIComponent(email);

        // Update the profile to revoke newsletter consent (Bypass RLS because user is likely anonymous here)
        const { error } = await supabaseAdmin
            .from('profiles')
            .update({ newsletter_opt_in: false })
            .eq('email', decodedEmail);

        if (error) {
            console.error("Erreur technique lors du désabonnement:", error);
            const errorHtml = `
                <html>
                    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 100px 20px; background-color: #0f172a; color: white;">
                        <h2 style="color: #ef4444; margin-bottom: 16px;">Une erreur est survenue</h2>
                        <p style="color: #94a3b8;">Impossible de traiter votre demande. Veuillez contacter notre support si le problème persiste.</p>
                    </body>
                </html>
            `;
            return new NextResponse(errorHtml, { status: 500, headers: { 'Content-Type': 'text/html' } });
        }

        const successHtml = `
            <html>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; text-align: center; padding: 100px 20px; background-color: #050507; color: white;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #171717; border: 1px solid #333; border-radius: 16px; padding: 40px 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                        <svg style="width: 48px; height: 48px; color: #10b981; margin: 0 auto 20px; display: block;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 style="color: #f8fafc; margin-top: 0; margin-bottom: 16px; font-size: 24px;">Désabonnement confirmé</h2>
                        <p style="color: #94a3b8; font-size: 15px; line-height: 1.5; margin-bottom: 30px;">
                            Votre choix a bien été enregistré.<br/>Vous ne recevrez plus nos lettres d'actualités marketing à l'adresse <b>${decodedEmail}</b>.
                        </p>
                        <a href="/" style="display: inline-block; background-color: #334155; color: #fff; text-decoration: none; padding: 10px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">Retourner à l'accueil</a>
                    </div>
                </body>
            </html>
        `;

        return new NextResponse(successHtml, { status: 200, headers: { 'Content-Type': 'text/html' } });

    } catch (e: any) {
        console.error("Unhandled Unsubscribe Error:", e);
        return new NextResponse("Erreur serveur interne", { status: 500 });
    }
}
