"use client";

import { createLive } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useAdmin } from "../../AdminContext";
import { useState } from "react";

export default function NewLivePage() {
    const { audience } = useAdmin();
    const themeColor = audience === 'adults' ? 'bg-red-600' : 'bg-red-500';
    const bgClass = audience === 'adults' ? 'bg-black' : 'bg-gray-900';

    const [platform, setPlatform] = useState('jitsi');

    return (
        <div className={`min-h-screen ${bgClass} text-white p-8 flex items-center justify-center transition-colors duration-500`}>
            <div className="w-full max-w-2xl">
                <Link href="/admin/lives" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Retour
                </Link>

                <div className={`bg-magic-card border ${audience === 'adults' ? 'border-white/10' : 'border-purple-500/20'} p-8 rounded-2xl`}>
                    <h1 className="text-3xl font-bold mb-8 text-magic-gold">Programmer un Live ({audience === 'adults' ? 'Adulte' : 'Enfant'})</h1>

                    <form action={createLive} className="space-y-6">
                        {/* Hidden Audience Field - Auto-filled by context */}
                        <input type="hidden" name="audience" value={audience} />

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Titre de l'événement</label>
                            <input name="title" required placeholder="Ex: Masterclass Cartomagie #4" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors" />
                        </div>

                        {/* Optional Audience Override - similar to News */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Cible (Audience)</label>
                            <select name="audience_override" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors text-gray-400">
                                <option value={audience}>Cible : Uniquement {audience === 'adults' ? 'Adultes' : 'Enfants'} (Par défaut)</option>
                                <option value="all">Tout le monde (Adultes + Enfants)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Date et Heure</label>
                                <input name="start_date" type="datetime-local" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors [color-scheme:dark]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Plateforme</label>
                                <select
                                    name="platform"
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors"
                                >
                                    <option value="jitsi">Jitsi Meet (Gratuit / Interactif)</option>
                                    <option value="vimeo">Vimeo Live (Payant / Diffusion)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                {platform === 'jitsi' ? 'Nom de la Salle Jitsi (Identifiant)' : 'ID de l\'événement Vimeo'}
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-gray-500 select-none">
                                    {platform === 'jitsi' ? 'meet.jit.si/' : 'vimeo.com/event/'}
                                </span>
                                <input
                                    name="platform_id"
                                    required
                                    placeholder={platform === 'jitsi' ? "ClubMagiciens-Live-Secret" : "1234567"}
                                    className={`w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors ${platform === 'jitsi' ? 'pl-32' : 'pl-40'}`}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {platform === 'jitsi'
                                    ? "Créez un nom unique pour votre salle."
                                    : "Collez l'ID de votre événement Vimeo Live (ex: 1234567)."}
                            </p>
                        </div>

                        <button type="submit" className={`w-full ${themeColor} hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 mt-8`}>
                            <Save className="w-5 h-5" />
                            Confirmer la programmation
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
