"use client";

import { useState } from "react";
import { Sparkles, Star, PlayCircle, ShieldCheck, Crown } from "lucide-react";
import SubscribeButton from "@/components/SubscribeButton";

export default function AtelierPricingCards({
    monthlyProduct,
    yearlyProduct,
    userLoggedIn
}: {
    monthlyProduct: any;
    yearlyProduct: any;
    userLoggedIn: boolean
}) {
    // Default to 'yearly' being focused implicitly
    const [hoveredCard, setHoveredCard] = useState<'monthly' | 'yearly' | null>(null);

    // Calculate dimensions based on hover state.
    // If nothing is hovered, yearly is large.
    const isYearlyExpanded = hoveredCard !== 'monthly';
    const isMonthlyExpanded = hoveredCard === 'monthly';

    // RENDER: Monthly on the LEFT, Yearly on the RIGHT.
    // We use a high-performance flex-grow transition for buttery smooth Apple-like animation.

    return (
        <div
            className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch lg:items-end w-full max-w-7xl mx-auto"
            onMouseLeave={() => setHoveredCard(null)}
        >
            {/* PASS ESSENTIEL - LEFT SIDE */}
            <div
                className="relative group flex flex-col justify-end overflow-hidden origin-bottom"
                style={{
                    flex: isMonthlyExpanded ? 2.5 : 1,
                    transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                    opacity: isMonthlyExpanded ? 1 : 0.8,
                    transform: isMonthlyExpanded ? 'scale(1)' : 'scale(0.98)'
                }}
                onMouseEnter={() => setHoveredCard('monthly')}
            >
                <div className={`bg-transparent border border-white/10 rounded-[2.5rem] p-8 md:p-10 relative h-full flex flex-col transition-colors duration-500 min-w-[320px] ${isMonthlyExpanded ? 'bg-white/[0.04] shadow-2xl' : 'hover:bg-white/[0.02]'}`}>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-6">
                        <div className="flex-shrink-0">
                            <h3 className={`font-bold transition-colors duration-500 mb-2 whitespace-nowrap ${isMonthlyExpanded ? 'text-3xl md:text-4xl text-magic-gold' : 'text-2xl text-white group-hover:text-magic-gold'}`}>Abonnement Mensuel</h3>
                            <p className="text-gray-400 text-sm whitespace-nowrap">Découvrez l'Atelier sans engagement.</p>
                        </div>

                        <div className="flex items-baseline gap-1 flex-shrink-0">
                            <span className="font-black text-white text-4xl lg:text-5xl transition-all duration-300">
                                {monthlyProduct?.price_label || "9,99€"}
                            </span>
                            <span className="text-gray-500 font-medium">/mois</span>
                        </div>
                    </div>

                    <div
                        className="overflow-hidden transition-all duration-500 ease-in-out"
                        style={{
                            maxHeight: isMonthlyExpanded ? '150px' : '40px',
                            opacity: isMonthlyExpanded ? 1 : 0.9,
                            marginBottom: '2rem'
                        }}
                    >
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <li className="flex items-center gap-3 text-gray-400">
                                <CheckIcon />
                                <span className="whitespace-nowrap">L'intégralité du contenu</span>
                            </li>
                            <li className="flex items-center gap-3 text-gray-400">
                                <CheckIcon />
                                <span className="whitespace-nowrap">Nouvelles sorties incluses</span>
                            </li>
                            <li className={`flex items-center gap-3 text-gray-400 transition-opacity duration-300 ${isMonthlyExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                <CheckIcon />
                                <span className="whitespace-nowrap">Annulable en un simple clic</span>
                            </li>
                            <li className={`flex items-center gap-3 text-gray-400 transition-opacity duration-300 ${isMonthlyExpanded ? 'opacity-100' : 'opacity-0'}`}>
                                <CheckIcon />
                                <span className="whitespace-nowrap">Accès multi-écrans</span>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-auto">
                        <SubscribeButton
                            priceId={monthlyProduct?.stripe_price_id}
                            productId={monthlyProduct?.id}
                            space="adults"
                            userLoggedIn={userLoggedIn}
                            buttonText="Commencer l'essai"
                            className={`w-full text-white border transition-colors duration-500 ${isMonthlyExpanded ? 'py-4 text-lg bg-white/10 border-white/30 hover:bg-white/20' : 'bg-transparent border-white/20 hover:border-white/40'}`}
                        />
                    </div>
                </div>
            </div>

            {/* LE CERCLE - RIGHT SIDE */}
            <div
                className="relative group flex flex-col justify-end overflow-hidden origin-bottom"
                style={{
                    flex: isYearlyExpanded ? 2.5 : 1,
                    transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
                    opacity: isYearlyExpanded ? 1 : 0.8,
                    transform: isYearlyExpanded ? 'scale(1)' : 'scale(0.98)'
                }}
                onMouseEnter={() => setHoveredCard('yearly')}
            >
                {/* Glow Behind */}
                <div
                    className="absolute -inset-1 bg-gradient-to-br from-magic-gold/30 to-amber-700/10 rounded-[2.5rem] blur-xl transition-opacity duration-700 pointer-events-none"
                    style={{ opacity: isYearlyExpanded ? 0.8 : 0 }}
                ></div>

                <div className="relative bg-[#0A0A0E] border border-white/10 rounded-[2.5rem] p-8 md:p-10 h-full flex flex-col min-w-[320px] transition-colors duration-500 shadow-2xl z-10">
                    {/* Inner Glass border */}
                    <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                        <div className="flex-shrink-0">
                            <div className="flex items-center gap-3 mb-2">
                                <Crown className="w-8 h-8 text-magic-gold flex-shrink-0" />
                                <h2 className="font-black text-white tracking-tight whitespace-nowrap text-3xl md:text-4xl lg:text-5xl transition-all duration-300">
                                    Abonnement Annuel
                                </h2>
                            </div>
                            <p className="text-magic-gold/80 font-medium tracking-wide whitespace-nowrap text-sm lg:text-base">
                                Économisez 2 mois d'abonnement.
                            </p>
                        </div>

                        <div className="flex flex-col items-start md:items-end flex-shrink-0">
                            <div className="flex items-baseline gap-2">
                                <span className="font-black text-white tracking-tighter text-4xl lg:text-5xl transition-all duration-300">
                                    {yearlyProduct?.price_label || "99,99€"}
                                </span>
                            </div>
                            <div className="text-gray-400 font-medium mt-1 whitespace-nowrap">facturé annuellement</div>

                            <div
                                className="overflow-hidden transition-all duration-500 ease-in-out"
                                style={{
                                    height: isYearlyExpanded ? '30px' : '0px',
                                    marginTop: isYearlyExpanded ? '8px' : '0px',
                                    opacity: isYearlyExpanded ? 1 : 0
                                }}
                            >
                                <div className="inline-block bg-magic-gold/10 text-magic-gold border border-magic-gold/20 px-3 py-1 rounded-md text-xs font-bold whitespace-nowrap">
                                    Soit 8,33€/mois
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="overflow-hidden transition-all duration-500 ease-in-out"
                        style={{
                            height: isYearlyExpanded ? '150px' : '0px',
                            opacity: isYearlyExpanded ? 1 : 0,
                            marginBottom: isYearlyExpanded ? '2rem' : '0'
                        }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 py-2">
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex flex-shrink-0 items-center justify-center border border-white/10">
                                        <PlayCircle className="w-4 h-4 text-magic-gold" />
                                    </div>
                                    <span className="text-gray-300 text-base whitespace-nowrap">Accès illimité à <strong className="text-white">l'Atelier</strong></span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex flex-shrink-0 items-center justify-center border border-white/10">
                                        <Sparkles className="w-4 h-4 text-magic-gold" />
                                    </div>
                                    <span className="text-gray-300 text-base whitespace-nowrap"><strong className="text-white">Nouveautés régulières</strong></span>
                                </li>
                            </ul>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-magic-gold/10 flex flex-shrink-0 items-center justify-center border border-magic-gold/20">
                                        <Star className="w-4 h-4 text-magic-gold" />
                                    </div>
                                    <span className="text-gray-300 text-base whitespace-nowrap">Accès aux <strong className="text-white">Lives privés</strong></span>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-8 h-8 rounded-full bg-magic-gold/10 flex flex-shrink-0 items-center justify-center border border-magic-gold/20">
                                        <ShieldCheck className="w-4 h-4 text-magic-gold" />
                                    </div>
                                    <span className="text-gray-300 text-base whitespace-nowrap"><strong className="text-white">Ressources</strong> exclusives</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <SubscribeButton
                            priceId={yearlyProduct?.stripe_price_id}
                            productId={yearlyProduct?.id}
                            space="adults"
                            userLoggedIn={userLoggedIn}
                            buttonText="Rejoindre l'Atelier"
                            className="w-full py-4 text-lg bg-gradient-to-r from-magic-gold to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black shadow-[0_0_40px_rgba(255,215,0,0.3)] border-none"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

function CheckIcon() {
    return (
        <svg className="w-5 h-5 text-magic-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    )
}
