"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import { BentoHoverEffect } from "./MotionWrapper";

type AdultFeaturedConfig = {
    title: string;
    description: string;
    image: string;
    link: string;
    buttonText: string;
    tag: string;
};

export default function AdultHomeHero({
    config
}: {
    config: AdultFeaturedConfig | undefined
}) {
    // If no config or incomplete config, show a beautiful "Coming Soon" or default state
    if (!config || !config.title) {
        return (
            <div className="relative bg-[#1c1c1e] rounded-[32px] overflow-hidden shadow-2xl p-12 text-center border border-white/5">
                <div className="absolute inset-0 bg-gradient-to-br from-[#f5f5f7]/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <Sparkles className="w-12 h-12 text-[#86868b] mb-4" />
                    <h3 className="text-2xl font-semibold tracking-tight text-[#f5f5f7] mb-2">Du nouveau très bientôt...</h3>
                    <p className="text-[#86868b] font-light">L'équipe prépare du contenu exclusif pour le Cercle.</p>
                </div>
            </div>
        );
    }

    const { title, description, image, link, buttonText, tag } = config;

    return (
        <section className="relative scroll-mt-24 mb-6">
            <BentoHoverEffect>
                <Link href={link || "#"} className="block relative bg-[#1c1c1e] rounded-[32px] overflow-hidden shadow-2xl group border border-white/5 h-[400px] md:h-[500px]">
                    
                    {/* Background Image & Overlay */}
                    <div className="absolute inset-0 z-0">
                        {image ? (
                            <Image
                                src={image}
                                alt={title}
                                fill
                                className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000 ease-[0.16,1,0.3,1]"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#1c1c1e]"></div>
                        )}
                        {/* Soft dark vignette bottom to top for text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    </div>

                    {/* Premium Tag Badge */}
                    <div className="absolute top-6 left-6 z-20">
                        <span className="bg-black/40 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            {tag || "À la une"}
                        </span>
                    </div>

                    {/* Content Side */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 flex flex-col justify-end z-10">
                        <h2 className="text-4xl md:text-6xl font-semibold text-white tracking-tight leading-tight mb-4 transition-transform duration-500 group-hover:-translate-y-1">
                            {title}
                        </h2>
                        <p className="text-[#86868b] text-lg md:text-xl font-light max-w-2xl mb-8 transition-transform duration-500 delay-75 group-hover:-translate-y-1">
                            {description}
                        </p>

                        <div className="inline-flex items-center gap-2 text-[#f5f5f7] font-medium text-lg transition-transform duration-500 delay-150 group-hover:-translate-y-1">
                            {buttonText || "Découvrir"} 
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
                        </div>
                    </div>
                </Link>
            </BentoHoverEffect>
        </section>
    );
}
