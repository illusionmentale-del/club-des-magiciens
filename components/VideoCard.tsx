import Link from 'next/link';
import Image from 'next/image';
import { Play } from 'lucide-react';

interface VideoCardProps {
    id: string;
    title: string;
    thumbnailUrl: string;
    date: string;
    durationSeconds: number;
    href: string;
}

export default function VideoCard({ id, title, thumbnailUrl, date, durationSeconds, href }: VideoCardProps) {
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
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-3xl opacity-0 blur-lg group-hover/box:opacity-40 transition duration-1000 pointer-events-none"></div>
            <Link href={href} className="relative group flex flex-col bg-brand-card border border-white/5 rounded-3xl overflow-hidden hover:border-brand-purple/50 transition-all flex-1 z-10">
                <div className="relative aspect-video w-full overflow-hidden bg-black/40">
                    <Image
                        src={thumbnailUrl}
                        alt={title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Duration Badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded-md backdrop-blur-sm">
                        {formatDuration(durationSeconds)}
                    </div>

                    {/* Play Button Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-brand-purple text-white flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-6 h-6 ml-1" />
                        </div>
                    </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-white font-bold line-clamp-2 text-sm leading-snug group-hover:text-brand-purple transition-colors">
                        {title}
                    </h3>
                    <div className="mt-auto pt-3 flex items-center text-xs text-brand-text-muted">
                        <span>{formatDate(date)}</span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
