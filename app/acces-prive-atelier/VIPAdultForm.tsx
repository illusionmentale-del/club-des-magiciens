"use client";

import { useState } from "react";
import { submitAdultVIPRequest } from "./actions";
import { ArrowRight, CheckCircle, Mail } from "lucide-react";

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
            <div className="flex flex-col items-center justify-center p-8 bg-[#100b1a] border border-brand-purple/30 rounded-2xl animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3 text-center">Demande confirmée</h2>
                <p className="text-gray-400 text-center text-sm leading-relaxed font-light">
                    Votre demande a bien été enregistrée. Jérémy procède à la vérification manuelle. Vous recevrez vos accès directement par e-mail très prochainement.
                </p>
            </div>
        );
    }

    return (
        <form action={handleAction} className="space-y-5">
            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-none text-red-200 text-sm text-center">
                    {error}
                </div>
            )}
            
            <div className="space-y-2">
                <label htmlFor="fullName" className="text-gray-400 text-xs font-bold uppercase tracking-wider">Nom & Prénom</label>
                <input 
                    type="text" 
                    id="fullName"
                    name="fullName"
                    required
                    maxLength={100}
                    placeholder="Ex: Jean Dupont"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 transition-colors text-sm"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="email" className="text-gray-400 text-xs font-bold uppercase tracking-wider">Adresse E-mail</label>
                <div className="relative group/input">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-gray-500 transition-colors group-focus-within/input:text-brand-purple" />
                    </div>
                    <input 
                        type="email" 
                        id="email"
                        name="email"
                        required
                        placeholder="jean.dupont@exemple.com"
                        className="w-full bg-black/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 transition-colors text-sm"
                    />
                </div>
            </div>

            <div className="space-y-2 group">
                <label htmlFor="context" className="text-gray-400 text-xs font-bold uppercase tracking-wider transition-colors group-focus-within:text-brand-purple">Où nous sommes-nous rencontrés ?</label>
                <input 
                    type="text" 
                    id="context"
                    name="context"
                    required
                    maxLength={150}
                    placeholder="Ex: Conférence d'entreprise, Spectacle..."
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 transition-all text-sm"
                />
                <p className="text-[11px] leading-snug text-gray-500 pt-1 font-light">
                    Cette information est requise pour valider votre identité avant la création de l'accès gratuit.
                </p>
            </div>

            <div className="flex items-start gap-3 p-4 bg-black/50 border border-white/10 rounded-xl mt-2">
                <div className="flex items-center h-5 mt-0.5">
                    <input
                        id="newsletter"
                        name="newsletter"
                        type="checkbox"
                        value="yes"
                        defaultChecked
                        className="w-4 h-4 rounded-[4px] border-white/20 bg-black text-brand-purple focus:ring-brand-purple focus:ring-offset-black"
                    />
                </div>
                <label htmlFor="newsletter" className="text-[13px] text-gray-300 leading-snug cursor-pointer font-light">
                    M'inscrire aux communications de l'Atelier (Astuces pro, nouveautés, offres privées).
                </label>
            </div>

            <button 
                type="submit" 
                disabled={pending}
                className="w-full bg-white hover:bg-gray-200 text-black font-bold uppercase tracking-widest text-sm py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-50 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:cursor-wait"
            >
                {pending ? (
                    <>
                        <span>Traitement...</span>
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin ml-2"></span>
                    </>
                ) : (
                    <>
                        <span>Demander l'accès</span>
                        <ArrowRight className="w-4 h-4" />
                    </>
                )}
            </button>
        </form>
    );
}
