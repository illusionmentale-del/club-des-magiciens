"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem("cookie_consent");
        if (!consent) {
            // Slight delay so it doesn't pop immediately on first paint aggressively
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const acceptAll = () => {
        localStorage.setItem("cookie_consent", "all");
        setIsVisible(false);
    };

    const rejectAll = () => {
        localStorage.setItem("cookie_consent", "essential");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-10 fade-in duration-500">
            <div className="max-w-6xl mx-auto bg-brand-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 p-6">

                {/* Text Section */}
                <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-brand-purple/20 flex items-center justify-center shrink-0 border border-brand-purple/30">
                        <Cookie className="w-5 h-5 text-brand-purple" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold mb-1">Respect de votre vie privée</h3>
                        <p className="text-sm text-brand-text-muted leading-relaxed">
                            Nous utilisons des cookies essentiels pour faire fonctionner le site (panier, connexion).
                            Nous aimerions aussi utiliser des cookies analytiques pour comprendre comment vous utilisez notre plateforme et l'améliorer.
                            Vous pouvez choisir d'accepter ou de refuser ces cookies additionnels.
                        </p>
                    </div>
                </div>

                {/* Buttons Section */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
                    <button
                        onClick={rejectAll}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                    >
                        Continuer sans accepter
                    </button>
                    <button
                        onClick={acceptAll}
                        className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-brand-purple/20 text-white bg-brand-purple hover:bg-brand-purple/90 transition-all border border-brand-purple/50"
                    >
                        Accepter tout
                    </button>
                </div>

                {/* Small close button */}
                <button
                    onClick={rejectAll}
                    className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                    title="Fermer"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
