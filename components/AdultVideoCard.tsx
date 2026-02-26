import Link from 'next/link';
import Image from 'next/image';
import { Play, Lock } from 'lucide-react';

interface AdultVideoCardProps {
    id: string;
    title: string;
    thumbnailUrl: string;
    description?: string;
    date?: string;
    durationSeconds?: number;
    href: string;
    isUnlocked: boolean;
    priceLabel?: string;
}

export default function AdultVideoCard({
    id,
    title,
    thumbnailUrl,
    description,
    date,
    durationSeconds,
    href,
    isUnlocked,
    priceLabel
}: AdultVideoCardProps) {
    // Format duration from seconds to MM:SS or HH:MM:SS
    const formatDuration = (seconds?: number) => {
        if (!seconds) return null;
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Format date (e.g. "12 oct. 2023")
    const formatDate = (dateString?: string) => {
        if (!dateString) return null;
        try {
            return new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            }).format(new Date(dateString));
        } catch {
            return dateString;
        }
    };

    return (
        <div className="relative group/box h-full flex flex-col">
            <div className={`absolute -inset-1 rounded-3xl opacity-0 blur-lg transition duration-1000 pointer-events-none ${isUnlocked ? 'bg-gradient-to-r from-magic-gold to-orange-500 group-hover/box:opacity-20' : ''}`}></div>
            <Link
                href={href}
                className={`relative group flex flex-col bg-magic-card border rounded-3xl overflow-hidden transition-all flex-1 z-10 ${isUnlocked ? 'border-white/5 hover:border-magic-gold/50' : 'border-white/5 opacity-80 hover:opacity-100'}`}
            >
                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                    <Image
                        src={thumbnailUrl || '/placeholder-course.jpg'}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Image Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Duration Badge */}
                    {durationSeconds && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md backdrop-blur-sm z-20">
                            {formatDuration(durationSeconds)}
                        </div>
                    )}

                    {!isUnlocked && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/90 text-white text-xs font-bold rounded-md backdrop-blur-sm z-20 uppercase tracking-widest flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Verrouillé
                        </div>
                    )}

                    {/* Center Overlay Icon */}
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                        {isUnlocked ? (
                            <div className="w-14 h-14 rounded-full bg-magic-gold/90 text-black flex items-center justify-center shadow-[0_0_30px_rgba(238,195,67,0.4)] opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300">
                                <Play className="w-6 h-6 ml-1" />
                            </div>
                        ) : (
                            <div className="w-14 h-14 rounded-full bg-black/60 border border-white/10 text-white/50 flex items-center justify-center backdrop-blur-sm group-hover:bg-red-500/20 group-hover:text-red-400 group-hover:border-red-500/50 transition-all duration-300">
                                <Lock className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                    <h3 className={`font-bold line-clamp-2 text-base leading-snug transition-colors mb-2 ${isUnlocked ? 'text-white group-hover:text-magic-gold' : 'text-slate-300 group-hover:text-white'}`}>
                        {title}
                    </h3>

                    {description && (
                        <p className="text-xs text-slate-400 line-clamp-2 mb-4 font-light">
                            {description}
                        </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium">
                        {date ? (
                            <span className="text-slate-500">{formatDate(date)}</span>
                        ) : (
                            <span className="text-slate-500 uppercase tracking-wider text-[10px]">Masterclass</span>
                        )}

                        <span className={`flex items-center gap-1.5 transition-colors uppercase tracking-wider text-[10px] font-bold ${isUnlocked ? 'text-magic-gold' : 'text-red-400 group-hover:text-red-300'}`}>
                            {isUnlocked ? "Visionner" : (priceLabel || "Découvrir")}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
