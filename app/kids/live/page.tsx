"use client";

import { useEffect, useState } from "react";
import { Video, Users, Mic, Maximize, Play } from "lucide-react";
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
                <div className="relative w-full lg:flex-1 h-[30vh] lg:h-auto">
                    {live.platform === 'vimeo' ? (
                        <iframe
                            src={`https://player.vimeo.com/video/${live.platform_id}?autoplay=1&title=0&byline=0&portrait=0`}
                            className="w-full h-full border-0 absolute inset-0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    ) : (
                        <iframe
                            src={`https://meet.jit.si/${live.platform_id}#config.prejoinPageEnabled=false&config.disableDeepLinking=true`}
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
                <div className="w-full lg:w-80 h-[60vh] lg:h-auto bg-white border-t lg:border-t-0 lg:border-l border-purple-100 flex flex-col">
                    <LiveChat liveId={live.id} isKids={true} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans selection:bg-brand-purple/30 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-brand-purple/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Header / Hero - MATCHING DASHBOARD STYLE STRICTLY */}
            <header className="mb-16 max-w-7xl mx-auto relative z-10 pt-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-1 bg-brand-error animate-pulse"></div>
                            <span className="text-brand-error text-xs font-bold tracking-[0.2em] uppercase">Salle de Diffusion</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-brand-text uppercase tracking-tight leading-none mb-2">
                            Transmission<br />Magique
                        </h1>
                        <p className="text-xl text-brand-text-muted font-light flex items-center gap-2">
                            Rejoignez les magiciens en direct du QG.
                        </p>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto relative z-10">
                {live ? (
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
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-brand-border bg-brand-card/50 rounded-3xl">
                        <div className="w-24 h-24 bg-brand-card border border-brand-border rounded-full flex items-center justify-center mb-6 opacity-50">
                            <Video className="w-10 h-10 text-brand-text-muted" />
                        </div>
                        <h3 className="text-2xl font-bold text-brand-text mb-2 uppercase tracking-widest">Aucun Signal</h3>
                        <p className="text-brand-text-muted font-mono text-sm uppercase tracking-wider">Aucun live programmé pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
