"use client";

import { createLive } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { useAdmin } from "../../AdminContext";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";

export default function NewLivePage() {
    const { audience, setAudience } = useAdmin();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const queryAudience = searchParams.get("audience");

    const basePath = pathname.includes('/kids/') ? '/admin/kids' : (pathname.includes('/adults/') ? '/admin/adults' : '/admin');
    const currentAudience = pathname.includes('/adults/') ? 'adults' : (pathname.includes('/kids/') ? 'kids' : queryAudience || 'kids');

    useEffect(() => {
        if (currentAudience === 'kids' || currentAudience === 'adults') {
            setAudience(currentAudience);
        }
    }, [currentAudience, setAudience]);

    const themeColor = audience === 'adults' ? 'bg-brand-gold text-black hover:bg-brand-gold/90' : 'bg-brand-purple text-white hover:bg-brand-purple/90';
    const textColor = audience === 'adults' ? 'text-brand-gold' : 'text-brand-purple';

    const [platform, setPlatform] = useState('jitsi');

    return (
        <div className={`flex flex-col flex-1 w-full text-white p-8 items-center justify-center min-h-[calc(100vh-80px)] transition-colors duration-500`}>
            <div className="w-full max-w-2xl">
                <Link href={`${basePath}/lives`} className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Retour
                </Link>

                <div className={`bg-white/5 border ${audience === 'adults' ? 'border-white/10' : 'border-brand-purple/20'} p-8 rounded-2xl`}>
                    <h1 className={`text-3xl font-bold mb-8 ${textColor}`}>Programmer une Session (Live / Masterclass)</h1>

                    <form action={createLive} className="space-y-6">
                        <div className="p-4 bg-brand-purple/10 border border-brand-purple/20 rounded-xl mb-6 text-sm text-brand-purple">
                            Cet espace vous permet de créer des rendez-vous ponctuels à date fixe avec vos élèves. Utilisez-le pour organiser vos Lives interactifs ou pour diffuser une vidéo pré-enregistrée façon 'Première' tous ensemble.
                        </div>

                        {/* Hidden Audience Field - Auto-filled by context */}
                        <input type="hidden" name="audience" value={audience} />

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Titre de l'événement</label>
                            <input name="title" required placeholder="Ex: Masterclass Cartomagie #4" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors" />
                        </div>

                        {/* Optional Audience Override - simplified */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Comment l'appeler pour les enfants ?</label>
                                <select name="event_type" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors text-gray-400">
                                    <option value="live">Le Nouveau Live</option>
                                    <option value="video">La Première Vidéo</option>
                                    <option value="masterclass">La Masterclass</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Date et Heure</label>
                                <input name="start_date" type="datetime-local" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors [color-scheme:dark]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Format / Plateforme</label>
                                <select
                                    name="platform"
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors"
                                >
                                    <option value="bunny">📡 Première Vidéo (Bunny Stream)</option>
                                    <option value="jitsi">🎥 Live Interactif (Jitsi Meet)</option>
                                    <option value="zoom">🎥 Live Interactif (Zoom)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                {platform === 'jitsi' ? 'Nom de la Salle Jitsi (Identifiant)' : platform === 'zoom' ? 'Lien d\'invitation Zoom' : 'ID ou Code de la Vidéo Bunny'}
                            </label>
                            <div className="relative">
                                {platform === 'jitsi' && (
                                    <span className="absolute left-4 top-4 text-gray-500 select-none">
                                        meet.jit.si/
                                    </span>
                                )}
                                <input
                                    name="platform_id"
                                    required
                                    placeholder={platform === 'jitsi' ? "ClubMagiciens-Live-Secret" : platform === 'zoom' ? "https://zoom.us/j/..." : "libraryId_videoId ou lien"}
                                    className={`w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors ${platform === 'jitsi' ? 'pl-32' : ''}`}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {platform === 'jitsi'
                                    ? "Créez un nom unique pour votre salle."
                                    : platform === 'zoom' ? "Collez le lien complet de la réunion Zoom." : "ID de la vidéo pré-enregistrée."}
                            </p>
                        </div>

                        <button type="submit" className={`w-full ${themeColor} font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-8`}>
                            <Save className="w-5 h-5" />
                            Confirmer la programmation
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
