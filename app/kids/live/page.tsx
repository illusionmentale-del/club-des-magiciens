"use client";

import { useEffect, useState } from "react";
import { Video, Maximize, Play, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import LiveChat from "@/components/LiveChat";

export default function KidsLivePage() {
    const [live, setLive] = useState<any>(null);
    const [isJoined, setIsJoined] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const fetchLiveContent = async () => {
            const { data } = await supabase
                .from('lives')
                .select('*')
                .in('audience', ['kids', 'tous']) // Audience filter
                .or(`status.eq.en_cours,status.eq.programmé`)
                .order('start_date', { ascending: true }) // Get next one
                .limit(1);

            if (data && data.length > 0) {
                setLive(data[0]);
            }
        };

        fetchLiveContent();

        // Subscribe to changes
        const channel = supabase
            .channel('public:lives')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'lives' }, fetchLiveContent)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    if (isJoined && live) {
        return (
            <div className="w-full h-[calc(100dvh-6rem)] bg-black rounded-3xl overflow-hidden shadow-2xl relative mt-4 flex flex-col lg:flex-row">
                <div className="relative w-full lg:flex-1 h-[45vh] lg:h-auto flex-shrink-0">
                    {live.platform === 'vimeo' ? (
                        <iframe
                            src={`https://player.vimeo.com/video/${live.platform_id}?autoplay=1&title=0&byline=0&portrait=0`}
                            className="w-full h-full border-0 absolute inset-0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <iframe
                            src={`https://meet.jit.si/${live.platform_id}?userInfo.displayName=Eleve#config.prejoinPageEnabled=false&config.deeplinking.disabled=true&config.startWithAudioMuted=true&config.startWithVideoMuted=true&config.disableInitialGUM=true&config.toolbarButtons=%5B%22fullscreen%22%2C%22hangup%22%5D&config.channelLastN=1&config.disableTileView=true`}
                            allow="camera; microphone; fullscreen; display-capture; autoplay"
                            className="w-full h-full border-0 absolute inset-0"
                        ></iframe>
                    )}
                    <button
                        onClick={() => setIsJoined(false)}
                        className="absolute top-4 left-4 px-4 py-2 bg-brand-error hover:bg-red-600 text-white text-sm font-bold rounded-xl shadow-md transition-colors z-50"
                    >
                        Sortir du Live
                    </button>
                </div>
                {/* Kids Chat */}
                <div className="w-full lg:w-80 flex-1 lg:flex-none bg-white border-t lg:border-t-0 lg:border-l border-purple-100 flex flex-col min-h-0">
                    <LiveChat liveId={live.id} isKids={true} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans selection:bg-brand-purple/30 overflow-hidden relative">
            {/* Ambient Background Lights (Homogenized with Home) */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* Header (Homogenized with Home) */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-brand-gold mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse text-brand-gold" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Les <span className="text-brand-purple">Masterclass</span>
                        </h1>
                        <p className="text-brand-text-muted mt-2 text-lg">
                            Rejoignez les magiciens en direct du QG.
                        </p>
                    </div>
                </header>

                {live ? (
                    <div className="relative group/box">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-error rounded-3xl opacity-0 blur-lg group-hover/box:opacity-40 transition duration-1000 pointer-events-none"></div>
                        <div className="bg-brand-card p-8 md:p-12 border border-brand-border relative overflow-hidden group hover:border-brand-error/20 transition-all">
                            {/* Tech Corners */}
                            <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-brand-border group-hover:border-brand-error/50 transition-colors"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-brand-border group-hover:border-brand-error/50 transition-colors"></div>

                            <h2 className="text-3xl font-bold mb-4 text-brand-text uppercase tracking-tight">{live.title}</h2>

                            <div className="flex items-center gap-4 mb-8">
                                <div className={`px-3 py-1 rounded border text-xs font-mono uppercase tracking-widest ${live.status === 'en_cours' ? 'bg-brand-error/10 border-brand-error/50 text-brand-error' : 'bg-brand-surface border-brand-border text-brand-text-muted'}`}>
                                    {live.status === 'en_cours' ? '● SIGNAL_DETECTED' : '● WAITING_SIGNAL'}
                                </div>
                                <div className="text-brand-text-muted text-sm font-mono">
                                    {live.status === 'en_cours' ? "C'est parti ! Le magicien t'attend !" : `Prochain rendez-vous : ${new Date(live.start_date).toLocaleString()}`}
                                </div>
                            </div>

                            {live.status === 'en_cours' ? (
                                <button
                                    onClick={() => setIsJoined(true)}
                                    className="w-full py-6 bg-brand-error hover:bg-red-500 text-white font-bold text-xl uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] flex items-center justify-center gap-4 group/btn relative overflow-hidden border border-red-400"
                                >
                                    <span className="relative z-10 flex items-center gap-2"><Play className="w-6 h-6 fill-current" /> INITIALISER LA CONNEXION</span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full duration-700 transition-transform"></div>
                                </button>
                            ) : (
                                <div className="bg-black/40 border border-brand-border p-6 text-brand-text-muted font-mono text-sm uppercase tracking-widest flex items-center justify-center gap-4">
                                    <Maximize className="w-5 h-5" />
                                // STANDBY MODE - WAITING FOR START //
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="relative group/box">
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-3xl opacity-0 blur-lg group-hover/box:opacity-30 transition duration-1000 pointer-events-none"></div>
                        <div className="relative flex flex-col items-center justify-center py-32 border border-dashed border-brand-border bg-brand-card/50 rounded-3xl">
                            <div className="w-24 h-24 bg-brand-card border border-brand-border rounded-full flex items-center justify-center mb-6 opacity-50">
                                <Video className="w-10 h-10 text-brand-text-muted" />
                            </div>
                            <h3 className="text-2xl font-bold text-brand-text mb-2 uppercase tracking-widest">Aucun Signal</h3>
                            <p className="text-brand-text-muted font-mono text-sm uppercase tracking-wider">Aucun live programmé pour le moment.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
