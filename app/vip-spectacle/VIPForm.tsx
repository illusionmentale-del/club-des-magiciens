"use client";

import { useState } from "react";
import { submitVIPRequest } from "./actions";
import { Send, CheckCircle } from "lucide-react";

export default function VIPForm() {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleAction(formData: FormData) {
        setPending(true);
        setError(null);
        
        try {
            const result = await submitVIPRequest(formData);
            if (!result.success) {
                setError(result.error || "Une erreur est survenue.");
            } else {
                setSuccess(true);
            }
        } catch (e) {
            setError("Erreur inattendue.");
        } finally {
            setPending(false);
        }
    }

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center p-6 bg-brand-purple/10 border border-brand-purple/30 rounded-2xl">
                <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2 text-center">Demande envoyée !</h2>
                <p className="text-brand-text-muted text-center text-sm">
                    Jérémy va valider ta demande très vite. Surveille ta boîte mail (et tes spams) pour recevoir ton accès au Club !
                </p>
            </div>
        );
    }

    return (
        <form action={handleAction} className="space-y-4">
            {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                    {error}
                </div>
            )}
            
            <div className="space-y-1">
                <label htmlFor="childName" className="text-brand-text-muted text-sm font-medium">Prénom de l'enfant</label>
                <input 
                    type="text" 
                    id="childName"
                    name="childName"
                    required
                    maxLength={50}
                    placeholder="Ex: Léo"
                    className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-purple transition-colors"
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="parentEmail" className="text-brand-text-muted text-sm font-medium">Email du parent</label>
                <input 
                    type="email" 
                    id="parentEmail"
                    name="parentEmail"
                    required
                    placeholder="email@exemple.com"
                    className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-purple transition-colors"
                />
                <p className="text-[11px] text-brand-text-muted/60 italic pt-1">
                    C'est ici que j'enverrai tes accès. Promis, pas de spam ni de publicité.
                </p>
            </div>

            <div className="flex items-start gap-3 p-3 bg-black/20 rounded-xl border border-brand-border/50">
                <div className="flex items-center h-5">
                    <input
                        id="newsletter"
                        name="newsletter"
                        type="checkbox"
                        value="yes"
                        defaultChecked
                        className="w-4 h-4 rounded border-brand-border bg-black/40 text-brand-purple focus:ring-brand-purple focus:ring-offset-0"
                    />
                </div>
                <label htmlFor="newsletter" className="text-[13px] text-brand-text-muted leading-snug cursor-pointer">
                    M'inscrire à la newsletter secrète pour recevoir les actualités du club et de la boutique secrète (optionnel)
                </label>
            </div>

            <div className="space-y-1 group">
                <label htmlFor="context" className="text-brand-text-muted text-sm font-medium transition-colors group-focus-within:text-brand-purple">Où/quand m'avez-vous vu ?</label>
                <input 
                    type="text" 
                    id="context"
                    name="context"
                    required
                    maxLength={100}
                    placeholder="Ex: Spectacle de l'école vendredi dernier"
                    className="w-full bg-black/40 border border-brand-border rounded-xl px-4 py-3 text-white placeholder-brand-text-muted/50 focus:outline-none focus:border-brand-purple focus:shadow-[0_0_15px_rgba(124,58,237,0.2)] transition-all"
                />
                <p className="text-[11px] leading-snug text-brand-text-muted/70 pt-1">
                    Cette question me permet de m'assurer qu'il s'agit bien d'une vraie rencontre, et <strong>fait l'objet d'une vérification de ma part</strong>. Cela peut prendre jusqu'à 72h pour recevoir l'accès automatique par mail.
                </p>
            </div>

            <button 
                type="submit" 
                disabled={pending}
                className="relative overflow-hidden w-full bg-brand-purple hover:bg-brand-purple/80 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-brand-purple/30 flex items-center justify-center gap-2 mt-6 disabled:opacity-75 disabled:cursor-wait"
            >
                {/* Shimmer Effect */}
                {!pending && (
                    <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                )}
                
                {pending ? (
                    <>
                        <span className="text-[15px]">🪄 Lancement du sortilège...</span>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></span>
                    </>
                ) : (
                    <>
                        <span className="text-[15px]">Envoyer la demande</span>
                        <Send className="w-4 h-4 ml-1" />
                    </>
                )}
            </button>
        </form>
    );
}
