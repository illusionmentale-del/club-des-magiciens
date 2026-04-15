import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";
import WelcomeEmail from "@/emails/WelcomeEmail";
import * as React from "react";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
    try {
        const { users } = await req.json();
        const supabaseAdmin = await createAdminClient();

        if (!users || !Array.isArray(users)) {
            return NextResponse.json({ error: "Format invalide" }, { status: 400 });
        }

        let inserted = 0;
        let errors = [];

        for (const user of users) {
            const { email, firstName, lastName } = user;

            if (!email || !firstName) {
                errors.push({ email: email || 'Inconnu', message: "E-mail ou prénom manquant" });
                continue;
            }

            try {
                // 1. Create the user in Supabase Auth
                // We use auto-confirm to avoid the standard Supabase email (we send our own)
                const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                    email: email,
                    password: generateSecurePassword(),
                    email_confirm: true,
                    user_metadata: {
                        first_name: firstName,
                        last_name: lastName || ''
                    }
                });

                if (authError) {
                    // Si l'utilisateur existe déjà, on le gère gracieusement
                    if (authError.message.includes("User already registered") || authError.status === 422) {
                        // User exists! We should fetch them and update their profile with has_kids_access = true
                        const { data: searchData } = await supabaseAdmin.auth.admin.listUsers();
                        const existingUser = searchData.users.find((u: any) => u.email === email);

                        if (existingUser) {
                            // Mettre à jour has_kids_access et access_level dans profile
                            await supabaseAdmin
                                .from('profiles')
                                .update({ has_kids_access: true, access_level: 'kid' })
                                .eq('id', existingUser.id);

                            errors.push({ email, message: "L'utilisateur existait déjà. Son compte a été mis à jour avec l'accès Enfant." });
                        } else {
                            errors.push({ email, message: "Utilisateur géré manuellement (existant)." });
                        }
                    } else {
                        errors.push({ email, message: `Erreur Auth: ${authError.message}` });
                    }
                    continue;
                }

                if (!authData.user) {
                    errors.push({ email, message: "Impossible de créer l'utilisateur (Pas de donnée en retour)" });
                    continue;
                }

                const newUserId = authData.user.id;
                const pseudo = lastName ? `${firstName} ${lastName.charAt(0)}.` : firstName;

                // 2. Insert into profiles with has_kids_access
                const { error: profileError } = await supabaseAdmin
                    .from("profiles")
                    .insert({
                        id: newUserId,
                        username: pseudo,
                        full_name: lastName ? `${firstName} ${lastName}` : firstName,
                        has_kids_access: true,
                        access_level: 'kid',
                        // Not giving adult access by default
                        has_adults_access: false
                    });

                if (profileError) {
                    // Note: RLS ou Trigger pourrait déjà créer le profile, d'où possible erreur 'duplicate key'
                    // Si le trigger auth.users est actif sur le projet, on essaie plutôt de UPDATE the profile
                    if (profileError.code === '23505') { // unique_violation
                        await supabaseAdmin
                            .from('profiles')
                            .update({ has_kids_access: true, access_level: 'kid' })
                            .eq('id', newUserId);
                    } else {
                        errors.push({ email, message: `Erreur Profile: ${profileError.message}` });
                        // Continue anyway, we still need to send the email
                    }
                }

                // 3. Generate Magic Link (Recovery link to set a password)
                const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
                    type: "recovery",
                    email: email,
                    options: {
                        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?activated=true`
                    }
                });

                if (linkError || !linkData?.properties?.action_link) {
                    errors.push({ email, message: `Impossible de générer le lien de connexion: ${linkError?.message}` });
                    continue; // Skip email if no link
                }

                const magicLink = linkData.properties.action_link;

                // 4. Send Welcome Email via Resend
                try {
                    await resend.emails.send({
                        from: "Jérémy Marouani - LeMagicienPOV <contact@clubdespetitsmagiciens.fr>",
                        to: [email],
                        subject: "Activer votre nouveau compte Magique 🪄",
                        react: React.createElement(WelcomeEmail, {
                            firstName: firstName,
                            magicLink: magicLink
                        })
                    });

                    inserted++;
                } catch (emailErr: any) {
                    errors.push({ email, message: `Erreur Email: ${emailErr.message}` });
                }

            } catch (err: any) {
                errors.push({ email, message: `Erreur inattendue: ${err.message}` });
            }
        }

        return NextResponse.json({
            success: true,
            inserted,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Helper pour générer un mot de passe fort temporaire 
// (l'utilisateur ne s'en servira jamais, il utilisera le magic link pour le réinitialiser)
function generateSecurePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 20; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}
