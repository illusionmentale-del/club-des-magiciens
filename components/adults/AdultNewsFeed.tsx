"use client";

import Link from "next/link";
import Image from "next/image";
import { Bell, ArrowRight, Video, FileText, ShoppingBag, Sparkles } from "lucide-react";
import { BentoHoverEffect } from "./MotionWrapper";

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
        <section className="bg-[#1c1c1e] rounded-[32px] p-6 md:p-8 border border-white/5 shadow-xl">
            <h3 className="text-xl font-semibold flex items-center gap-3 text-white tracking-tight mb-8">
                <Bell className="w-5 h-5 text-brand-purple" />
                Dernières Nouveautés
            </h3>

            <div className="space-y-3">
                {items.length > 0 ? (
                    items.map(item => {
                        let href = `/dashboard/catalog`;
                        if (item.type === 'course' || !item.type) href = `/watch/${item.id}`;
                        if (item.type === 'custom_link' && item.url) href = item.url;
                        if (item.type === 'product' && item.url) href = item.url;

                        const isExternal = item.type === 'custom_link' || item.type === 'product';

                        return (
                            <BentoHoverEffect key={item.id}>
                                <Link
                                    href={href}
                                    target={isExternal ? "_blank" : "_self"}
                                    className="group block bg-black/20 hover:bg-[#2c2c2e] rounded-[24px] p-4 transition-colors duration-300 border border-transparent hover:border-brand-purple/30"
                                >
                                    <div className="flex items-center gap-5">
                                        {/* Thumbnail / Icon */}
                                        <div className="w-16 h-16 bg-[#1c1c1e] rounded-2xl shrink-0 overflow-hidden relative shadow-md">
                                            {item.thumbnail_url ? (
                                                <Image src={item.thumbnail_url} alt="" fill className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-[0.16,1,0.3,1]" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2c2c2e] to-[#1c1c1e]">
                                                    {item.type === 'pdf' ? <FileText className="w-6 h-6 text-[#86868b]" /> :
                                                        item.type === 'product' ? <ShoppingBag className="w-6 h-6 text-[#f5f5f7]" /> :
                                                            item.type === 'custom_link' ? <ArrowRight className="w-6 h-6 text-[#86868b]" /> :
                                                                <Video className="w-6 h-6 text-[#86868b]" />}
                                                </div>
                                            )}
                                            <div className="absolute top-1 right-1 bg-white text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">New</div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1">
                                            <h4 className="font-medium text-[#f5f5f7] group-hover:text-brand-purple transition-colors duration-300 line-clamp-1 text-base tracking-tight">{item.title}</h4>
                                            <p className="text-sm text-[#86868b] mt-1 font-light">
                                                {item.created_at ? (
                                                    `Ajouté le ${new Date(item.created_at).toLocaleDateString('fr-FR')}`
                                                ) : (
                                                    <span className="opacity-70">
                                                        {item.type === 'product' ? 'Boutique' : 'Lien externe'}
                                                    </span>
                                                )}
                                            </p>
                                        </div>

                                        {/* Arrow */}
                                        <div className="ml-auto pr-2">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-white group-hover:text-black text-[#86868b] transition-all duration-300">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </BentoHoverEffect>
                        )
                    })
                ) : (
                    <div className="text-[#86868b] text-sm font-light text-center py-8">
                        Aucune nouveauté à afficher pour le moment.
                    </div>
                )}
            </div>
        </section>
    );
}
