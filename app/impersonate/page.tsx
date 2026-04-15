"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';
import { Loader2 } from "lucide-react";

export default function ImpersonateLandingPage() {
    const router = useRouter();
    const [status, setStatus] = useState("Vérification du lien magique...");

    useEffect(() => {
        const handleImpersonation = async () => {
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
            const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

            setStatus("Lecture du lien magique...");

            const hash = window.location.hash;
            if (hash && hash.includes("access_token")) {
                const params = new URLSearchParams(hash.substring(1));
                const access_token = params.get("access_token");
                const refresh_token = params.get("refresh_token");

                if (access_token && refresh_token) {
                    setStatus("Établissement de la session...");
                    const { error } = await supabase.auth.setSession({
                        access_token,
                        refresh_token
                    });

                    if (error) {
                        setStatus("Erreur SSL: " + error.message);
                        return;
                    }

                    setStatus("Connexion réussie ! Redirection vers l'Espace Kids...");
                    window.location.href = "/kids";
                    return;
                }
            }

            // Fallback to automatic checking
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setStatus("Session pré-établie. Redirection...");
                window.location.href = "/kids";
                return;
            }

            setStatus("Lien expiré ou introuvable.");
        };

        handleImpersonation();
    }, [router]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
            <Loader2 className="w-12 h-12 text-brand-purple animate-spin mb-4" />
            <h1 className="text-xl font-bold uppercase tracking-wider mb-2">Aperçu en cours</h1>
            <p className="text-gray-400 text-sm">{status}</p>
        </div>
    );
}
