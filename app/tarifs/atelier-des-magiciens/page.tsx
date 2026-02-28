import { createClient } from "@/lib/supabase/server";
import { Star } from "lucide-react";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import AtelierPricingCards from "@/components/adults/AtelierPricingCards";

export const metadata = {
    title: "L'Atelier des Magiciens | Rejoindre le Cercle",
    description: "Passez à la vitesse supérieure. Rejoignez le cercle des maîtres avec nos abonnements exclusifs."
}

export default async function AdultsPricingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Subscription Products specifically for adults space
    const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("type", "subscription")
        .eq("space", "adults")
        .eq("is_active", true)
        .order("price", { ascending: true });

    // Deduce Monthly vs Yearly by price order
    const monthlyProduct = products && products.length > 0 ? products[0] : null;
    const yearlyProduct = products && products.length > 1 ? products[1] : null;

    return (
        <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-magic-gold/30 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-magic-gold/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0 animate-pulse-slow"></div>
            <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

            {/* Simple Header */}
            <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-8 h-8 md:w-10 md:h-10 transform group-hover:scale-110 transition-all">
                        <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <span className="font-black text-lg md:text-xl tracking-tight uppercase">L'Atelier des <span className="text-magic-gold">Magiciens</span></span>
                </Link>
                {user ? (
                    <Link href="/dashboard" className="text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors backdrop-blur-md">
                        Mon QG
                    </Link>
                ) : (
                    <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                        Connexion
                    </Link>
                )}
            </header>

            <div className="relative z-10 max-w-6xl mx-auto px-4 pt-32 pb-24">
                {/* Hero Section */}
                <div className="mb-16 md:mb-24 flex flex-col items-start max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-magic-gold/30 bg-gradient-to-r from-magic-gold/10 to-transparent text-magic-gold text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(255,215,0,0.15)] backdrop-blur-md mb-8">
                        <Star className="w-4 h-4 fill-magic-gold" />
                        L'Atelier des Magiciens
                        <Star className="w-4 h-4 fill-magic-gold" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1] mb-6">
                        Passez à la vitesse <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-magic-gold to-yellow-600">supérieure.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
                        Des Masterclass exclusives tournées par des professionnels. Des secrets jalousement gardés, enfin dévoilés étape par étape pour perfectionner votre art.
                    </p>
                </div>

                {/* Subscriptions - Asymmetric Layout (Dynamic Hover) */}
                <AtelierPricingCards
                    monthlyProduct={monthlyProduct}
                    yearlyProduct={yearlyProduct}
                    userLoggedIn={!!user}
                />

                <div className="mt-16 text-center text-gray-500 font-medium">
                    <p>
                        Paiement 100% sécurisé via Stripe. Vous pouvez annuler votre forfait Mensuel à tout moment depuis votre espace. <br className="hidden md:block" />
                        Conformément à l'Article L221-18 du Code de la consommation, vous renoncez à votre droit de rétractation pour accéder au contenu numérique immédiatement.
                    </p>
                </div>

                {/* FAQ */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <h3 className="text-3xl font-black text-center text-white mb-8">Questions Fréquentes</h3>

                    <div className="space-y-4">
                        <details className="group bg-white/[0.02] border border-white/5 rounded-2xl [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:border-magic-gold/30 ring-1 ring-white/5 hover:ring-white/10 backdrop-blur-sm">
                            <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-white md:text-lg">
                                Que contient exactement le catalogue des Masterclass ?
                                <span className="transition duration-300 group-open:rotate-180 text-magic-gold">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 text-sm md:text-base leading-relaxed animate-in slide-in-from-top-1 duration-300">
                                Le catalogue comprend l'ensemble de nos vidéos de formation de haute qualité. Chaque Masterclass décortique des routines, des techniques poussées et la psychologie derrière les miracles, expliquées pas-à-pas par des magiciens professionnels.
                            </div>
                        </details>

                        <details className="group bg-white/[0.02] border border-white/5 rounded-2xl [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:border-magic-gold/30 ring-1 ring-white/5 hover:ring-white/10 backdrop-blur-sm">
                            <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-white md:text-lg">
                                Puis-je résilier facilement ?
                                <span className="transition duration-300 group-open:rotate-180 text-magic-gold">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 text-sm md:text-base leading-relaxed animate-in slide-in-from-top-1 duration-300">
                                Le Pass Essentiel (Mensuel) est 100% sans engagement. Vous pouvez l'annuler d'un simple clic dans votre espace "Mon QG" à tout moment, sans avoir à nous contacter. Votre accès restera actif jusqu'à la fin de la période facturée. L'abonnement "Le Cercle" vous engage pour un an.
                            </div>
                        </details>
                    </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}
