"use client";

import { useEffect, useState, useTransition } from "react";
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
    const [optimisticStatus, setOptimisticStatus] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const basePath = pathname.includes('/kids/') ? '/admin/kids' : (pathname.includes('/adults/') ? '/admin/adults' : '/admin');

    useEffect(() => {
        const fetchLive = async () => {
            const supabase = createClient();
            const { data } = await supabase.from("lives").select("*").eq("id", id).single();
            setLive(data);
            setOptimisticStatus(data?.status || null);
            setLoading(false);
        };
        fetchLive();
    }, [id]);

    const handleUpdateStatus = (newStatus: string) => {
        setOptimisticStatus(newStatus);
        startTransition(async () => {
            await updateLiveStatus(live.id, newStatus);
        });
    };

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
                <div className="flex-1 bg-black/90 relative flex flex-col p-6 overflow-y-auto">

                    <div className="flex flex-col lg:flex-row gap-6 mb-8">
                        {/* Monitor Iframe */}
                        <div className="flex-1 bg-black rounded-2xl border border-white/10 overflow-hidden relative shadow-2xl min-h-[300px]">
                            <div className="absolute top-2 left-2 z-10 bg-black/60 px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border border-white/10 flex items-center gap-2 backdrop-blur-sm">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> Monitor (Muet)
                            </div>
                            <iframe
                                src={`https://meet.jit.si/${roomName}#config.prejoinPageEnabled=false&config.startWithAudioMuted=true&config.startWithVideoMuted=true&userInfo.displayName=Monitor`}
                                className="w-full h-full border-0 absolute inset-0 pointer-events-none"
                            // pointer-events-none prevents the admin from accidentally interacting with the monitor iframe
                            ></iframe>
                        </div>

                        {/* Status Control Panel */}
                        <div className="w-full lg:w-80 bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-center">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">État de la Diffusion</h3>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-sm font-bold">Statut Actuel :</span>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${optimisticStatus === 'en_cours' ? 'bg-red-500 text-white animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]' :
                                    optimisticStatus === 'programmé' ? 'bg-gray-500/20 text-gray-300 border border-white/10' :
                                        'bg-gray-800 text-gray-500'
                                    }`}>
                                    {optimisticStatus === 'en_cours' ? 'EN DIRECT' : optimisticStatus === 'programmé' ? 'EN ATTENTE' : 'TERMINÉ'}
                                </span>
                            </div>

                            <div className="flex flex-col gap-3">
                                {optimisticStatus === 'programmé' && (
                                    <button
                                        onClick={() => handleUpdateStatus('en_cours')}
                                        disabled={isPending}
                                        className="w-full py-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-xl font-black uppercase text-sm flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-[0_0_30px_rgba(220,38,38,0.4)]"
                                    >
                                        <Play className="w-5 h-5" />
                                        {isPending ? "Lancement..." : "Lancer aux Élèves"}
                                    </button>
                                )}

                                {optimisticStatus === 'en_cours' && (
                                    <button
                                        onClick={() => handleUpdateStatus('terminé')}
                                        disabled={isPending}
                                        className="w-full py-4 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-xl font-bold uppercase text-sm flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <StopCircle className="w-4 h-4" />
                                        {isPending ? "Arrêt..." : "Arrêter la Diffusion"}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-900/10 border border-blue-500/20 p-6 rounded-2xl text-center">
                        <div className="mb-4 animate-bounce">
                            <Video className="w-12 h-12 text-blue-400 mx-auto" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Caméra Administrateur</h2>
                        <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
                            Pour éviter les limitations Jitsi, votre caméra doit s'ouvrir dans un onglet dédié sécurisé.
                        </p>

                        <a
                            href={`https://meet.jit.si/${roomName}?userInfo.displayName=MaitreDuClub`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm items-center gap-3 transition-transform hover:scale-105 shadow-xl shadow-blue-900/20"
                        >
                            <Video className="w-5 h-5" />
                            OUVRIR MON ONGLET CAMÉRA
                        </a>
                        <p className="mt-4 text-[10px] text-gray-500">Connectez-vous à Jitsi comme Modérateur si demandé.</p>
                    </div>

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
