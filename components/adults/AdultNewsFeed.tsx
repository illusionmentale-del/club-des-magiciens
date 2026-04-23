import Link from "next/link";
import Image from "next/image";
import { Bell, ArrowRight, Video, FileText, ShoppingBag, Sparkles } from "lucide-react";

type NewsItem = {
    id: string;
    type: string;
    title: string;
    thumbnail_url?: string;
    created_at?: string;
    url?: string; // For custom links
};

export default function AdultNewsFeed({ items }: { items: NewsItem[] }) {
    return (
        <section>
            <h3 className="text-xl font-serif font-bold flex items-center gap-3 text-white uppercase tracking-wider mb-6">
                <Bell className="w-5 h-5 text-magic-royal" />
                Dernières Nouveautés
            </h3>

            <div className="space-y-4">
                {items.length > 0 ? (
                    items.map(item => {
                        let href = `/dashboard/catalog`;
                        if (item.type === 'course' || !item.type) href = `/watch/${item.id}`;
                        if (item.type === 'custom_link' && item.url) href = item.url;
                        if (item.type === 'product' && item.url) href = item.url;

                        const isExternal = item.type === 'custom_link' || item.type === 'product';

                        return (
                            <Link
                                key={item.id}
                                href={href}
                                target={isExternal ? "_blank" : "_self"}
                                className="group block"
                            >
                                <div className="bg-transparent border-b border-white/10 p-4 flex items-center gap-4 hover:bg-white/[0.02] transition-all group-hover:translate-x-1 duration-300 relative overflow-hidden">
                                    {/* Thumbnail / Icon */}
                                    <div className="w-16 h-16 bg-black rounded-sm shrink-0 overflow-hidden relative border border-white/10 group-hover:border-magic-royal/30 transition-colors">
                                        {item.thumbnail_url ? (
                                            <Image src={item.thumbnail_url} alt="" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#111] to-black">
                                                {item.type === 'pdf' ? <FileText className="w-6 h-6 text-slate-500" /> :
                                                    item.type === 'product' ? <ShoppingBag className="w-6 h-6 text-magic-royal" /> :
                                                        item.type === 'custom_link' ? <ArrowRight className="w-6 h-6 text-slate-500" /> :
                                                            <Video className="w-6 h-6 text-slate-500" />}
                                            </div>
                                        )}
                                        <div className="absolute top-1 right-1 bg-gradient-to-r from-magic-royal to-amber-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded uppercase shadow-[0_0_10px_rgba(255,215,0,0.5)]">New</div>
                                    </div>

                                    {/* Info */}
                                    <div className="relative z-10 flex-1">
                                        <h4 className="font-serif font-bold text-white group-hover:text-magic-royal transition-all duration-300 line-clamp-1 text-sm md:text-base uppercase tracking-wide">{item.title}</h4>
                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-light">
                                            {item.created_at ? (
                                                <>
                                                    <span className="inline-block w-1 h-1 rounded-full bg-magic-royal/50"></span>
                                                    Ajouté le {new Date(item.created_at).toLocaleDateString('fr-FR')}
                                                </>
                                            ) : (
                                                <span className="uppercase text-[10px] tracking-widest opacity-70">
                                                    {item.type === 'product' ? 'Boutique' : 'Lien externe'}
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <div className="ml-auto opacity-50 group-hover:opacity-100 transition-opacity relative z-10">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-magic-royal/10 border border-transparent group-hover:border-magic-royal/20 transition-all">
                                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-magic-royal transition-colors transform group-hover:translate-x-0.5 duration-300" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className="text-slate-500 text-sm font-light bg-transparent p-6 border-y border-dashed border-white/10 text-center">
                        Aucune nouveauté à afficher pour le moment.
                    </div>
                )}
            </div>
        </section>
    );
}
