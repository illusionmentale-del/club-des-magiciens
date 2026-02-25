require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);
const resend = new Resend('re_9xgsbqZU_Eavdd1UfPD4xNFrbvDFdeYcy'); // Key verified earlier

async function debugFlow() {
    const email = 'illusionmentale@gmail.com';
    console.log(`[1] Début du test pour ${email}`);

    try {
        console.log("[2] Test Supabase generateLink...");
        const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
            type: 'magiclink',
            email: email,
            options: {
                redirectTo: 'https://clubdespetitsmagiciens.fr/dashboard'
            }
        });

        if (linkError) {
            console.error("❌ ERREUR SUPABASE :", linkError);
            return;
        }

        console.log("✅ Lien magique généré :", !!linkData?.properties?.action_link);
        const actionLink = linkData?.properties?.action_link;

        console.log("[3] Test Resend API...");
        const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'Club des Petits Magiciens <contact@clubdespetitsmagiciens.fr>',
            to: [email],
            subject: 'Test Debugging Final 🎩✨',
            html: `<p>Lien magique : <a href="${actionLink}">Clique ici</a></p>`
        });

        if (emailError) {
            console.error("❌ ERREUR RESEND :", emailError);
        } else {
            console.log("✅ EMAIL ENVOYÉ ! ID:", emailData?.id);
        }

    } catch (e) {
        console.error("❌ CRASH COMPLET :", e);
    }
}

debugFlow();
