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
            <div className="relative bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-12 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-magic-gold/5 to-transparent pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center">
                    <Sparkles className="w-12 h-12 text-magic-gold/50 mb-4" />
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">Du nouveau très bientôt...</h3>
                    <p className="text-slate-400 font-light">L'équipe prépare du contenu exclusif pour le Club.</p>
                </div>
            </div>
        );
    }

    const { title, description, image, link, buttonText, tag } = config;

    return (
        <section className="relative group scroll-mt-24 mb-16">
            {/* Animated Glow Premium */}
            <div className="absolute -inset-1 bg-gradient-to-r from-magic-gold/20 to-transparent rounded-3xl opacity-30 blur-xl group-hover:opacity-50 transition duration-1000"></div>

            <div className="relative bg-black border border-white/10 hover:border-magic-gold/30 transition-colors duration-500 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                {/* Thumbnail Side */}
                <div className="md:w-3/5 relative aspect-video md:aspect-auto bg-[#0a0a0f] overflow-hidden">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>

                    {image ? (
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f]">
                            <Sparkles className="w-20 h-20 text-white/5" />
                        </div>
                    )}

                    {/* Vignette effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none"></div>

                    {/* Premium Tag Badge */}
                    <div className="absolute top-6 left-6 z-20">
                        <span className="bg-magic-gold text-black text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(238,195,67,0.3)] flex items-center gap-2">
                            <Sparkles className="w-3 h-3" />
                            Actualité de l'atelier
                        </span>
                    </div>
                </div>

                {/* Content Side */}
                <div className="md:w-2/5 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-[#111] to-black relative border-t md:border-t-0 md:border-l border-white/5">
                    {/* subtle inner glow */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-magic-gold/5 blur-[80px] rounded-full pointer-events-none hidden md:block"></div>

                    <div className="mb-auto relative z-10">
                        <h2 className="text-3xl md:text-4xl font-black font-serif text-white leading-tight mb-6 group-hover:text-magic-gold transition-colors duration-500">
                            {title}
                        </h2>
                        <p className="text-slate-400 text-sm leading-relaxed font-light">
                            {description}
                        </p>
                    </div>

                    <div className="mt-10 relative z-10">
                        <Link
                            href={link || "#"}
                            className="inline-flex w-full items-center justify-center gap-3 bg-magic-gold text-black hover:bg-yellow-400 font-bold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(238,195,67,0.2)] hover:shadow-[0_0_30px_rgba(238,195,67,0.4)] uppercase tracking-wider text-sm hover:-translate-y-0.5"
                        >
                            {buttonText || "Découvrir"} <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
