import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email, newsletter_opt_in } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "L'email est requis." }, { status: 400 });
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        // 1. Tente de créer ou trouver l'utilisateur
        let userAuthId = null;
        let isExistingUser = false;

        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email,
            email_confirm: true,
            user_metadata: { source: "24h_trial" }
        });

        if (createError) {
            if (createError.message.includes("already registered")) {
                isExistingUser = true;
                // Trouver le user ID
                const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
                const matchedUser = existingUsers.users.find(u => u.email === email);
                if (matchedUser) {
                    userAuthId = matchedUser.id;
                } else {
                    return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 400 });
                }
            } else {
                throw createError;
            }
        } else {
            userAuthId = newUser.user.id;
        }

        // 2. Vérifier les privilèges actuels du Profil
        const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("has_kids_access, kids_trial_expires_at")
            .eq("id", userAuthId)
            .single();

        if (profile?.has_kids_access) {
            return NextResponse.json({ error: "Ce compte a déjà l'accès complet au Club !" }, { status: 400 });
        }

        // Vérifier si un essai a DÉJÀ été consommé dans le passé (on bloque les abus)
        if (profile?.kids_trial_expires_at) {
            const expiry = new Date(profile.kids_trial_expires_at);
            const now = new Date();
            if (expiry < now) {
                // Il a déjà fait son essai par le passé !
                return NextResponse.json({ error: "La période d'essai gratuite de 24h a déjà été utilisée pour cette adresse email." }, { status: 400 });
            }
        }

        // 3. Activer l'Essai et Mettre à jour le Profil
        const trialEndDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        
        await supabaseAdmin
            .from("profiles")
            .update({
                kids_trial_expires_at: trialEndDate,
                newsletter_opt_in: newsletter_opt_in || false,
                trial_expiry_email_sent: false
            })
            .eq("id", userAuthId);

        // 4. Générer le Magic Link
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: email,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/kids`
            }
        });

        if (linkError) throw linkError;

        // 5. Envoyer le Mail avec Resend
        await resend.emails.send({
            from: "Le Club des Petits Magiciens <hello@illusions-mentales.fr>",
            to: email,
            subject: "Ton accès Magique de 24h est prêt ! 🪄",
            html: `
                <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #222;">
                    <h1 style="color: #6d28d9;">Bonjour !</h1>
                    <p>Bravo, tu viens de débloquer ton accès totalement gratuit de 24h au <strong>Club des Petits Magiciens</strong> !</p>
                    <p>Ce lien secret est magique : il te permet d'entrer directement dans l'école sans aucun mot de passe. Ne le partage avec personne.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${linkData.properties.action_link}" style="background-color: #6d28d9; color: white; padding: 15px 30px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">
                            🪄 Entrer dans le Club Secret
                        </a>
                    </div>
                    <p>Attention, ta carte d'accès magique s'autodétruira exactement dans 24 heures ! Profites-en vite pour apprendre de nouveaux tours.</p>
                    <p>Magiquement,<br/>Jérémy Marouani</p>
                </div>
            `
        });

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error("Trial API Error:", error);
        return NextResponse.json({ error: error.message || "Une erreur est survenue." }, { status: 500 });
    }
}
