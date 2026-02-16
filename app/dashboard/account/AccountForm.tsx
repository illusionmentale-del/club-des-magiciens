"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateProfile } from "./actions";
import { User, MapPin, Wand2, Lock, AlertCircle, Check } from "lucide-react";
import { useState } from "react";

import AvatarUpload from "@/components/AvatarUpload";

function SubmitButton({ theme }: { theme: 'light' | 'dark' }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className={`w-full py-4 font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${theme === 'light'
                ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-purple-500/20'
                : 'bg-magic-purple hover:bg-magic-purple/80 text-white shadow-[0_0_20px_rgba(124,58,237,0.3)]'
                }`}
        >
            {pending ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
    );
}

export default function AccountForm({ user, profile, theme = 'dark' }: { user: any, profile: any, theme?: 'light' | 'dark' }) {
    // @ts-ignore
    const [state, formAction] = useFormState(updateProfile, null);
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
        ? "bg-white border text-gray-800 shadow-sm border-gray-100"
        : "bg-black/20 border border-white/10 text-white";

    const labelClass = theme === 'light'
        ? "text-gray-600 font-semibold"
        : "text-gray-400 font-medium";

    const inputClass = theme === 'light'
        ? "w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:outline-none transition-all text-gray-900 placeholder-gray-400"
        : "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-1 focus:ring-white/50 focus:outline-none transition-all text-white placeholder-gray-500";

    const titleClass = theme === 'light' ? "text-gray-900" : "text-white";
    const iconClass = theme === 'light' ? "text-purple-600" : "text-gray-400";

    return (
        <form action={formAction} className="space-y-8">
            {/* Identity Section */}
            <section className={`${cardClass} rounded-2xl p-8`}>
                <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${titleClass}`}>
                    <User className={`w-5 h-5 ${iconClass}`} />
                    Identité
                </h2>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar Upload */}
                    <div className="shrink-0 mx-auto md:mx-0">
                        <AvatarUpload
                            theme={theme}
                            currentAvatarUrl={theme === 'light' ? profile?.avatar_url_kids : profile?.avatar_url}
                            onUpload={(url) => setAvatarUrl(url)}
                        />
                        <input type="hidden" name="avatarUrl" value={avatarUrl || ""} />
                        <input type="hidden" name="theme" value={theme} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 w-full">
                        <div>
                            <label className={`block text-sm mb-2 ${labelClass}`}>Pseudonyme</label>
                            <input name="username" defaultValue={profile?.username || ""} placeholder="Votre pseudo" className={inputClass} />
                        </div>
                        <div>
                            <label className={`block text-sm mb-2 ${labelClass}`}>Ville / QG</label>
                            <div className="relative">
                                <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${theme === 'light' ? 'text-gray-400' : 'text-gray-600'}`} />
                                <input name="city" defaultValue={profile?.city || ""} placeholder="Paris, France" className={`${inputClass} pl-10`} />
                            </div>
                        </div>
                        <div className="col-span-full">
                            <label className={`block text-sm mb-2 ${labelClass}`}>Bio / Présentation</label>
                            <textarea name="bio" defaultValue={profile?.bio || ""} placeholder="Quelques mots sur vous..." rows={4} className={inputClass} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Magic Level */}
            <section className={`${cardClass} rounded-2xl p-8`}>
                <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${titleClass}`}>
                    <Wand2 className={`w-5 h-5 ${iconClass}`} />
                    Niveau de Magie
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {levels.map((lvl) => {
                        const isSelected = level === lvl.id;
                        let optionClass = "cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-2 transition-all ";

                        if (theme === 'light') {
                            optionClass += isSelected
                                ? "bg-purple-50 border-purple-500 text-purple-700 shadow-md transform scale-105"
                                : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300";
                        } else {
                            optionClass += isSelected
                                ? "bg-white/10 border-white text-white"
                                : "bg-transparent border-white/5 text-gray-500 hover:bg-white/5";
                        }

                        return (
                            <label key={lvl.id} className={optionClass}>
                                <input type="radio" name="magic_level" value={lvl.id} checked={isSelected} onChange={() => setLevel(lvl.id)} className="hidden" />
                                <span className="text-2xl">{lvl.icon}</span>
                                <span className="text-sm font-medium text-center">{lvl.label}</span>
                            </label>
                        );
                    })}
                </div>
            </section>

            {/* Security Section */}
            <section className={`${cardClass} rounded-2xl p-8 ${theme === 'dark' ? 'opacity-80 hover:opacity-100' : ''} transition-opacity`}>
                <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${titleClass}`}>
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
                        <p className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Votre email : {user.email}</p>
                    </div>
                </div>
            </section>

            {state?.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-3 font-medium">
                    <AlertCircle className="w-5 h-5" />
                    {state.error}
                </div>
            )}

            {state?.success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 flex items-center gap-3 font-medium">
                    <Check className="w-5 h-5" />
                    {state.success}
                </div>
            )}

            <SubmitButton theme={theme} />
        </form>
    );
}
