"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function Footer() {
    return (
        <footer className="mt-20 border-t border-white/5 bg-black/40 py-12 px-4 md:px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">

                {/* Brand */}
                <div className="flex flex-col items-center md:items-start gap-2">
                    <div className="flex items-center gap-2 text-brand-purple font-serif font-bold text-xl">
                        <Sparkles className="w-5 h-5 text-brand-gold" />
                        Club des Magiciens
                    </div>
                    <p className="text-sm border-brand-text-muted text-gray-400">
                        Apprenez la magie et le mentalisme.
                    </p>
                </div>

                {/* Legal Links */}
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-gray-400">
                    <Link href="/legal/mentions-legales" className="hover:text-white transition-colors">
                        Mentions Légales
                    </Link>
                    <Link href="/legal/terms" className="hover:text-white transition-colors">
                        CGV & CGU
                    </Link>
                    <Link href="/legal/privacy" className="hover:text-white transition-colors">
                        Confidentialité
                    </Link>
                    <Link href="/legal/cookies" className="hover:text-white transition-colors">
                        Politique des Cookies
                    </Link>
                    {/* Trigger localstorage cleanup for cookies if needed */}
                    <button
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                localStorage.removeItem('cookie_consent');
                                window.location.reload();
                            }
                        }}
                        className="hover:text-brand-purple transition-colors flex items-center gap-1"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Gérer les cookies
                    </button>
                </div>

            </div>

            <div className="max-w-7xl mx-auto border-t border-white/5 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} Club des Magiciens. Tous droits réservés.</p>
                <p className="mt-2 md:mt-0">Fait avec 🪄 en France</p>
            </div>
        </footer>
    );
}
