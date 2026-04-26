"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile } from "./actions";
import { User, MapPin, Wand2, Lock, AlertCircle, Check, Sparkles, CreditCard } from "lucide-react";
import { useState } from "react";

import AvatarUpload from "@/components/AvatarUpload";
import KidsAvatarSelector from "@/components/KidsAvatarSelector";

function SubmitButton({ theme, isKidProfile }: { theme: 'light' | 'dark', isKidProfile?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full py-4 font-semibold rounded-full transition-all disabled:opacity-50 flex justify-center items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                isKidProfile
                    ? 'bg-gradient-to-r from-brand-purple to-indigo-500 text-white shadow-brand-purple/20'
                    : 'bg-brand-purple hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-105'
            }`}
        >
            {pending ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
    );
}

export default function AccountForm({ user, profile, theme = 'dark', isKidProfile = false }: { user: any, profile: any, theme?: 'light' | 'dark', isKidProfile?: boolean }) {
    const [state, formAction] = useActionState(updateProfile, null);
    const [deleteAccount, setDeleteAccount] = useState(false);
    const [level, setLevel] = useState(profile?.magic_level || "Apprenti");
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const levels = [
        { id: "Moldue", label: "Moldu Curieux", icon: "👀" },
        { id: "Apprenti", label: "Apprenti Magicien", icon: "✨" },
        { id: "Illusioniste", label: "Illusioniste Confirmé", icon: "🎩" },
        { id: "Maitre", label: "Professionnel", icon: "🔮" },
    ];

    // Theme variations
    const cardClass = theme === 'light'
        ? "bg-white border text-gray-800 shadow-sm border-gray-100 rounded-2xl"
        : "bg-[#1c1c1e] border border-white/5 text-[#f5f5f7] rounded-[32px] shadow-xl hover:border-brand-purple/30 transition-all duration-500";

    const labelClass = theme === 'light'
        ? "text-gray-600 font-semibold"
        : "text-[#86868b] font-medium";

    const inputClass = theme === 'light'
        ? "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition-all text-gray-900 placeholder-gray-400"
        : "w-full bg-[#000000] border border-white/10 hover:border-white/20 rounded-[16px] px-4 py-4 focus:ring-2 focus:ring-brand-purple/50 focus:border-brand-purple focus:outline-none transition-all text-white placeholder-[#86868b]/50 shadow-inner";

    const titleClass = theme === 'light' ? "text-gray-900" : "text-[#f5f5f7]";
    const iconClass = theme === 'light' ? "text-purple-600" : "text-brand-purple";

    return (
        <form action={formAction} className="space-y-8">
            <input type="hidden" name="targetProfile" value={isKidProfile ? 'kid' : 'adult'} />
            <input type="hidden" name="theme" value={theme} />

            {/* Identity Section */}
            {!isKidProfile && (
                <section className={`${cardClass} p-8 md:p-10`}>
                    <h2 className={`text-xl font-semibold mb-6 flex items-center gap-3 ${titleClass} tracking-tight`}>
                    <User className={`w-5 h-5 ${iconClass}`} />
                    Identité
                </h2>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar Upload / Selection */}
                    <div className="shrink-0 mx-auto md:mx-0">
                        <AvatarUpload
                            theme={theme}
                            currentAvatarUrl={profile?.avatar_url}
                            onUpload={(url) => setAvatarUrl(url)}
                        />
                        <input type="hidden" name="avatarUrl" value={avatarUrl !== null ? avatarUrl : (profile?.avatar_url || "")} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
                        <div>
                            <label className={`block text-sm mb-2 ${labelClass}`}>Pseudonyme</label>
                            <input name="username" defaultValue={profile?.username || ""} placeholder="Votre pseudo" className={inputClass} required={isKidProfile} />
                        </div>
                        <div>
                            <label className={`block text-sm mb-2 ${labelClass}`}>Ville / QG</label>
                            <div className="relative">
                                <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'light' ? 'text-gray-400' : 'text-[#86868b]'}`} />
                                <input name="city" defaultValue={profile?.city || ""} placeholder="Paris, France" className={`${inputClass} pl-12`} />
                            </div>
                        </div>
                        <div className="col-span-full">
                            <label className={`block text-sm mb-2 ${labelClass}`}>Bio / Présentation</label>
                            <textarea name="bio" defaultValue={profile?.bio || ""} placeholder="Quelques mots sur vous..." rows={4} className={inputClass} />
                        </div>
                    </div>
                </div>
            </section>
            )}

            {/* Security Section */}
            <section className={`${cardClass} p-8 md:p-10`}>
                <h2 className={`text-xl font-semibold mb-6 flex items-center gap-3 ${titleClass} tracking-tight`}>
                    <Lock className={`w-5 h-5 ${iconClass}`} />
                    Sécurité & Connexion
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={`block text-sm mb-2 ${labelClass}`}>Nouveau mot de passe</label>
                        <input type="password" name="password" placeholder="••••••••" className={inputClass} />
                    </div>
                    <div>
                        <label className={`block text-sm mb-2 ${labelClass}`}>Confirmer</label>
                        <input type="password" name="confirmPassword" placeholder="••••••••" className={inputClass} />
                    </div>
                    <div className="col-span-full">
                        <p className={`text-sm mt-2 ${theme === 'light' ? 'text-gray-500' : 'text-[#86868b] font-light'}`}>Votre email : {user.email}</p>
                    </div>
                </div>
            </section>

            {/* Subscription Section */}
            <section className={`${cardClass} p-8 md:p-10 border-red-500/20 hover:border-red-500/40`}>
                <h2 className={`text-xl font-semibold mb-6 flex items-center gap-3 ${titleClass} tracking-tight`}>
                    <CreditCard className={`w-5 h-5 text-red-500`} />
                    Abonnement
                </h2>
                <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                    <div className="flex-1">
                        <p className={`text-base font-medium ${theme === 'light' ? 'text-gray-900' : 'text-white'} mb-1`}>
                            Gérer mon abonnement
                        </p>
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-[#86868b] font-light'} max-w-md mb-4`}>
                            Conformément à nos conditions, votre abonnement est sans engagement. Vous pouvez l'annuler à tout moment sur simple demande.
                        </p>
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative flex items-center justify-center">
                                <input 
                                    type="checkbox" 
                                    className="peer sr-only"
                                    checked={deleteAccount}
                                    onChange={(e) => setDeleteAccount(e.target.checked)}
                                />
                                <div className={`w-5 h-5 border-2 rounded transition-all duration-200 ${deleteAccount ? 'bg-red-500 border-red-500' : 'border-red-500/30 group-hover:border-red-500/60'}`}></div>
                                {deleteAccount && <Check className="absolute w-3.5 h-3.5 text-white pointer-events-none" strokeWidth={3} />}
                            </div>
                            <span className={`text-sm font-medium ${deleteAccount ? 'text-red-400' : (theme === 'light' ? 'text-gray-600' : 'text-[#86868b]')} transition-colors`}>
                                Supprimer mon compte (Action irréversible)
                            </span>
                        </label>
                    </div>
                    <a
                        onClick={(e) => {
                            if (deleteAccount) {
                                const confirmed = window.confirm("Toutes les données concernant votre compte seront supprimées de manière irréversible. Êtes-vous sûr de vouloir continuer ?");
                                if (!confirmed) {
                                    e.preventDefault();
                                }
                            }
                        }}
                        href={isKidProfile 
                            ? `mailto:contact@clubdespetitsmagiciens.fr?subject=Demande%20d'annulation%20d'abonnement${deleteAccount ? '%20et%20suppression%20de%20compte' : ''}` 
                            : `mailto:contact@atelierdesmagiciens.fr?subject=Demande%20d'annulation%20d'abonnement${deleteAccount ? '%20et%20suppression%20de%20compte' : ''}`
                        }
                        className="shrink-0 px-6 py-3 mt-2 md:mt-0 font-semibold rounded-xl border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg hover:shadow-red-500/20"
                    >
                        {deleteAccount ? "Annuler et Supprimer" : "Annuler mon abonnement"}
                    </a>
                </div>
            </section>

            {state?.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-[16px] text-red-400 flex items-center gap-3 font-medium">
                    <AlertCircle className="w-5 h-5" />
                    {state.error}
                </div>
            )}

            {state?.success && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-[16px] text-green-400 flex items-center gap-3 font-medium">
                    <Check className="w-5 h-5" />
                    {state.success}
                </div>
            )}

            <SubmitButton theme={theme} isKidProfile={isKidProfile} />
        </form>
    );
}
