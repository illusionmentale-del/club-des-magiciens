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
            // Wait for the Supabase client to automatically pick up the #access_token from the URL hash
            // and exchange it for a cookie session.
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
            
            // This client automatically checks URL hashes for Implicit Grants and establishes the session.
            const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

            setStatus("Établissement de la session...");

            // Check if the session was successfully established
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                setStatus("Erreur: " + error.message);
                return;
            }

            if (session) {
                setStatus("Connexion réussie ! Redirection...");
                // Force a hard navigation so the Next.js middleware sees the newly set cookies
                window.location.href = "/kids";
            } else {
                // If it takes a split second to exchange, we can also listen to auth state
                const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
                    if (event === 'SIGNED_IN' || newSession) {
                        setStatus("Connexion réussie ! Redirection...");
                        window.location.href = "/kids";
                    }
                });

                // Set a timeout in case the hash was invalid or expired
                setTimeout(() => {
                    setStatus("Lien invalide ou expiré, ou session non détectée.");
                }, 5000);

                return () => {
                    authListener.subscription.unsubscribe();
                };
            }
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
