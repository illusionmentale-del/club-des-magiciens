import Link from "next/link";
import Image from "next/image";
import { Play, Sparkles } from "lucide-react";

type LibraryItem = {
    id: string;
    title: string;
    description?: string;
    thumbnail_url?: string;
    week_number: number;
};

export default function KidsHomeHero({
    item,
    overrideImage,
    overrideHook
}: {
    item: LibraryItem | undefined,
    overrideImage?: string,
    overrideHook?: string
}) {
    if (!item) {
        return (
            <div className="relative bg-brand-card border border-brand-purple/50 rounded-2xl overflow-hidden shadow-2xl p-12 text-center">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-3xl opacity-30 blur-lg pointer-events-none"></div>
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2">Patience...</h3>
                    <p className="text-brand-text-muted">Ton prochain tour de magie arrive bientôt !</p>
                </div>
            </div>
        );
    }

    const title = item.title;
    const description = item.description;
    const thumbnail = overrideImage || item.thumbnail_url;
    const hook = overrideHook || `Semaine ${item.week_number}`;

    return (
        <section id="atelier" className="relative group scroll-mt-24">
            {/* Animated Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-3xl opacity-30 blur-lg group-hover:opacity-50 transition duration-1000"></div>

            <div className="relative bg-brand-card border border-brand-purple/50 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                {/* Thumbnail Side */}
                <div className="md:w-3/5 relative aspect-video md:aspect-auto bg-black group-hover:scale-[1.01] transition-transform duration-500">
                    {thumbnail ? (
                        <Image src={thumbnail} alt={title} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand-surface">
                            <Play className="w-16 h-16 text-white/20" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                        <span className="bg-brand-purple text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg animate-bounce-slow flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            🎬 Nouveau contenu dispo | À toi de jouer !
                        </span>
                    </div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                            <Play className="w-6 h-6 text-white fill-current ml-1" />
                        </div>
                    </div>
                </div>

                {/* Content Side */}
                <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-brand-card to-brand-bg relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/20 blur-3xl rounded-full pointer-events-none"></div>

                    <div className="mb-auto relative z-10">
                        <div className="text-brand-purple text-xs font-bold uppercase tracking-widest mb-2">
                            {hook}
                        </div>
                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase leading-tight mb-4">
                            {title}
                        </h2>
                        <p className="text-brand-text-muted text-sm line-clamp-3 leading-relaxed">
                            {description}
                        </p>
                    </div>

                    <div className="mt-8 relative z-10">
                        <Link
                            href={`/watch/${item.id}`}
                            className="block w-full text-center bg-brand-purple hover:bg-brand-purple/90 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-brand-purple/20 uppercase tracking-wider text-sm hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Découvrir la nouvelle vidéo
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
