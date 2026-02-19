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

    const themeColor = audience === 'adults' ? 'bg-brand-gold text-black hover:bg-brand-gold/90' : 'bg-brand-purple text-white hover:bg-brand-purple/90';
    const badgeColor = audience === 'adults' ? 'bg-brand-gold/20 text-brand-gold' : 'bg-brand-purple/20 text-brand-purple';
    const iconColor = audience === 'adults' ? 'text-brand-gold' : 'text-brand-purple';

    return (
        <div className={`w-full transition-colors duration-500`}>
            <header className="flex items-center justify-between mb-8 max-w-5xl mx-auto">
                <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Retour au QG Admin
                </Link>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${badgeColor}`}>
                        <Video className={`w-6 h-6 ${iconColor}`} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Gestion des Lives ({audience === 'adults' ? 'Adulte' : 'Enfant'})</h1>
                        <div className={`text-sm px-2 py-0.5 rounded inline-block mt-1 uppercase font-bold tracking-wider ${badgeColor}`}>
                            Mode {audience === 'adults' ? 'Adulte' : 'Enfant'}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Actions */}
                <div className="flex justify-end">
                    <Link href={`${basePath}/lives/new?audience=${audience}`} className={`px-6 py-3 ${themeColor} rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg`}>
                        <Calendar className="w-5 h-5" />
                        Programmer un Live {audience === 'kids' && '(Kids)'}
                    </Link>
                </div>

                {/* List */}
                <div className="grid gap-4">
                    {filteredLives.map((live) => (
                        <div key={live.id} className={`bg-white/5 border ${audience === 'adults' ? 'border-white/10' : 'border-purple-500/20'} p-6 rounded-2xl flex items-center justify-between group hover:bg-white/10 transition-colors`}>
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
                                    {live.platform === 'vimeo' && <span className="text-gray-500">Replay Vimeo: {live.platform_id}</span>}
                                </div>
                                <div className="mt-4">
                                    <Link href={`${basePath}/lives/${live.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg font-bold text-sm transition-colors border border-blue-500/20">
                                        <Video className="w-4 h-4" />
                                        Ouvrir la Salle de Contrôle
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {live.status === 'programmé' && (
                                    <form action={updateLiveStatus.bind(null, live.id, 'en_cours', undefined)}>
                                        <button className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg font-bold flex items-center gap-2 text-sm">
                                            <Play className="w-4 h-4" />
                                            Lancer le Live (Go Live)
                                        </button>
                                    </form>
                                )}
                                {live.status === 'en_cours' && (
                                    <form action={updateLiveStatus.bind(null, live.id, 'terminé', undefined)}>
                                        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold flex items-center gap-2 text-sm">
                                            <StopCircle className="w-4 h-4" />
                                            Arrêter
                                        </button>
                                    </form>
                                )}
                                {live.status === 'terminé' && live.platform !== 'vimeo' && (
                                    <Link href={`${basePath}/lives/${live.id}/replay`} className="px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 rounded-lg font-bold text-sm">
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
                        <div className="text-center text-gray-500 py-12 bg-white/5 rounded-2xl">
                            Aucun live programmé pour l'espace <span className="font-bold">{audience === 'adults' ? 'Adulte' : 'Enfant'}</span>.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
