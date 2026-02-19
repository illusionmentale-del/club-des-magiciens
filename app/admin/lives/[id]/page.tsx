"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Users, Lock, Mic, Video, Play, StopCircle } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import LiveChat from "@/components/LiveChat";
import { updateLiveStatus } from "@/app/admin/actions";

export default function LiveControlRoom() {
    const { id } = useParams();
    const pathname = usePathname();
    const [live, setLive] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const basePath = pathname.includes('/kids/') ? '/admin/kids' : (pathname.includes('/adults/') ? '/admin/adults' : '/admin');

    useEffect(() => {
        const fetchLive = async () => {
            const supabase = createClient();
            const { data } = await supabase.from("lives").select("*").eq("id", id).single();
            setLive(data);
            setLoading(false);
        };
        fetchLive();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Chargement...</div>;
    if (!live) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Live introuvable</div>;

    const roomName = live.platform_id; // e.g. "ClubMagie-Secret-123"

    return (
        <div className="flex-1 w-full text-white flex flex-col h-screen md:h-auto md:min-h-[calc(100vh-80px)]">
            {/* Header */}
            <header className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href={`${basePath}/lives`} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="font-bold text-lg">{live.title}</h1>
                        <span className="text-xs text-red-500 font-mono uppercase tracking-widest flex items-center gap-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            Salle de Contrôle
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 bg-blue-900/20 border border-blue-500/20 px-4 py-2 rounded-lg">
                    <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-blue-400" />
                        <strong>Modérateur :</strong> Connectez-vous dans Jitsi pour gérer la salle.
                    </span>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Jitsi Embed */}
                {/* Jitsi External Link (Bypass 5min limit) */}
                <div className="flex-1 bg-black/90 relative flex flex-col items-center justify-center p-8 text-center">
                    <div className="mb-6 animate-bounce">
                        <Video className="w-16 h-16 text-magic-gold mx-auto mb-4" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">La salle est prête !</h2>
                    <p className="text-gray-400 mb-8 max-w-md mx-auto">
                        Pour éviter les limitations de durée (coupure à 5 min), la réunion doit s'ouvrir dans une fenêtre dédiée sécurisée.
                    </p>

                    <a
                        href={`https://meet.jit.si/${roomName}?userInfo.displayName=MaitreDuClub`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-xl flex items-center gap-3 transition-transform hover:scale-105 shadow-xl shadow-blue-900/20 mb-12"
                    >
                        <Video className="w-6 h-6" />
                        OUVRIR LA SALLE JITSI (ADMIN)
                    </a>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl max-w-lg w-full">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">État de la Diffusion</h3>
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-lg font-bold">Statut Actuel :</span>
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${live.status === 'en_cours' ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
                                    live.status === 'programmé' ? 'bg-gray-500/20 text-gray-300 border border-white/10' :
                                        'bg-gray-800 text-gray-500'
                                }`}>
                                {live.status === 'en_cours' ? 'EN DIRECT' : live.status === 'programmé' ? 'EN ATTENTE' : 'TERMINÉ'}
                            </span>
                        </div>

                        <div className="flex flex-col gap-3">
                            {live.status === 'programmé' && (
                                <form action={updateLiveStatus.bind(null, live.id, 'en_cours', undefined)}>
                                    <button className="w-full px-6 py-4 bg-red-600 hover:bg-red-500 rounded-xl font-black uppercase text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                                        <Play className="w-6 h-6" />
                                        LANCER LE LIVE AUX ÉLÈVES
                                    </button>
                                    <p className="text-xs text-gray-400 mt-2 text-center">Ceci débloquera le bouton "Rejoindre" sur la page d'accueil des élèves.</p>
                                </form>
                            )}

                            {live.status === 'en_cours' && (
                                <form action={updateLiveStatus.bind(null, live.id, 'terminé', undefined)}>
                                    <button className="w-full px-6 py-4 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold uppercase flex items-center justify-center gap-2 transition-colors">
                                        <StopCircle className="w-5 h-5" />
                                        ARRÊTER LA DIFFUSION
                                    </button>
                                    <p className="text-xs text-gray-400 mt-2 text-center">Ceci clôturera le live pour tout le monde.</p>
                                </form>
                            )}
                        </div>
                    </div>

                    <p className="mt-6 text-xs text-gray-500">
                        Rappel : Connectez-vous en tant qu'hôte (Log-in) sur la fenêtre Jitsi pour autoriser les caméras/micros.
                    </p>
                </div>

                {/* Sidebar Controls (Chat & Quick Actions) */}
                <div className="w-96 bg-gray-900 border-l border-white/10 flex flex-col h-full z-10">
                    <div className="flex-1 overflow-hidden flex flex-col">
                        <LiveChat liveId={live.id} isAdmin={true} />
                    </div>

                    <div className="p-4 border-t border-white/10 bg-white/5 overflow-y-auto max-h-[200px]">
                        <h3 className="text-xs font-bold mb-3 flex items-center gap-2 text-gray-400 uppercase tracking-widest">
                            <Lock className="w-3 h-3" />
                            Mémo Admin
                        </h3>
                        <div className="space-y-3">
                            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                <h4 className="font-bold text-xs mb-1 text-blue-400">Moderateur Jitsi</h4>
                                <p className="text-[10px] text-gray-500">Connectez-vous via l'interface Jitsi (Avatar &gt; Auth) pour gérer la salle.</p>
                            </div>
                            <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                                <h4 className="font-bold text-xs mb-1 text-red-400">Enregistrement</h4>
                                <p className="text-[10px] text-gray-500">Utilisez l'option "Start Recording" (Dropbox requis) ou OBS.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
