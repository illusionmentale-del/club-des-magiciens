"use client";

import { useState } from "react";
import { submitAdultVIPRequest } from "./actions";
import { ArrowRight, CheckCircle, Send, Mail } from "lucide-react";

export default function VIPAdultForm() {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    async function handleAction(formData: FormData) {
        setPending(true);
        setError(null);
        
        try {
            const result = await submitAdultVIPRequest(formData);
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
            <div className="flex flex-col items-center justify-center p-6 bg-brand-blue/10 border border-brand-blue/30 rounded-2xl">
                <CheckCircle className="w-12 h-12 text-green-400 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2 text-center">Demande envoyée !</h2>
                <p className="text-brand-text-muted text-center text-sm">
                    Votre demande a bien été enregistrée. Jérémy procède à la vérification manuelle. Vous recevrez vos accès directement par e-mail très prochainement.
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
                <label htmlFor="fullName" className="text-brand-text-muted text-sm font-medium">Nom & Prénom</label>
                <input 
                    type="text" 
                    id="fullName"
                    name="fullName"
                    required
                    maxLength={100}
                    placeholder="Ex: Jean Dupont"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/50 transition-colors"
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="email" className="text-brand-text-muted text-sm font-medium">Adresse E-mail</label>
                <input 
                    type="email" 
                    id="email"
                    name="email"
                    required
                    placeholder="jean.dupont@exemple.com"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/50 transition-colors"
                />
                <p className="text-[11px] text-brand-text-muted/60 italic pt-1">
                    C'est ici que vous recevrez vos accès. Promis, pas de spam ni de publicité.
                </p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-black/50 border border-white/10 rounded-xl">
                <div className="flex items-center h-5">
                    <input
                        id="newsletter"
                        name="newsletter"
                        type="checkbox"
                        value="yes"
                        defaultChecked
                        className="w-4 h-4 rounded-[4px] border-white/20 bg-black text-brand-blue focus:ring-brand-blue focus:ring-offset-black"
                    />
                </div>
                <label htmlFor="newsletter" className="text-[13px] text-gray-300 leading-snug cursor-pointer font-light">
                    M'inscrire aux communications de l'Atelier (Astuces pro, nouveautés, offres privées)
                </label>
            </div>

            <div className="space-y-1 group">
                <label htmlFor="context" className="text-brand-text-muted text-sm font-medium transition-colors group-focus-within:text-brand-blue">Où nous sommes-nous rencontrés ?</label>
                <input 
                    type="text" 
                    id="context"
                    name="context"
                    required
                    maxLength={150}
                    placeholder="Ex: Conférence d'entreprise, Spectacle..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue/50 transition-all"
                />
                <p className="text-[11px] leading-snug text-brand-text-muted/70 pt-1">
                    Cette question me permet de m'assurer qu'il s'agit bien d'une vraie rencontre, et <strong>fait l'objet d'une vérification de ma part</strong>. Cela peut prendre jusqu'à 72h pour recevoir l'accès automatique par mail.
                </p>
            </div>

            <button 
                type="submit" 
                disabled={pending}
                className="relative overflow-hidden w-full bg-brand-purple hover:bg-brand-purple/80 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center gap-2 mt-6 disabled:opacity-75 disabled:cursor-wait"
            >
                {/* Shimmer Effect */}
                {!pending && (
                    <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                )}
                
                {pending ? (
                    <>
                        <span className="text-[15px]">🪄 Création de l'accès...</span>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></span>
                    </>
                ) : (
                    <>
                        <span className="text-[15px]">Demander l'accès</span>
                        <Send className="w-4 h-4 ml-1" />
                    </>
                )}
            </button>
        </form>
    );
}
