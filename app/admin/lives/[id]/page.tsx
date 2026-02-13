"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Users, Lock, Mic, Video } from "lucide-react";
import { useParams } from "next/navigation";

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

                {/* Sidebar Controls (Instructions for free workflow) */}
                <div className="w-80 bg-white/5 border-l border-white/10 p-6 overflow-y-auto hidden md:block">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-magic-gold" />
                        Commandes
                    </h3>

                    <div className="space-y-6">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <h4 className="font-bold mb-2 flex items-center gap-2 text-sm">
                                <Users className="w-4 h-4 text-blue-400" />
                                1. Devenir Modérateur
                            </h4>
                            <p className="text-gray-400 text-xs leading-relaxed mb-3">
                                Sur Jitsi gratuit, le premier arrivé est admin, ou vous devez vous authentifier.
                                Cliquez sur votre avatar dans la fenêtre vidéo &gt; "S'authentifier" si besoin.
                            </p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <h4 className="font-bold mb-2 flex items-center gap-2 text-sm">
                                <ShieldCheck className="w-4 h-4 text-green-400" />
                                2. Activer la Salle d'Attente
                            </h4>
                            <p className="text-gray-400 text-xs leading-relaxed">
                                Une fois modérateur, cliquez sur l'icône <strong>Bouclier (Sécutité)</strong> en bas de la vidéo, puis activez <strong>"Lobby Mode"</strong>.
                            </p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <h4 className="font-bold mb-2 flex items-center gap-2 text-sm">
                                <Mic className="w-4 h-4 text-red-400" />
                                3. Couper les micros
                            </h4>
                            <p className="text-gray-400 text-xs leading-relaxed">
                                Dans les options des participants (les 3 points sur un utilisateur), vous pouvez "Mute everyone" (Couper tous les micros).
                            </p>
                        </div>

                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <h4 className="font-bold mb-2 flex items-center gap-2 text-sm">
                                <Video className="w-4 h-4 text-pink-500" />
                                4. Enregistrement (Secret)
                            </h4>
                            <p className="text-gray-400 text-xs leading-relaxed mb-2">
                                Jitsi (gratuit) nécessite un compte <strong>Dropbox</strong> pour enregistrer.
                            </p>
                            <ol className="list-decimal list-inside text-gray-400 text-xs space-y-1">
                                <li>Cliquez sur les 3 points &gt; "Start Recording".</li>
                                <li>Liez votre compte Dropbox.</li>
                                <li>L'enregistrement file direct dans votre Dropbox.</li>
                                <li>Ensuite : Téléchargez-le et mettez-le sur Vimeo.</li>
                            </ol>
                            <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-[10px] text-red-300">
                                ⚠️ <strong>IMPORTANT :</strong> Seul le Modérateur peut lancer l'enregistrement interne. Les membres ne peuvent pas (bouton grisé). Par contre, impossible d'empêcher quelqu'un de filmer son écran (OBS, téléphone...).
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
