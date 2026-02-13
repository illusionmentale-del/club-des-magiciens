"use client";

import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import { Video, Calendar, ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from 'react';

// Props: live object from DB
export function LiveStatusCard({ live }: { live: any }) {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => setIsClient(true), []);

    if (!live || live.status === 'terminé') {
        // Fallback or Replay if terminated and has vimeo?
        // If terminated and vimeo link is there, we show Replay.
        if (live?.status === 'terminé' && live.platform === 'vimeo') {
            return (
                <div className="bg-magic-card border border-white/10 p-6 rounded-3xl relative overflow-hidden group hover:border-blue-500/30 transition-colors">
                    <div className="text-xs text-blue-400 uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div> REPLAY DISPONIBLE
                    </div>
                    <h3 className="text-xl font-bold mb-4">{live.title}</h3>
                    <div className="aspect-video bg-black/50 rounded-xl overflow-hidden relative">
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
            <div className="bg-magic-card border border-white/10 p-6 rounded-3xl opacity-50 grayscale hover:grayscale-0 transition-all">
                <div className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Prochain Live</div>
                <h3 className="text-xl font-bold mb-4 text-gray-400">Aucun événement programmé</h3>
                <p className="text-sm text-gray-500">Restez à l'écoute pour les prochaines annonces.</p>
            </div>
        );
    }

    const isLiveNow = live.status === 'en_cours';
    const liveDate = new Date(live.start_date).getTime();

    return (
        <div className={`bg-magic-card border ${isLiveNow ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 'border-white/10'} p-6 rounded-3xl relative overflow-hidden transition-all duration-500`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className={`text-xs uppercase tracking-widest font-bold flex items-center gap-2 ${isLiveNow ? 'text-red-500 animate-pulse' : 'text-magic-purple'}`}>
                    {isLiveNow ? (
                        <><div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div> EN DIRECT</>
                    ) : (
                        <><Calendar className="w-3 h-3" /> PROCHAIN LIVE</>
                    )}
                </div>
            </div>

            <h3 className="text-2xl font-bold mb-2">{live.title}</h3>

            {!isLiveNow && (
                <div className="flex items-center gap-2 text-sm text-gray-400 font-bold mb-6">
                    {new Date(live.start_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                </div>
            )}

            {/* Content Switch */}
            {isLiveNow ? (
                <div className="space-y-4">
                    <p className="text-gray-300 text-sm">Le salon est ouvert ! Rejoignez les autres membres.</p>
                    <a
                        href={`https://meet.jit.si/${live.platform_id}`}
                        target="_blank"
                        className="w-full py-4 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-white transition-all shadow-lg shadow-red-900/20 flex items-center justify-center gap-2 animate-bounce-subtle"
                    >
                        <Video className="w-5 h-5" />
                        REJOINDRE LE SALON
                    </a>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Countdown */}
                    {isClient && (
                        <div className="flex justify-center py-4">
                            <FlipClockCountdown
                                to={liveDate}
                                labels={['JOURS', 'HEURES', 'MINUTES', 'SECONDES']}
                                labelStyle={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase' }}
                                digitBlockStyle={{ width: 30, height: 45, fontSize: 20 }}
                                dividerStyle={{ color: 'white', height: 1 }}
                                separatorStyle={{ color: 'red', size: 4 }}
                                duration={0.5}
                            />
                        </div>
                    )}

                    <button disabled className="w-full py-3 bg-white/5 border border-white/5 text-gray-400 rounded-xl font-bold cursor-not-allowed flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Bientôt disponible
                    </button>
                </div>
            )}
        </div>
    );
}
