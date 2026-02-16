"use client";

import { useEffect, useState } from "react";
import { Video, Users, Mic, Maximize, Play, Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import LiveChat from "@/components/LiveChat";

export default function LivePage() {
    const [isJoined, setIsJoined] = useState(false);
    const [live, setLive] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [replays, setReplays] = useState<any[]>([]);

    useEffect(() => {
        const fetchLiveContent = async () => {
            const supabase = createClient();

            // 1. Fetch Active or Next Live (Adult audience)
            const { data: activeLive } = await supabase
                .from("lives")
                .select("*")
                .in('audience', ['adults', 'all'])
                .in('status', ['en_cours', 'programmé'])
                .order('status', { ascending: true }) // 'en_cours' comes before 'programmé'? Alphabetically yes (e < p). Perfect.
                .limit(1)
                .single();

            setLive(activeLive);

            // 2. Fetch Replays (Terminé + Vimeo ID)
            const { data: replayList } = await supabase
                .from("lives")
                .select("*")
                .in('audience', ['adults', 'all'])
                .eq('status', 'terminé')
                .not('platform_id', 'is', null) // Only valid replays
                .order('start_date', { ascending: false });

            setReplays(replayList || []);
            setLoading(false);
        };
        fetchLiveContent();
    }, []);

    if (loading) return <div className="min-h-screen bg-magic-bg flex items-center justify-center text-white">Chargement...</div>;

    // Active Live View
    if (isJoined && live) {
        return (
            <div className="w-full h-[100dvh] bg-black flex flex-col lg:flex-row overflow-hidden fixed inset-0 z-[100]">
                {/* Video Player Section */}
                <div className="w-full lg:flex-1 relative aspect-video lg:aspect-auto lg:h-full bg-black">
                    {live.platform === 'vimeo' ? (
                        <iframe
                            src={`https://player.vimeo.com/video/${live.platform_id}?autoplay=1&title=0&byline=0&portrait=0`}
                            className="w-full h-full border-0 absolute inset-0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <iframe
                            src={`https://meet.jit.si/${live.platform_id}#config.prejoinPageEnabled=false&userInfo.displayName=Membre`}
                            allow="camera; microphone; fullscreen; display-capture; autoplay"
                            className="w-full h-full border-0 absolute inset-0"
                        ></iframe>
                    )}
                    <button
                        onClick={() => setIsJoined(false)}
                        className="absolute top-4 left-4 px-3 py-1.5 md:px-4 md:py-2 bg-red-600/80 hover:bg-red-600 text-white text-xs md:text-sm font-bold rounded-lg backdrop-blur-md transition-colors z-50 shadow-lg"
                    >
                        Quitter
                    </button>
                </div>

                {/* Chat Section */}
                <div className="flex-1 lg:flex-none lg:w-[400px] w-full bg-gray-900 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col z-40 shadow-xl overflow-hidden">
                    <LiveChat liveId={live.id} isKids={false} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-magic-bg text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* ACTIVE / NEXT LIVE SECTION */}
                <section className="text-center space-y-8 mt-8">
                    <div className="mx-auto w-24 h-24 bg-magic-purple/20 rounded-full flex items-center justify-center border border-magic-purple/50 shadow-[0_0_50px_rgba(124,58,237,0.3)] animate-pulse">
                        <Video className="w-12 h-12 text-magic-purple" />
                    </div>

                    <h1 className="text-4xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-amber-200">
                        {live?.status === 'en_cours' ? '🔴 LIVE EN COURS !' : 'Salle de Visio Magique'}
                    </h1>

                    {live ? (
                        <div className="max-w-xl mx-auto bg-magic-card border border-magic-purple/30 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                            {live.status === 'en_cours' && (
                                <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl animate-pulse">
                                    EN DIRECT
                                </div>
                            )}
                            <h2 className="text-2xl font-bold mb-2">{live.title}</h2>
                            <p className="text-gray-400 mb-6 flex items-center justify-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {new Date(live.start_date).toLocaleString()}
                            </p>

                            {live.status === 'en_cours' ? (
                                <button
                                    onClick={() => setIsJoined(true)}
                                    className="w-full px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold text-lg rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.6)] transform hover:scale-105 flex items-center justify-center gap-2"
                                >
                                    <Play className="w-5 h-5 fill-current" />
                                    REJOINDRE LE LIVE ({live.platform === 'vimeo' ? 'Diffusion' : 'Intéractif'})
                                </button>
                            ) : (
                                <div className="bg-white/5 rounded-xl p-4 text-gray-300">
                                    Le prochain live n'a pas encore commencé. <br />
                                    <span className="text-sm text-gray-500">Revenez à l'heure indiquée !</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-gray-400 text-lg">
                            Aucun live programmé pour le moment. Regardez les replays ci-dessous ! 👇
                        </p>
                    )}
                </section>

                {/* REPLAYS SECTION */}
                {replays.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                            <Video className="w-6 h-6 text-gray-400" />
                            Derniers Replays
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {replays.map((replay) => (
                                <div key={replay.id} className="bg-magic-card border border-white/10 rounded-xl overflow-hidden group hover:border-magic-purple/50 transition-all">
                                    <div className="aspect-video bg-black relative">
                                        <iframe
                                            src={`https://player.vimeo.com/video/${replay.platform_id}?title=0&byline=0&portrait=0`}
                                            className="w-full h-full"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-lg mb-1 group-hover:text-magic-purple transition-colors">{replay.title}</h3>
                                        <p className="text-xs text-gray-500">{new Date(replay.start_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
