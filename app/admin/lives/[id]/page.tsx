"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Users, Lock, Mic, Video } from "lucide-react";
import { useParams } from "next/navigation";
import LiveChat from "@/components/LiveChat";

export default function LiveControlRoom() {
    const { id } = useParams();
    const [live, setLive] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
        <div className="min-h-screen bg-black text-white flex flex-col">
            {/* Header */}
            <header className="bg-white/5 border-b border-white/10 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/lives" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
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
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-xl flex items-center gap-3 transition-transform hover:scale-105 shadow-xl shadow-blue-900/20"
                    >
                        <Video className="w-6 h-6" />
                        OUVRIR LA SALLE JITSI (ADMIN)
                    </a>

                    <p className="mt-6 text-xs text-gray-500">
                        Une fois ouverte : Connectez-vous en tant qu'hôte (Log-in) si demandé.
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
