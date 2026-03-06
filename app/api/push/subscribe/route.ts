import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        const { subscription } = await req.json();

        if (!subscription || !subscription.endpoint) {
            return NextResponse.json({ error: 'Abonnement Push invalide' }, { status: 400 });
        }

        // Extract required security keys for Web Push
        const p256dh = subscription.keys?.p256dh;
        const auth = subscription.keys?.auth;

        if (!p256dh || !auth) {
            return NextResponse.json({ error: 'Clés de sécurité manquantes' }, { status: 400 });
        }

        // Upsert into Supabase (If the exact endpoint exists for this user, do nothing or update)
        // Using an INSERT ON CONFLICT DO NOTHING approach since the endpoint is unique per user

        const { error } = await supabase.from('push_subscriptions').upsert({
            user_id: user.id,
            endpoint: subscription.endpoint,
            p256dh: p256dh,
            auth: auth
        }, {
            onConflict: 'user_id, endpoint'
        });

        if (error) {
            console.error("VAPID DB Save Error:", error);
            throw error;
        }

        return NextResponse.json({ success: true });

    } catch (e: any) {
        console.error("Push Subscription Error:", e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
