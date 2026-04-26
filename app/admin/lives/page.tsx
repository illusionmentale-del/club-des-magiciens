"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, Video, Calendar, Play, Trash2, StopCircle, Plus } from "lucide-react";
import { updateLiveStatus, deleteLive } from "../actions";
import { useAdmin } from "../AdminContext";
import { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";

// Types
type Live = {
    id: string;
    title: string;
    description?: string;
    start_date: string;
    status: string;
    platform: string;
    platform_id: string;
    audience: string;
};

export default function AdminLivesPage() {
    const { audience, setAudience } = useAdmin();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const queryAudience = searchParams.get("audience");

    const basePath = pathname.includes('/kids/') ? '/admin/kids' : (pathname.includes('/adults/') ? '/admin/adults' : '/admin');
    const currentAudience = pathname.includes('/adults/') ? 'adults' : (pathname.includes('/kids/') ? 'kids' : queryAudience || 'kids');

    const [lives, setLives] = useState<Live[]>([]);
    const supabase = createClient();

    // Auto-switch audience context if arrived via a sidebar link
    useEffect(() => {
        if (currentAudience === 'kids' || currentAudience === 'adults') {
            setAudience(currentAudience);
        }
    }, [currentAudience, setAudience]);

    useEffect(() => {
        const fetchLives = async () => {
            const { data } = await supabase.from("lives").select("*").order("start_date", { ascending: false });
            if (data) setLives(data);
        };
        fetchLives();
    }, []);

    const filteredLives = lives.filter(live => {
        if (audience === 'adults') return live.audience === 'adults' || live.audience === 'all';
        if (audience === 'kids') return live.audience === 'kids' || live.audience === 'all';
        return true;
    });

    const themeColor = 'bg-brand-purple text-white hover:bg-brand-purple/90 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all';
    const badgeColor = 'bg-brand-purple/10 text-brand-purple border border-brand-purple/20';
    const iconColor = 'text-brand-purple';

    return (
        <div className={`w-full transition-colors duration-500`}>
            <header className="flex items-center justify-between mb-8">
                <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Retour au QG Admin
                </Link>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${badgeColor}`}>
                        <Video className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Gestion des Événements</h1>
                        <div className={`text-sm px-2 py-0.5 rounded inline-block mt-1 uppercase font-bold tracking-wider ${badgeColor}`}>
                            Mode {audience === 'adults' ? 'Adulte' : 'Enfant'}
                        </div>
                    </div>
                </div>
            </header>

            <div className="space-y-8">
                {/* Actions */}
                <div className="flex justify-end">
                    <Link href={`${basePath}/lives/new?audience=${audience}`} className={`px-6 py-3 ${themeColor} font-bold flex items-center gap-2 transition-colors`}>
                        <Calendar className="w-5 h-5" />
                        Programmer un Nouvel Événement
                    </Link>
                </div>

                {/* List */}
                <div className="grid gap-4">
                    {filteredLives.map((live) => (
                        <div key={live.id} className="bg-[#100b1a] border border-white/5 hover:border-brand-purple/30 rounded-3xl p-6 flex items-center justify-between group transition-all shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold">{live.title}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${live.status === 'en_cours' ? 'bg-red-500 text-white animate-pulse' :
                                        live.status === 'programmé' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {live.status === 'programmé' ? 'Bientôt' : live.status}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border border-white/10 ${live.audience === 'kids' ? 'text-purple-400' : live.audience === 'all' ? 'text-yellow-400' : 'text-gray-400'}`}>
                                        {live.audience === 'kids' ? 'Enfants' : live.audience === 'all' ? 'Tout le monde' : 'Adultes'}
                                    </span>
                                </div>
                                <div className="text-gray-400 flex items-center gap-4 text-sm">
                                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(live.start_date).toLocaleString()}</span>
                                    {live.platform === 'jitsi' && <span className="text-gray-500">Jitsi: {live.platform_id}</span>}
                                    {live.platform === 'zoom' && <span className="text-gray-500">Zoom: {live.platform_id}</span>}
                                    {live.platform === 'bunny' && <span className="text-gray-500">Vidéo: {live.platform_id}</span>}
                                </div>
                                <div className="mt-4">
                                    <Link href={`${basePath}/lives/${live.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-[16px] font-bold text-sm transition-colors border border-blue-500/20">
                                        <Video className="w-4 h-4" />
                                        Ouvrir la Salle de Contrôle
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {live.status === 'programmé' && (
                                    <form action={updateLiveStatus.bind(null, live.id, 'en_cours', undefined)}>
                                        <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-[16px] font-bold flex items-center gap-2 text-sm">
                                            <Play className="w-4 h-4" />
                                            Lancer le Live (Go Live)
                                        </button>
                                    </form>
                                )}
                                {live.status === 'en_cours' && (
                                    <form action={updateLiveStatus.bind(null, live.id, 'terminé', undefined)}>
                                        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-[16px] font-bold flex items-center gap-2 text-sm">
                                            <StopCircle className="w-4 h-4" />
                                            Arrêter
                                        </button>
                                    </form>
                                )}
                                {live.status === 'terminé' && (live.platform === 'jitsi' || live.platform === 'zoom') && (
                                    <Link href={`${basePath}/lives/${live.id}/replay`} className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-[16px] font-bold text-sm">
                                        Ajouter Replay
                                    </Link>
                                )}

                                <form action={deleteLive.bind(null, live.id)}>
                                    <button className="p-2 text-gray-500 hover:text-red-500 transition-colors" title="Supprimer">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                    {filteredLives.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-16 bg-[#100b1a] rounded-3xl border border-dashed border-brand-purple/30 shadow-[0_0_30px_rgba(168,85,247,0.05)]">
                            <div className="w-20 h-20 bg-brand-purple/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                                <Video className="w-10 h-10 text-brand-purple" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Aucune diffusion prévue</h3>
                            <p className="text-brand-text-muted mb-6">
                                Il n'y a aucune session programmée pour l'espace <span className="font-bold text-brand-purple">{audience === 'adults' ? 'Adulte' : 'Enfant'}</span>.
                            </p>
                            <Link href={`${basePath}/lives/new?audience=${audience}`} className="px-6 py-3 bg-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.15)]">
                                <Plus className="w-5 h-5" />
                                Créer un événement
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
