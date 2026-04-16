require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
    console.log("Deleting old levels...");
    await supabaseAdmin.from('gamification_levels').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    const levels = [
        { name: "Apprenti", xp_threshold: 0 },
        { name: "Curieux de la Magie", xp_threshold: 150 },
        { name: "Chercheur de Secrets", xp_threshold: 300 },
        { name: "Manipulateur d'Ombres", xp_threshold: 600 },
        { name: "Magicien Initié", xp_threshold: 1000 },
        { name: "As de la Dextérité", xp_threshold: 1800 },
        { name: "Créateur d'Illusions", xp_threshold: 3000 },
        { name: "Maître du Détournement", xp_threshold: 5000 },
        { name: "Illusionniste", xp_threshold: 8000 },
        { name: "Prodige de la Magie", xp_threshold: 12000 },
        { name: "Expert des Mystères", xp_threshold: 18000 },
        { name: "Gardien des Secrets", xp_threshold: 25000 },
        { name: "Sorcier Suprême", xp_threshold: 40000 }
    ];

    console.log("Inserting new massive scales...");
    const { error } = await supabaseAdmin.from('gamification_levels').insert(levels);

    if (error) {
        console.error("Error inserting levels:", error);
    } else {
        console.log("Gamification levels updated successfully!");
    }
}

run();
