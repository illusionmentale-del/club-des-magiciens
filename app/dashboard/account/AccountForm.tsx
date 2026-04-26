"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile } from "./actions";
import { User, MapPin, Wand2, Lock, AlertCircle, Check, Sparkles } from "lucide-react";
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
                    : 'bg-brand-purple hover:bg-indigo-500 text-black shadow-lg hover:shadow-brand-purple/30 hover:scale-105'
            }`}
        >
            {pending ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
    );
}

export default function AccountForm({ user, profile, theme = 'dark', isKidProfile = false }: { user: any, profile: any, theme?: 'light' | 'dark', isKidProfile?: boolean }) {
    const [state, formAction] = useActionState(updateProfile, null);
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
        : "bg-[#1c1c1e] border border-white/5 text-[#f5f5f7] rounded-[32px] shadow-xl";

    const labelClass = theme === 'light'
        ? "text-gray-600 font-semibold"
        : "text-[#86868b] font-medium";

    const inputClass = theme === 'light'
        ? "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition-all text-gray-900 placeholder-gray-400"
        : "w-full bg-[#000000]/50 border border-white/5 rounded-[16px] px-4 py-4 focus:ring-1 focus:ring-white/20 focus:outline-none transition-all text-[#f5f5f7] placeholder-[#86868b]/50";

    const titleClass = theme === 'light' ? "text-gray-900" : "text-[#f5f5f7]";
    const iconClass = theme === 'light' ? "text-purple-600" : "text-[#86868b]";

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
            <section className={`${cardClass} p-8 md:p-10 ${theme === 'dark' ? 'hover:border-brand-purple/30' : ''} transition-all`}>
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
