import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

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

    await supabaseAdmin.from('gamification_levels').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const { error } = await supabaseAdmin.from('gamification_levels').insert(levels);

    if (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
    
    return NextResponse.json({ success: true, message: "Levels updated!" });
}
