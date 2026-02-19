import Link from "next/link";
import Image from "next/image";
import { Bell, ArrowRight, FileText, Video, Sparkles, Lightbulb, Dices, Wand2, ShoppingBag } from "lucide-react";

type NewsItem = {
    id: string;
    type: string;
    title: string;
    thumbnail_url?: string;
    week_number?: number;
    url?: string; // For custom links
    is_main?: boolean;
};

export default function KidsNewsFeed({ items }: { items: NewsItem[] }) {
    return (
        <section>
            <h3 className="text-lg font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <Bell className="w-5 h-5 text-brand-gold" />
                Les Nouveautés de la semaine
            </h3>

            <div className="space-y-4">
                {items.length > 0 ? (
                    items.map(item => {
                        // Determine Link href based on type
                        let href = `/kids/courses`;
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
                                <div className="bg-brand-card/50 border border-brand-border rounded-xl p-4 flex items-center gap-4 hover:bg-brand-surface transition-all hover:border-brand-purple/30 group-hover:translate-x-1 duration-300">
                                    {/* Thumbnail / Icon */}
                                    <div className="w-16 h-16 bg-black rounded-lg shrink-0 overflow-hidden relative border border-white/5">
                                        {item.thumbnail_url ? (
                                            <Image src={item.thumbnail_url} alt="" fill className="object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-brand-surface">
                                                {item.type === 'pdf' && <FileText className="w-6 h-6 text-brand-text-muted" />}
                                                {item.type === 'trick' && <Wand2 className="w-6 h-6 text-brand-text-muted" />}
                                                {item.type === 'illusion' && <Sparkles className="w-6 h-6 text-brand-text-muted" />}
                                                {item.type === 'tips' && <Lightbulb className="w-6 h-6 text-brand-gold" />}
                                                {item.type === 'game' && <Dices className="w-6 h-6 text-brand-text-muted" />}
                                                {item.type === 'product' && <ShoppingBag className="w-6 h-6 text-brand-purple" />}
                                                {item.type === 'custom_link' && <ArrowRight className="w-6 h-6 text-brand-text-muted" />}
                                                {!['pdf', 'trick', 'illusion', 'tips', 'game', 'product', 'custom_link'].includes(item.type || '') && <Video className="w-6 h-6 text-brand-text-muted" />}
                                            </div>
                                        )}
                                        <div className="absolute top-1 right-1 bg-brand-blue text-[8px] font-bold px-1.5 py-0.5 rounded text-brand-bg uppercase shadow-sm">New</div>
                                    </div>

                                    {/* Info */}
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-brand-purple transition-colors line-clamp-1">{item.title}</h4>
                                        <p className="text-xs text-brand-text-muted mt-1 flex items-center gap-2">
                                            {item.week_number ? (
                                                <>
                                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                                                    Ajouté à ton espace Semaine {item.week_number}
                                                </>
                                            ) : (
                                                <span className="uppercase text-[10px] tracking-widest opacity-70">
                                                    {item.type === 'tip' ? 'Conseil du jour' : item.type === 'product' ? 'Boutique' : 'Lien externe'}
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <div className="ml-auto opacity-50 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-4 h-4 text-brand-text-muted group-hover:text-white transition-colors transform group-hover:translate-x-1 duration-300" />
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className="text-brand-text-muted text-sm italic bg-brand-card/30 p-4 rounded-xl border border-dashed border-white/10 text-center">
                        Pas de nouveautés pour le moment.
                    </div>
                )}
            </div>
        </section>
    );
}
