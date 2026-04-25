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
            <h3 className="text-sm font-semibold text-[#86868b] uppercase tracking-widest mb-6 flex items-center gap-2">
                <Bell className="w-4 h-4 text-brand-gold" />
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
                                <div className="bg-[#1c1c1e] border border-white/5 rounded-[24px] p-4 flex items-center gap-5 hover:bg-[#2c2c2e]/60 hover:border-white/10 transition-all group-hover:scale-[1.02] duration-500 ease-[0.16,1,0.3,1] shadow-xl">
                                    {/* Thumbnail / Icon */}
                                    <div className="w-20 h-20 bg-black rounded-[16px] shrink-0 overflow-hidden relative border border-white/10 group-hover:border-white/20 transition-colors">
                                        {item.thumbnail_url ? (
                                            <Image src={item.thumbnail_url} alt="" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-[#2c2c2e]/50">
                                                {item.type === 'pdf' && <FileText className="w-6 h-6 text-[#86868b]" />}
                                                {item.type === 'trick' && <Wand2 className="w-6 h-6 text-[#86868b]" />}
                                                {item.type === 'illusion' && <Sparkles className="w-6 h-6 text-[#86868b]" />}
                                                {item.type === 'tips' && <Lightbulb className="w-6 h-6 text-brand-gold" />}
                                                {item.type === 'game' && <Dices className="w-6 h-6 text-[#86868b]" />}
                                                {item.type === 'product' && <ShoppingBag className="w-6 h-6 text-brand-purple" />}
                                                {item.type === 'custom_link' && <ArrowRight className="w-6 h-6 text-[#86868b]" />}
                                                {!['pdf', 'trick', 'illusion', 'tips', 'game', 'product', 'custom_link'].includes(item.type || '') && <Video className="w-6 h-6 text-[#86868b]" />}
                                            </div>
                                        )}
                                        <div className="absolute top-1.5 left-1.5 bg-brand-purple text-[8px] font-bold px-2 py-0.5 rounded-md text-white uppercase shadow-md backdrop-blur-md">New</div>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-[17px] text-[#f5f5f7] group-hover:text-brand-purple transition-colors truncate">{item.title}</h4>
                                        <p className="text-[11px] text-[#86868b] mt-1.5 flex items-center gap-2 truncate font-medium">
                                            {item.week_number ? (
                                                <>
                                                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                                                    Ajouté à ton espace Semaine {item.week_number}
                                                </>
                                            ) : (
                                                <span className="uppercase tracking-widest text-[9px] font-bold text-[#86868b]/70">
                                                    {item.type === 'tip' ? 'Conseil du jour' : item.type === 'product' ? 'Boutique' : 'Lien externe'}
                                                </span>
                                            )}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <div className="ml-2 w-8 h-8 rounded-full bg-[#2c2c2e]/50 flex items-center justify-center border border-white/5 opacity-50 group-hover:opacity-100 group-hover:bg-brand-purple/20 transition-all duration-300">
                                        <ArrowRight className="w-4 h-4 text-[#86868b] group-hover:text-brand-purple transition-colors transform group-hover:translate-x-0.5 duration-300" />
                                    </div>
                                </div>
                            </Link>
                        )
                    })
                ) : (
                    <div className="text-[#86868b] text-sm italic bg-[#1c1c1e] p-6 rounded-[24px] border border-dashed border-white/10 text-center font-light">
                        Pas de nouveautés pour le moment.
                    </div>
                )}
            </div>
        </section>
    );
}
