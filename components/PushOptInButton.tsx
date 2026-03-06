"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function PushOptInButton() {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true);
            checkSubscription();
        } else {
            setLoading(false);
        }
    }, []);

    const checkSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setIsSubscribed(!!subscription);
        } catch (error) {
            console.error("Erreur de vérification de l'abonnement:", error);
        } finally {
            setLoading(false);
        }
    };

    const subscribeToPush = async () => {
        setLoading(true);
        try {
            const registration = await navigator.serviceWorker.ready;

            // Demande d'autorisation au navigateur
            const permission = await Notification.requestPermission();

            if (permission === 'granted') {
                const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                if (!publicKey) throw new Error("VAPID public key manquante");

                const subscribeOptions = {
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(publicKey)
                };

                const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);

                // Envoi des infos à notre backend pour le sauvegarder dans Supabase
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    await fetch('/api/push/subscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            subscription: pushSubscription,
                        }),
                    });
                }

                setIsSubscribed(true);
            } else {
                alert("Vous avez refusé les notifications. Vous devez les réactiver dans les paramètres de votre navigateur.");
            }
        } catch (error) {
            console.error("Erreur lors de l'abonnement:", error);
            alert("Une erreur est survenue lors de l'activation des notifications.");
        } finally {
            setLoading(false);
        }
    };

    if (!isSupported) {
        return (
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-sm text-brand-text-muted">
                <BellOff className="w-5 h-5 opacity-50 shrink-0" />
                <p>Les notifications intelligentes ne sont pas supportées sur ce navigateur ou cet appareil. Sur iPhone, ajoutez ce site à l'Écran d'Accueil d'abord.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-black/20 border border-white/5 shadow-inner rounded-2xl flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
                <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-brand-royal" />
                    Alertes en temps réel
                </h3>
                <p className="text-sm text-brand-text-muted">
                    Recevez une petite alerte sur cet appareil lorsqu'un Live commence ou qu'une nouvelle vidéo importante est publiée.
                </p>
            </div>

            <button
                onClick={subscribeToPush}
                disabled={isSubscribed || loading}
                className={`min-w-[200px] px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center transition-all ${isSubscribed
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    }`}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : isSubscribed ? (
                    "Actif sur cet appareil"
                ) : (
                    "Activer"
                )}
            </button>
        </div>
    );
}
