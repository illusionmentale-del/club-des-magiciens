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
            <h3 className="text-xl font-bold flex items-center gap-3 text-white uppercase tracking-wider mb-6">
                <Bell className="w-5 h-5 text-magic-gold" />
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
                                <div className="bg-[#111] border border-white/5 rounded-xl p-4 flex items-center gap-4 hover:bg-[#1a1a1f] transition-all hover:border-magic-gold/30 group-hover:translate-x-1 duration-300 shadow-sm">
                                    {/* Thumbnail / Icon */}
                                    <div className="w-16 h-16 bg-black rounded-lg shrink-0 overflow-hidden relative border border-white/5">
                                        {item.thumbnail_url ? (
                                            <Image src={item.thumbnail_url} alt="" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
                                                {item.type === 'pdf' ? <FileText className="w-6 h-6 text-slate-500" /> :
                                                    item.type === 'product' ? <ShoppingBag className="w-6 h-6 text-magic-gold" /> :
                                                        item.type === 'custom_link' ? <ArrowRight className="w-6 h-6 text-slate-500" /> :
                                                            <Video className="w-6 h-6 text-slate-500" />}
                                            </div>
                                        )}
                                        <div className="absolute top-1 right-1 bg-magic-gold text-black text-[8px] font-bold px-1.5 py-0.5 rounded uppercase shadow-sm">New</div>
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-magic-gold transition-colors line-clamp-1 text-sm md:text-base">{item.title}</h4>
                                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-light">
                                            {item.created_at ? (
                                                <>
                                                    <span className="inline-block w-1 h-1 rounded-full bg-slate-600"></span>
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
                                    <div className="ml-auto opacity-50 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-magic-gold transition-colors transform group-hover:translate-x-1 duration-300" />
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className="text-slate-500 text-sm font-light bg-[#111] p-6 rounded-xl border border-dashed border-white/5 text-center">
                        Aucune nouveauté à afficher pour le moment.
                    </div>
                )}
            </div>
        </section>
    );
}
