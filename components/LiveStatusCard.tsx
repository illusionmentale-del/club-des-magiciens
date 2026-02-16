"use client";

import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import { Video, Calendar, ArrowRight, Play, Radio } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from 'react';

// Props: live object from DB
export function LiveStatusCard({ live }: { live: any }) {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    if (!live || live.status === 'terminé') {
        if (live?.status === 'terminé' && live.platform === 'vimeo') {
            return (
                <div className="bg-[#0F1014] border border-white/5 p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all">
                    {/* Tech Corners */}
                    <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/10 group-hover:border-blue-500/50 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/10 group-hover:border-blue-500/50 transition-colors"></div>

                    <div className="text-[10px] text-blue-500 uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_#3b82f6]"></div> REPLAY DISPONIBLE
                    </div>
                    <h3 className="text-xl font-bold mb-6 text-white uppercase tracking-wide">{live.title}</h3>
                    <div className="aspect-video bg-black border border-white/10 relative overflow-hidden group-hover:border-white/20 transition-all">
                        <iframe
                            src={`https://player.vimeo.com/video/${live.platform_id}`}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            );
        }

        // No live
        return (
            <div className="bg-[#0F1014] border border-white/5 p-8 opacity-60 grayscale hover:grayscale-0 transition-all hover:opacity-100 hover:border-purple-500/20 group relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5"></div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2">Transmission</div>
                <h3 className="text-xl font-bold mb-2 text-white uppercase tracking-tight">Aucun Signal</h3>
                <p className="text-xs text-slate-500 font-mono">// WAITING_FOR_DATA ...</p>
            </div>
        );
    }

    const isLiveNow = live.status === 'en_cours';
    const liveDate = new Date(live.start_date).getTime();

    return (
        <div className={`bg-[#0F1014] border ${isLiveNow ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-white/5'} p-8 relative overflow-hidden transition-all duration-500 group`}>
            {/* Background Mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.01)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.01)_50%,rgba(255,255,255,0.01)_75%,transparent_75%,transparent)] bg-[size:24px_24px] pointer-events-none"></div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className={`text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 ${isLiveNow ? 'text-red-500 animate-pulse' : 'text-purple-500'}`}>
                    {isLiveNow ? (
                        <><Radio className="w-4 h-4 animate-ping absolute opacity-50" /><Radio className="w-4 h-4 relative" /> EN DIRECT</>
                    ) : (
                        <><Calendar className="w-4 h-4" /> PROCHAIN LIVE</>
                    )}
                </div>
            </div>

            <h3 className="text-2xl font-bold mb-2 text-white uppercase tracking-tight relative z-10">{live.title}</h3>

            {!isLiveNow && (
                <div className="flex items-center gap-2 text-sm text-slate-400 font-mono mb-8 relative z-10 border-l-2 border-purple-500/50 pl-3">
                    {new Date(live.start_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </div>
            )}

            {/* Content Switch */}
            <div className="relative z-10 mt-6">
                {isLiveNow ? (
                    <div className="space-y-6">
                        <p className="text-slate-300 text-sm font-light">Le salon est ouvert. Initialisation du lien...</p>
                        <a
                            href={`https://meet.jit.si/${live.platform_id}`}
                            target="_blank"
                            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center gap-3 group/btn relative overflow-hidden border border-red-400"
                        >
                            <span className="relative z-10 flex items-center gap-2"><Video className="w-4 h-4" /> Rejoindre</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full duration-700 transition-transform"></div>
                        </a>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Countdown */}
                        {isClient && (
                            <div className="flex justify-center py-2 grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                <FlipClockCountdown
                                    to={liveDate}
                                    labels={['JOURS', 'HEURES', 'MIN', 'SEC']}
                                    labelStyle={{ fontSize: 8, fontWeight: 700, textTransform: 'uppercase', color: '#94a3b8' }}
                                    digitBlockStyle={{ width: 25, height: 40, fontSize: 18, backgroundColor: '#1e293b', color: 'white' }}
                                    dividerStyle={{ color: '#0F1014', height: 1 }}
                                    separatorStyle={{ color: '#a855f7', size: 3 }}
                                    duration={0.5}
                                />
                            </div>
                        )}

                        <button disabled className="w-full py-3 bg-white/5 border border-white/5 text-slate-500 font-mono text-xs uppercase tracking-widest cursor-not-allowed flex items-center justify-center gap-2">
                             // STANDBY //
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
