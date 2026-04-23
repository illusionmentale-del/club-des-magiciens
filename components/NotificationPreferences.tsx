"use client";

import { useState, useEffect, useTransition } from "react";
import { Mail, BellRing, Smartphone, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updateNotificationPreference } from "@/app/dashboard/account/actions";

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

// Composant Switch Native-like
function ToggleSwitch({ checked, onChange, disabled }: { checked: boolean, onChange: (checked: boolean) => void, disabled?: boolean }) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed ${checked ? 'bg-purple-500' : 'bg-white/20'}`}
        >
            <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    );
}

export function NotificationPreferences({ profile, space = "kids" }: { profile: any, space?: "adults" | "kids" }) {
    const [isPending, startTransition] = useTransition();

    // Local states for instant visual feedback
    const [newsletterOptIn, setNewsletterOptIn] = useState<boolean>(profile?.newsletter_opt_in ?? true);
    const [emailAlertsOptIn, setEmailAlertsOptIn] = useState<boolean>(profile?.email_alerts_opt_in ?? true);

    // Web Push states
    const [pushSupported, setPushSupported] = useState(false);
    const [pushSubscribed, setPushSubscribed] = useState(false);
    const [pushLoading, setPushLoading] = useState(true);

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setPushSupported(true);
            checkPushSubscription();
        } else {
            setPushLoading(false);
        }
    }, []);

    const checkPushSubscription = async () => {
        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            setPushSubscribed(!!subscription);
        } catch (error) {
            console.error("Erreur de vérification de l'abonnement push:", error);
        } finally {
            setPushLoading(false);
        }
    };

    const handleToggleNewsletter = (checked: boolean) => {
        setNewsletterOptIn(checked); // Optimistic UI
        startTransition(async () => {
            const result = await updateNotificationPreference('newsletter_opt_in', checked);
            if (result.error) {
                setNewsletterOptIn(!checked); // Revert on error
                alert(result.error);
            }
        });
    };

    const handleToggleEmailAlerts = (checked: boolean) => {
        setEmailAlertsOptIn(checked); // Optimistic UI
        startTransition(async () => {
            const result = await updateNotificationPreference('email_alerts_opt_in', checked);
            if (result.error) {
                setEmailAlertsOptIn(!checked); // Revert on error
                alert(result.error);
            }
        });
    };

    const handleTogglePush = async (checked: boolean) => {
        setPushLoading(true);
        try {
            if (checked) {
                // S'ABONNER: Doit être la première action asynchrone pour Safari iOS !
                const permission = await window.Notification.requestPermission();
                if (permission === 'granted') {
                    const registration = await navigator.serviceWorker.ready;
                    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
                    if (!publicKey) throw new Error("VAPID public key manquante");

                    const subscribeOptions = {
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(publicKey)
                    };

                    const pushSubscription = await registration.pushManager.subscribe(subscribeOptions);

                    // Sauvegarder dans Supabase
                    const supabase = createClient();
                    const { data: { user } } = await supabase.auth.getUser();

                    if (user) {
                        await fetch('/api/push/subscribe', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ subscription: pushSubscription }),
                        });
                    }
                    setPushSubscribed(true);
                } else {
                    alert("Vous avez refusé les notifications. Vous devez les réactiver dans les paramètres de votre appareil ou navigateur.");
                }
            } else {
                // SE DÉSABONNER
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.getSubscription();
                if (subscription) {
                    // Supprimer du navigateur
                    await subscription.unsubscribe();

                    // Supprimer de Supabase
                    await fetch('/api/push/unsubscribe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ endpoint: subscription.endpoint }),
                    });
                }
                setPushSubscribed(false);
            }
        } catch (error: any) {
            console.error("Erreur de modification des pushs:", error);
            alert("Erreur: " + (error.message || JSON.stringify(error) || "Inconnue"));
        } finally {
            setPushLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6">

                {/* 1. Newsletter */}
                <div className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="flex items-start gap-4 pr-4">
                        <div className={`p-2 bg-white/10 rounded-xl shrink-0 mt-0.5 ${space === 'adults' ? 'text-magic-royal' : 'text-brand-purple'}`}>
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-1">
                                {space === 'adults' ? "Actualités de l'Atelier" : "La Newsletter"}
                            </h3>
                            <p className="text-sm text-brand-text-muted leading-relaxed">
                                {space === 'adults' 
                                    ? "Recevoir les nouveautés de l'Atelier, les nouvelles masterclass et les offres exclusives."
                                    : "Recevoir les actualités du Club, les coulisses et les offres promotionnelles par email."}
                            </p>
                        </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-center min-w-[3rem]">
                        {isPending ? (
                            <Loader2 className={`w-5 h-5 animate-spin ${space === 'adults' ? 'text-magic-royal' : 'text-brand-purple'}`} />
                        ) : (
                            <ToggleSwitch checked={newsletterOptIn} onChange={handleToggleNewsletter} />
                        )}
                    </div>
                </div>

                {/* 2. Email Alerts */}
                <div className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                    <div className="flex items-start gap-4 pr-4">
                        <div className="p-2 bg-white/10 rounded-xl text-brand-gold shrink-0 mt-0.5">
                            <BellRing className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-1">Alerte par email</h3>
                            <p className="text-sm text-brand-text-muted leading-relaxed">
                                Être prévenu par email lors des annonces majeures et des sorties de contenus importants sur la plateforme.
                            </p>
                        </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-center min-w-[3rem]">
                        {isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin text-brand-gold" />
                        ) : (
                            <ToggleSwitch checked={emailAlertsOptIn} onChange={handleToggleEmailAlerts} />
                        )}
                    </div>
                </div>

                {/* 3. Push Web */}
                <div className={`flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-2xl transition-colors ${!pushSupported && 'opacity-50'}`}>
                    <div className="flex items-start gap-4 pr-4">
                        <div className="p-2 bg-white/10 rounded-xl text-blue-400 shrink-0 mt-0.5">
                            <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-1 flex items-center gap-2">
                                Activer les notifications push
                            </h3>
                            <p className="text-sm text-brand-text-muted leading-relaxed">
                                {pushSupported
                                    ? "Recevoir de véritables alertes natives directement sur l'écran de cet appareil, pour ne rien rater en temps réel."
                                    : "Non supporté sur ce navigateur. Sur iPhone, ajoutez ce site à l'Écran d'Accueil d'abord."}
                            </p>
                        </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-center min-w-[3rem]">
                        {pushSupported && (
                            pushLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                            ) : (
                                <ToggleSwitch checked={pushSubscribed} onChange={handleTogglePush} />
                            )
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
