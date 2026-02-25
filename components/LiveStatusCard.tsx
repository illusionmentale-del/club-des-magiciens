"use client";

import FlipClockCountdown from '@leenguyen/react-flip-clock-countdown';
import '@leenguyen/react-flip-clock-countdown/dist/index.css';
import { Video, Calendar, Sparkles } from "lucide-react";
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { toggleEventReminder } from '@/app/admin/actions';

// Props: live object from DB
export function LiveStatusCard({ live, href = "/kids/live", isReminded = false }: { live: any, href?: string, isReminded?: boolean }) {
    const [isClient, setIsClient] = useState(false);
    const [reminded, setReminded] = useState(isReminded);
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => setIsClient(true), []);

    const handleToggleReminder = async () => {
        setIsToggling(true);
        try {
            const res = await toggleEventReminder(live.id);
            if (res.success) {
                setReminded(res.isReminded);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsToggling(false);
        }
    };

    if (!live || live.status === 'terminé') {
        if (live?.status === 'terminé' && live.platform === 'vimeo') {
            return (
                <div className="relative w-full rounded-3xl overflow-hidden border border-brand-gold/20 bg-black/40 backdrop-blur-md p-6 lg:p-10 shadow-2xl group hover:border-brand-gold/40 transition-all">
                    <div className="text-[10px] text-brand-gold uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-brand-gold rounded-full shadow-[0_0_8px_#fbbf24]"></div> REPLAY DISPONIBLE
                    </div>
                    <h3 className="text-3xl font-black mb-6 text-white uppercase tracking-tight">{live.title}</h3>
                    <div className="aspect-video bg-black rounded-xl border border-white/10 relative overflow-hidden group-hover:border-white/20 transition-all shadow-2xl">
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
        return null; // hide if completely done and no replay
    }

    const isLiveNow = live.status === 'en_cours';
    const liveDate = new Date(live.start_date).getTime();

    return (
        <div className={`relative w-full rounded-3xl overflow-hidden border p-6 lg:p-10 shadow-2xl transition-all duration-700 group
            ${isLiveNow
                ? 'border-red-500/50 bg-gradient-to-br from-red-900/40 via-black/60 to-black rounded-3xl shadow-[0_0_50px_rgba(239,68,68,0.15)]'
                : 'border-brand-purple/30 bg-gradient-to-br from-brand-purple/20 via-black/60 to-black/90 shadow-[0_0_40px_rgba(168,85,247,0.1)]'
            }`}>

            {/* Ambient Background Glow */}
            <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] opacity-30 pointer-events-none transition-colors duration-700
                ${isLiveNow ? 'bg-red-600' : 'bg-brand-purple'}`}></div>
            <div className={`absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-[120px] opacity-20 pointer-events-none transition-colors duration-700
                ${isLiveNow ? 'bg-red-600' : 'bg-brand-purple'}`}></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">

                {/* Left Side: Info */}
                <div className="flex-1">
                    <div className="mb-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest
                            ${isLiveNow
                                ? 'bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] border border-red-500/30'
                                : 'bg-brand-purple/20 text-brand-purple border border-brand-purple/30'}`}>
                            {isLiveNow ? (
                                <><span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span> EN DIRECT</>
                            ) : (
                                <><Calendar className="w-4 h-4" /> BIENTÔT DISPONIBLE</>
                            )}
                        </span>
                    </div>

                    <h3 className="text-3xl lg:text-5xl font-black mb-3 text-white tracking-tight drop-shadow-lg">{live.title}</h3>

                    {!isLiveNow && (
                        <p className="text-gray-400 font-medium flex items-center gap-2 text-lg">
                            {new Date(live.start_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à {new Date(live.start_date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', 'h')}
                        </p>
                    )}
                </div>

                {/* Right Side: Action / Countdown */}
                <div className="w-full lg:w-auto">
                    {isLiveNow ? (
                        <div className="flex flex-col items-center lg:items-end gap-4">
                            <p className="text-red-200/80 text-sm font-medium animate-pulse tracking-wide">La salle temporelle est ouverte !</p>
                            <Link
                                href={href}
                                className="w-full lg:w-auto px-8 py-5 bg-gradient-to-r from-red-600 to-red-500 text-white font-black text-lg rounded-2xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(220,38,38,0.8)] hover:-translate-y-1 flex items-center justify-center gap-3 border border-red-400/50"
                            >
                                <Video className="w-6 h-6" />
                                {live.event_type === 'masterclass' ? "ACCÉDER À LA MASTERCLASS" : live.event_type === 'video' ? "ACCÉDER À LA VIDÉO" : "REJOINDRE L'ÉVÉNEMENT"}
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center lg:items-end gap-6 bg-black/40 p-6 lg:p-8 rounded-3xl border border-white/5 backdrop-blur-xl relative overflow-hidden group-hover:border-brand-purple/20 transition-colors shadow-inner shadow-white/5">
                            {/* Decorative sparkles */}
                            <Sparkles className="absolute top-4 right-4 w-5 h-5 text-brand-purple/40 animate-pulse" />

                            {isClient && (
                                <div className="scale-90 sm:scale-100 origin-center lg:origin-right">
                                    <FlipClockCountdown
                                        to={liveDate}
                                        labels={['JOURS', 'HEURES', 'MIN', 'SEC']}
                                        labelStyle={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: '#9ca3af', marginTop: '16px', letterSpacing: '0.1em' }}
                                        digitBlockStyle={{
                                            width: 50,
                                            height: 70,
                                            fontSize: 34,
                                            fontWeight: 900,
                                            backgroundColor: 'rgba(255,255,255,0.03)',
                                            color: 'white',
                                            borderRadius: '12px',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)'
                                        }}
                                        dividerStyle={{ color: 'rgba(255,255,255,0.05)', height: 1 }}
                                        separatorStyle={{ color: '#a855f7', size: 5 }}
                                        duration={0.5}
                                    />
                                </div>
                            )}

                            <div className="w-full text-center mt-2 flex flex-col md:flex-row items-center gap-4 justify-center">
                                <span className="inline-block px-5 py-2.5 rounded-full bg-brand-purple/10 text-brand-purple/80 text-xs font-bold tracking-widest uppercase border border-brand-purple/20">
                                    {live.event_type === 'masterclass' ? 'Prochaine Masterclass' : live.event_type === 'video' ? 'Prochaine Vidéo' : 'Rendez-vous très vite'}
                                </span>

                                <button
                                    onClick={handleToggleReminder}
                                    disabled={isToggling}
                                    className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2
                                        ${reminded
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30'
                                            : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'}
                                        ${isToggling ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                >
                                    {reminded ? (
                                        <>Alerte activée ✓</>
                                    ) : (
                                        <>🔔 Mettre une alerte</>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
