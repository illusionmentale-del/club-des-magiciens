import Link from "next/link";
import Image from "next/image";
import { Play, Sparkles, ArrowRight } from "lucide-react";

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
            <div className="relative bg-black border border-white/10 rounded-sm overflow-hidden shadow-2xl p-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-magic-royal/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <Sparkles className="w-12 h-12 text-magic-royal/50 mb-4" />
                    <h3 className="text-2xl font-serif font-bold text-white mb-2 uppercase tracking-wide">Du nouveau très bientôt...</h3>
                    <p className="text-slate-400 font-light">L'équipe prépare du contenu exclusif pour le Cercle.</p>
                </div>
            </div>
        );
    }

    const { title, description, image, link, buttonText, tag } = config;

    return (
        <section className="relative group scroll-mt-24 mb-16">
            <div className="relative bg-black border border-white/10 hover:border-magic-royal/40 transition-colors duration-500 rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row">
                {/* Thumbnail Side */}
                <div className="md:w-3/5 relative aspect-video md:aspect-auto bg-[#0a0a0f] overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700 z-10 pointer-events-none"></div>

                    {image ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.05] transition-all duration-1000 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
                            <Sparkles className="w-20 h-20 text-white/5" />
                        </div>
                    )}

                    {/* Vignette effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-10 pointer-events-none"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#050507] z-10 pointer-events-none hidden md:block"></div>

                    {/* Premium Tag Badge */}
                    <div className="absolute top-6 left-6 z-20">
                        <span className="bg-black/50 backdrop-blur-md border border-magic-royal text-magic-royal text-[10px] font-bold px-4 py-1.5 uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            À la une
                        </span>
                    </div>
                </div>

                {/* Content Side */}
                <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-black relative border-t md:border-t-0 md:border-l border-white/10">
                    <div className="mb-auto relative z-10">
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-6 transition-colors duration-500">
                            {title}
                        </h2>
                        <p className="text-slate-400 text-sm md:text-base leading-relaxed font-light">
                            {description}
                        </p>
                    </div>

                    <div className="mt-10 relative z-10">
                        <Link
                            href={link || "#"}
                            className="inline-flex w-full items-center justify-center gap-3 bg-transparent text-white border border-white/20 hover:border-magic-royal hover:text-magic-royal font-bold py-4 px-6 rounded-sm transition-all uppercase tracking-widest text-sm"
                        >
                            {buttonText || "Découvrir"} <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
