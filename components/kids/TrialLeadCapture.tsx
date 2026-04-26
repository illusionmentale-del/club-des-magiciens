"use client";

import { useState } from "react";
import { ArrowRight, Loader2, Sparkles, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TrialLeadCapture() {
    const [email, setEmail] = useState("");
    const [optIn, setOptIn] = useState(false);
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!optIn) {
            setErrorMessage("Tu dois accepter de recevoir la secrète magie pour obtenir ton accès !");
            setStatus("error");
            return;
        }

        setStatus("loading");
        try {
            const res = await fetch("/api/auth/trial", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newsletter_opt_in: optIn })
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Une erreur magique s'est produite...");
            }

            setStatus("success");
            
        } catch (err: any) {
            setStatus("error");
            setErrorMessage(err.message);
        }
    };

    if (status === "success") {
        return (
            <div className="mt-12 bg-gradient-to-br from-brand-card to-black p-8 md:p-10 rounded-3xl border border-brand-green/40 shadow-[0_0_50px_rgba(34,197,94,0.15)] flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-green/20 rounded-full flex items-center justify-center text-brand-green mb-6">
                    <CheckCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2">Accès Envoyé ! 🪄</h3>
                <p className="text-brand-text-muted mb-6">
                    Vérifie vite tes emails (et tes spams). Le lien magique pour entrer gratuitement dans l'école pendant 24h t'attend !
                </p>
            </div>
        );
    }

    return (
        <div className="mt-12 bg-gradient-to-br from-brand-card to-black p-8 md:p-10 rounded-3xl border border-brand-purple/40 shadow-[0_0_50px_rgba(124,58,237,0.15)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-brand-purple/20 transition-all duration-500"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-brand-purple/20 transition-all duration-500"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="text-center space-y-4 mb-8">
                    <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
                        Tu veux apprendre d'autres <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-cyan">secrets magiques ?</span>
                    </h3>
                    <p className="text-brand-text-muted text-sm md:text-base leading-relaxed max-w-xl mx-auto">
                        Le Club des Petits Magiciens est une école en ligne où j'apprends aux enfants des illusions incroyables.
                        <br/>✨ <strong>Débloque un accès totalement GRATUIT pendant 24h !</strong> 
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                    <div>
                        <input
                            type="email"
                            required
                            placeholder="Adresse email de tes parents"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                        />
                    </div>
                    
                    <div className="flex items-start gap-3 text-left">
                        <input
                            type="checkbox"
                            id="newsletter"
                            checked={optIn}
                            onChange={(e) => setOptIn(e.target.checked)}
                            className="mt-1 w-4 h-4 rounded border-white/20 bg-black/40 text-brand-purple focus:ring-brand-purple"
                        />
                        <label htmlFor="newsletter" className="text-xs text-brand-text-muted cursor-pointer leading-tight">
                            J'accepte de m'inscrire à la newsletter secrète pour obtenir mon accès de 24h offertes (promis, pas de spam !).
                        </label>
                    </div>

                    {status === "error" && (
                        <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full group/btn relative overflow-hidden bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(124,58,237,0.3)] hover:scale-105 active:scale-95 disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
                        {status === "loading" ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>Débloquer mon accès gratuit</span>
                                <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                            </>
                        )}
                    </button>
                    
                    <div className="text-center mt-4 pt-4 border-t border-white/10">
                         <span className="text-xs text-gray-400">Déjà membre ? </span>
                         <Link href="/login" className="text-xs text-brand-purple hover:underline font-bold">Se connecter</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
