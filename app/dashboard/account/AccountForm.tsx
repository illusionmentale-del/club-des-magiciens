"use client";

import { useFormState, useFormStatus } from "react-dom";
import { updateProfile } from "./actions";
import { User, MapPin, Wand2, Lock, AlertCircle, Check } from "lucide-react";
import { useState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-magic-purple hover:bg-magic-purple/80 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
        >
            {pending ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
    );
}

export default function AccountForm({ user, profile }: { user: any, profile: any }) {
    // @ts-ignore
    const [state, formAction] = useFormState(updateProfile, null);
    const [level, setLevel] = useState(profile?.magic_level || "Apprenti");

    const levels = [
        { id: "Moldue", label: "Moldue Curieux", icon: "👀" },
        { id: "Apprenti", label: "Apprenti Magicien", icon: "✨" },
        { id: "Illusioniste", label: "Illusioniste Confirmé", icon: "🎩" },
        { id: "Maitre", label: "Maître de l'Occulte", icon: "🔮" },
    ];

    return (
        <form action={formAction} className="space-y-12">
            {/* Identity Section */}
            <section className="bg-magic-card border border-white/10 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="p-2 bg-purple-500/10 rounded-lg text-magic-purple"><User className="w-5 h-5" /></span>
                    Identité
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Pseudonyme</label>
                        <input name="username" defaultValue={profile?.username || ""} placeholder="Le Grand..." className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-magic-purple focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Ville / QG</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input name="city" defaultValue={profile?.city || ""} placeholder="Paris, France" className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-magic-purple focus:outline-none" />
                        </div>
                    </div>
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-400 mb-2">Bio / Présentation</label>
                        <textarea name="bio" defaultValue={profile?.bio || ""} placeholder="Dites-nous en plus sur votre magie..." rows={4} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-magic-purple focus:outline-none" />
                    </div>
                </div>
            </section>

            {/* Magic Level Section */}
            <section className="bg-magic-card border border-white/10 rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><Wand2 className="w-5 h-5" /></span>
                    Niveau de Magie
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {levels.map((lvl) => (
                        <label key={lvl.id} className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center gap-3 transition-all ${level === lvl.id ? 'bg-magic-purple/20 border-magic-purple shadow-[0_0_15px_rgba(124,58,237,0.2)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                            <input type="radio" name="magic_level" value={lvl.id} checked={level === lvl.id} onChange={() => setLevel(lvl.id)} className="hidden" />
                            <span className="text-2xl">{lvl.icon}</span>
                            <span className={`text-sm font-medium text-center ${level === lvl.id ? 'text-white' : 'text-gray-400'}`}>{lvl.label}</span>
                        </label>
                    ))}
                </div>
            </section>

            {/* Security Section (Password) */}
            <section className="bg-magic-card border border-white/10 rounded-2xl p-8 opacity-80 hover:opacity-100 transition-opacity">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <span className="p-2 bg-red-500/10 rounded-lg text-red-400"><Lock className="w-5 h-5" /></span>
                    Sécurité & Connexion
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Nouveau mot de passe</label>
                        <input type="password" name="password" placeholder="••••••••" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-magic-purple focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Confirmer le nouveau mot de passe</label>
                        <input type="password" name="confirmPassword" placeholder="••••••••" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-magic-purple focus:outline-none" />
                    </div>
                    <div className="col-span-full">
                        <p className="text-gray-500 text-sm">Votre email : {user.email}</p>
                    </div>
                </div>
            </section>

            {state?.error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    {state.error}
                </div>
            )}

            {state?.success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 flex items-center gap-3">
                    <Check className="w-5 h-5" />
                    {state.success}
                </div>
            )}

            <SubmitButton />
        </form>
    );
}
