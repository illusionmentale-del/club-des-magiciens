"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfile } from "@/app/dashboard/account/actions";
import { User, Sparkles, Check, AlertCircle, Edit2, X } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-3 bg-brand-purple hover:bg-brand-purple/80 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 flex justify-center items-center gap-2"
        >
            {pending ? (
                "Sauvegarde..."
            ) : (
                <>
                    <Check className="w-5 h-5" /> Enregistrer mes informations
                </>
            )}
        </button>
    );
}

export default function KidsIdentityForm({ profile }: { profile: any }) {
    const [state, formAction] = useActionState(updateProfile, null);
    const [isEditing, setIsEditing] = useState(false);

    if (!isEditing) {
        return (
            <button
                onClick={() => setIsEditing(true)}
                className="mt-6 flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all shadow-lg mx-auto"
            >
                <Edit2 className="w-4 h-4 text-brand-purple" />
                Personnaliser mon profil
            </button>
        );
    }

    return (
        <div className="mt-8 bg-brand-card/80 border border-brand-purple/30 rounded-3xl p-6 md:p-8 shadow-[0_0_40px_rgba(168,85,247,0.15)] backdrop-blur-xl relative overflow-hidden w-full max-w-xl mx-auto animate-in slide-in-from-bottom-4 duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-brand-blue/5 pointer-events-none"></div>

            <div className="flex justify-between items-center mb-6 relative">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-brand-purple" />
                    Mon Identité Magique
                </h3>
                <button
                    onClick={() => setIsEditing(false)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form action={formAction} className="space-y-6 relative">
                <input type="hidden" name="targetProfile" value="kid" />
                <input type="hidden" name="theme" value="dark" />

                <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                        Mon Pseudonyme
                    </label>
                    <input
                        name="username"
                        defaultValue={profile?.username || ""}
                        placeholder="Ton nom de scène..."
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-purple/50 focus:border-transparent focus:outline-none transition-all text-white font-bold"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                        Ma Faction
                    </label>
                    <select
                        name="city"
                        defaultValue={profile?.city || ""}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-purple/50 focus:border-transparent focus:outline-none transition-all text-white font-bold appearance-none cursor-pointer"
                        required
                    >
                        <option value="" disabled>Choisis ta faction...</option>
                        <option value="Magicien">🎩 Magicien / Magicienne</option>
                        <option value="Sorcier">🔮 Sorcier / Sorcière</option>
                        <option value="Elfe">🧝 Elfe</option>
                        <option value="Fée">🧚 Fée</option>
                        <option value="Licorne">🦄 Licorne</option>
                        <option value="Illusionniste">🌟 Illusionniste</option>
                        <option value="Mentaliste">🧠 Mentaliste</option>
                        <option value="Druide">🌿 Druide</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wide">
                        Ma Formule / Bio
                    </label>
                    <textarea
                        name="bio"
                        defaultValue={profile?.bio || ""}
                        placeholder="Une petite phrase magique ou une présentation courte..."
                        rows={3}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-purple/50 focus:border-transparent focus:outline-none transition-all text-white resize-none"
                    />
                </div>

                {state?.error && (
                    <div className="p-4 bg-red-500/20 text-red-300 rounded-xl text-sm border border-red-500/30 flex items-center gap-3 font-bold">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        {state.error}
                    </div>
                )}

                {state?.success && (
                    <div className="p-4 bg-emerald-500/20 text-emerald-300 rounded-xl text-sm border border-emerald-500/30 flex items-center gap-3 font-bold">
                        <Sparkles className="w-5 h-5 shrink-0" />
                        Sauvegardé avec succès !
                    </div>
                )}

                <SubmitButton />
            </form>
        </div>
    );
}
