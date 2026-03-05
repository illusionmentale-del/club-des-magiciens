import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface AdultVideoCardProps {
    id: string;
    title: string;
    thumbnailUrl: string;
    date: string;
    durationSeconds: number;
    href: string;
}

export default function AdultVideoCard({ id, title, thumbnailUrl, date, durationSeconds, href }: AdultVideoCardProps) {
    // Format duration from seconds to MM:SS or HH:MM:SS
    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);

        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // Format date (e.g. "12 oct. 2023")
    const formatDate = (dateString: string) => {
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
            <div className="absolute -inset-1 bg-gradient-to-r from-magic-gold to-orange-400 rounded-3xl opacity-0 blur-lg group-hover/box:opacity-40 transition duration-1000 pointer-events-none"></div>
            <Link href={href} className="relative group flex flex-col bg-[#111] border border-white/5 rounded-3xl overflow-hidden hover:border-magic-gold/50 transition-all flex-1 z-10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <div className="relative aspect-video w-full overflow-hidden bg-black/40 border-b border-white/5">
                    <Image
                        src={thumbnailUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                    />

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-bold rounded-md backdrop-blur-sm border border-white/10">
                        {formatDuration(durationSeconds)}
                    </div>

                    {/* Play Button Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-magic-gold text-black flex items-center justify-center shadow-[0_0_20px_rgba(238,195,67,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-6 h-6 ml-1" />
                        </div>
                    </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-white font-bold line-clamp-2 text-sm leading-snug group-hover:text-magic-gold transition-colors">
                        {title}
                    </h3>
                    <div className="mt-auto pt-4 flex items-center text-xs text-slate-400 uppercase tracking-widest font-bold">
                        <span>{formatDate(date)}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
