"use client";

import { useState } from "react";
import { Sparkles, Star, PlayCircle, ShieldCheck, Crown } from "lucide-react";
import SubscribeButton from "@/components/SubscribeButton";

export default function AtelierPricingCards({
    product,
    userLoggedIn
}: {
    product: any;
    userLoggedIn: boolean
}) {
    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            {/* L'ATELIER - SINGLE PASS */}
            <div className="relative group w-full flex flex-col overflow-hidden origin-bottom">
                {/* Glow Behind */}
                <div className="absolute -inset-1 bg-gradient-to-br from-magic-royal/30 to-amber-700/10 rounded-[2.5rem] blur-xl opacity-80 pointer-events-none group-hover:opacity-100 transition-opacity"></div>

                <div className="relative bg-[#0A0A0E] border border-white/10 rounded-[2.5rem] p-8 md:p-10 h-full flex flex-col min-w-[320px] transition-colors duration-500 shadow-2xl z-10">
                    {/* Inner Glass border */}
                    <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none"></div>

                    <div className="flex flex-col justify-between items-center text-center mb-8 gap-4">
                        <div className="flex-shrink-0 flex flex-col items-center">
                            <Crown className="w-10 h-10 text-magic-royal mb-4 flex-shrink-0 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
                            <h2 className="font-black text-white tracking-tight whitespace-nowrap text-3xl md:text-4xl transition-all duration-300">
                                L'Atelier des Magiciens
                            </h2>
                            <p className="text-gray-400 mt-2 text-sm lg:text-base">
                                Découvrez l'intégralité de l'Atelier sans engagement.
                            </p>
                        </div>

                        <div className="flex flex-col items-center flex-shrink-0 mt-4">
                            <div className="flex items-baseline gap-2">
                                <span className="font-black text-white tracking-tighter text-5xl lg:text-6xl transition-all duration-300">
                                    {product?.price ? `${product.price}` : "4,99"}€
                                </span>
                                <span className="text-gray-500 font-medium text-lg">/mois</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8 flex-1 w-full mx-auto max-w-[280px]">
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex flex-shrink-0 items-center justify-center border border-white/10">
                                    <PlayCircle className="w-4 h-4 text-magic-royal" />
                                </div>
                                <span className="text-gray-300 text-base">Accès illimité à <strong className="text-white">l'Atelier</strong></span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex flex-shrink-0 items-center justify-center border border-white/10">
                                    <Sparkles className="w-4 h-4 text-magic-royal" />
                                </div>
                                <span className="text-gray-300 text-base"><strong className="text-white">Nouveautés hebdomadaires</strong></span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-magic-royal/10 flex flex-shrink-0 items-center justify-center border border-magic-royal/20">
                                    <Star className="w-4 h-4 text-magic-royal" />
                                </div>
                                <span className="text-gray-300 text-base">Accès aux <strong className="text-white">Lives privés</strong></span>
                            </li>
                            <li className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full bg-magic-royal/10 flex flex-shrink-0 items-center justify-center border border-magic-royal/20">
                                    <ShieldCheck className="w-4 h-4 text-magic-royal" />
                                </div>
                                <span className="text-gray-300 text-base"><strong className="text-white">Annulable en un clic</strong></span>
                            </li>
                        </ul>
                    </div>

                    <div className="mt-auto">
                        <SubscribeButton
                            priceId={product?.stripe_price_id}
                            productId={product?.id}
                            space="adults"
                            userLoggedIn={userLoggedIn}
                            buttonText="Rejoindre l'Atelier"
                            className="w-full py-4 text-lg bg-gradient-to-r from-magic-royal to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black shadow-[0_0_40px_rgba(255,215,0,0.3)] border-none font-bold transition-all transform hover:scale-[1.02]"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

function CheckIcon() {
    return (
        <svg className="w-5 h-5 text-magic-royal flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    )
}
