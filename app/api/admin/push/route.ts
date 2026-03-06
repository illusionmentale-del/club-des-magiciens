import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import webPush from 'web-push';

// Configuration VAPID
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (!publicKey || !privateKey) {
    console.warn("Les clés VAPID ne sont pas configurées. Le Push Web ne fonctionnera pas.");
} else {
    webPush.setVapidDetails(
        'mailto:contact@clubdespetitsmagiciens.fr',
        publicKey,
        privateKey
    );
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // Security check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

        const isSuperAdmin = user.email === 'illusionmentale@gmail.com' || user.email?.endsWith('@jeremymarouani.com');
        if (!isSuperAdmin) {
            return NextResponse.json({ error: 'Réservé aux administrateurs.' }, { status: 403 });
        }

        const { title, message, url, targetAudience = 'all' } = await req.json();

        if (!title || !message) {
            return NextResponse.json({ error: 'Titre et message requis.' }, { status: 400 });
        }

        // Fetch target users
        let profilesQuery = supabase.from('profiles').select('id, has_adults_access, has_kids_access');

        if (targetAudience === 'adults') {
            profilesQuery = profilesQuery.eq('has_adults_access', true);
        } else if (targetAudience === 'kids') {
            profilesQuery = profilesQuery.eq('has_kids_access', true);
        }

        const { data: targetProfiles, error: profilesError } = await profilesQuery;

        if (profilesError || !targetProfiles || targetProfiles.length === 0) {
            return NextResponse.json({ error: "Aucun utilisateur trouvé pour cette cible." }, { status: 400 });
        }

        const validUserIds = targetProfiles.map(p => p.id);

        // Fetch their push subscriptions
        const { data: subscriptions, error: subsError } = await supabase
            .from('push_subscriptions')
            .select('*')
            .in('user_id', validUserIds);

        if (subsError) throw subsError;

        if (!subscriptions || subscriptions.length === 0) {
            return NextResponse.json({ success: true, count: 0, message: "Aucun appareil n'est actuellement abonné aux notifications." }, { status: 200 });
        }

        // Send notifications
        const notificationPayload = JSON.stringify({
            title: title,
            body: message,
            url: url || process.env.NEXT_PUBLIC_APP_URL || 'https://www.clubdespetitsmagiciens.fr',
            icon: '/icon-192x192.png'
        });

        let successCount = 0;
        let failureCount = 0;
        const staleEndpoints: string[] = [];

        // Sending pushes in parallel (web-push handles connections)
        const sendPromises = subscriptions.map(async (sub) => {
            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            };

            try {
                await webPush.sendNotification(pushSubscription, notificationPayload);
                successCount++;
            } catch (error: any) {
                console.error("Erreur d'envoi vers un appareil:", error);

                // If the device has unregistered (e.g user revoked permission in browser options), we clean our DB
                if (error.statusCode === 404 || error.statusCode === 410) {
                    staleEndpoints.push(sub.endpoint);
                }
                failureCount++;
            }
        });

        await Promise.all(sendPromises);

        // Clean up stale subscriptions safely
        if (staleEndpoints.length > 0) {
            await supabase
                .from('push_subscriptions')
                .delete()
                .in('endpoint', staleEndpoints);
        }

        return NextResponse.json({
            success: true,
            sent: successCount,
            failed: failureCount,
            staleRemoved: staleEndpoints.length
        });

    } catch (e: any) {
        console.error("Push Admin Error:", e);
        return NextResponse.json({ error: e.message || "Erreur serveur" }, { status: 500 });
    }
}
