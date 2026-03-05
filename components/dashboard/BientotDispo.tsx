import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

interface BientotDispoProps {
    title?: string;
    description?: string;
    backPath?: string;
    backLabel?: string;
}

export default function BientotDispo({
    title = "Du nouveau arrive très bientôt !",
    description = "Cet espace est actuellement en cours de préparation par nos équipes. De nouveaux contenus exclusifs y seront très bientôt dévoilés. Gardez l'œil ouvert !",
    backPath = "/dashboard",
    backLabel = "Retour à l'Accueil"
}: BientotDispoProps) {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-magic-royal/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8 p-12 bg-black/40 border border-white/10 rounded-3xl backdrop-blur-md">
                <div className="w-20 h-20 bg-magic-royal/10 rounded-2xl flex items-center justify-center mx-auto border border-magic-royal/20 mb-6 relative">
                    <Sparkles className="w-10 h-10 text-magic-royal animate-pulse" />
                    {/* Sparkle decors */}
                    <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-2 -right-2 rotate-12" />
                    <Sparkles className="w-3 h-3 text-white absolute bottom-1 -left-2 -rotate-12" />
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-tight">
                    {title}
                </h1>

                <p className="text-lg text-slate-400 font-light leading-relaxed max-w-xl mx-auto">
                    {description}
                </p>

                <div className="pt-8">
                    <Link
                        href={backPath}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-sm rounded-xl transition-all duration-300 border border-white/10 hover:border-white/20"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {backLabel}
                    </Link>
                </div>
            </div>
        </div>
    );
}
