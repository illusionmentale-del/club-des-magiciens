import { createClient } from "@/lib/supabase/server";
import { Check, Sparkles, Gift, Star, PlayCircle, ShoppingBag, BookOpen, ShieldCheck, Crown } from "lucide-react";
import SubscribeButton from "@/components/SubscribeButton";
import Footer from "@/components/Footer";
import Link from "next/link";
import AnimatedLink from "@/components/AnimatedLink";
import { redirect } from "next/navigation";
import { FadeInUp, BentoHoverEffect } from "@/components/adults/MotionWrapper";

export const metadata = {
    title: "L'Atelier des Magiciens | Rejoindre l'Atelier",
    description: "Passez à la vitesse supérieure. Rejoignez l'élite des magiciens avec notre abonnement exclusif."
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
        .not("title", "ilike", "Option%")
        .order("price", { ascending: true });

    // Deduce Monthly vs Yearly by price order
    const monthlyProduct = products && products.length > 0 ? products[0] : null;

    const signOutAction = async () => {
        "use server";
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect("/login");
    };

    return (
        <div className="min-h-screen bg-black text-[#f5f5f7] font-sans selection:bg-brand-blue/30 relative overflow-hidden">
            {/* Ambient Background - Very Subtle Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-blue/5 blur-[200px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Simple Header */}
            <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <Crown className="w-8 h-8 md:w-10 md:h-10 text-[#f5f5f7] transform group-hover:scale-110 transition-all" />
                    <span className="font-semibold text-lg md:text-xl tracking-tight text-[#f5f5f7]">L'Atelier des <span className="font-light text-[#86868b]">Magiciens</span></span>
                </Link>
                {user ? (
                    <div className="flex items-center gap-3">
                        <form action={signOutAction}>
                            <button type="submit" className="text-sm font-medium text-[#86868b] hover:text-[#f5f5f7] transition-colors">
                                Se déconnecter
                            </button>
                        </form>
                        <Link href="/dashboard" className="text-sm font-medium bg-[#f5f5f7] text-black hover:bg-white px-6 py-2 rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105">
                            Mon QG
                        </Link>
                    </div>
                ) : (
                    <AnimatedLink href="/login" className="text-base font-medium text-[#f5f5f7] hover:text-white px-2 py-1 rounded-none transition-colors">
                        Connexion
                    </AnimatedLink>
                )}
            </header>

            <div className="relative z-10 max-w-5xl mx-auto px-4 pt-40 pb-32">
                {/* Hero Section */}
                <FadeInUp delay={0.1}>
                    <div className="text-center space-y-8 mb-32 relative mt-10">
                        {/* Subtle background glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-blue/10 blur-[120px] rounded-full z-0 pointer-events-none"></div>
                        
                        <div className="relative z-10 inline-flex items-center gap-2 px-5 py-2 border border-brand-purple/30 bg-brand-purple/5 rounded-full text-brand-purple text-[11px] font-bold tracking-[0.2em] uppercase backdrop-blur-xl shadow-[0_0_20px_rgba(94,92,230,0.15)] mb-2 hover:border-brand-purple/50 transition-colors cursor-default">
                            <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                            L'Atelier des Magiciens
                        </div>
                        
                        <h1 className="relative z-10 text-5xl md:text-7xl lg:text-[90px] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-500 leading-[1.05] pb-2 drop-shadow-sm">
                            Maîtrisez l'art <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-purple-400 drop-shadow-[0_0_25px_rgba(94,92,230,0.3)]">de l'illusion.</span>
                        </h1>
                        
                        <p className="relative z-10 text-xl md:text-2xl text-[#86868b] max-w-3xl mx-auto font-light leading-relaxed mt-6">
                            Accédez à des Masterclass exclusives. Apprenez les secrets jalousement gardés par des professionnels, expliqués étape par étape.
                        </p>
                    </div>
                </FadeInUp>

                {/* Video Teaser Block */}
                <FadeInUp delay={0.2}>
                    <section className="relative z-20 mb-24 max-w-4xl mx-auto">
                        <BentoHoverEffect>
                            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl backdrop-blur-sm aspect-video flex flex-col items-center justify-center group cursor-pointer hover:border-brand-blue/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-700">
                                <div className="absolute inset-0 bg-[url('/bg-noise.png')] opacity-20 mix-blend-overlay"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                                
                                <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 group-hover:scale-110 transition-all duration-500 ease-[0.16,1,0.3,1] z-20 shadow-2xl mb-6">
                                    <PlayCircle className="w-12 h-12 text-[#f5f5f7] ml-1" />
                                </div>
                                <h3 className="text-3xl font-semibold text-[#f5f5f7] tracking-tight text-center px-4 z-20 mb-2">Découvrez l'Atelier en Vidéo</h3>
                                <p className="text-[#86868b] font-light z-20">Appuyez sur lecture</p>
                            </div>
                        </BentoHoverEffect>
                    </section>
                </FadeInUp>

                {/* Social Proof dynamique */}
                <FadeInUp delay={0.3}>
                    <div className="flex flex-col items-center justify-center mb-24 relative z-10 w-full mx-auto">
                        <div className="relative text-sm md:text-base font-medium text-gray-300 text-center bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-12 py-5 shadow-[0_0_30px_rgba(59,130,246,0.1)] flex items-center justify-center gap-4 hover:border-brand-blue/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] transition-all cursor-pointer">
                            <Star className="w-5 h-5 text-brand-blue animate-pulse" />
                            <span>
                                Rejoignez déjà l'élite de <span className="text-white text-2xl font-bold mx-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">300</span> maîtres
                            </span>
                            <Star className="w-5 h-5 text-brand-blue animate-pulse" />
                        </div>
                    </div>
                </FadeInUp>

                {/* Subscriptions Grid */}
                <FadeInUp delay={0.4}>
                    <div className="relative z-10 max-w-xl mx-auto">
                        <BentoHoverEffect>
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-[40px] p-10 md:p-14 flex flex-col relative overflow-hidden transition-all duration-700 hover:shadow-[0_0_60px_rgba(59,130,246,0.2)] hover:border-brand-blue/50 group shadow-2xl">
                                {/* Inner animated glows */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/10 blur-[80px] rounded-full group-hover:bg-brand-blue/20 transition-all duration-700 -z-10"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full group-hover:bg-brand-blue/10 transition-all duration-700 -z-10"></div>
                                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                                <div className="mb-8 text-center relative z-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-sm font-semibold text-brand-blue w-fit mb-6 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                                        <ShieldCheck className="w-4 h-4" />
                                        100% Sans Engagement
                                    </div>
                                    <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Le Pass Essentiel</h2>
                                    <p className="text-gray-400 font-light text-lg">Idéal pour découvrir l'Atelier sans contrainte.</p>
                                </div>

                                <div className="mb-10 flex flex-col items-center border-b border-white/10 pb-10 relative z-10">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-6xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">{monthlyProduct?.price_label || "4,99€"}</span>
                                        <span className="text-gray-500 font-medium text-xl">/mois</span>
                                    </div>
                                    <span className="text-sm text-gray-500 mt-4 font-light">Annulable à tout moment sur simple demande par mail.</span>
                                </div>

                                <ul className="space-y-8 mb-12 flex-1">
                                    <li className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0 border border-white/5 group-hover:border-brand-blue/50 transition-colors">
                                            <PlayCircle className="w-6 h-6 text-[#f5f5f7]" />
                                        </div>
                                        <div className="mt-1">
                                            <strong className="block text-[#f5f5f7] text-lg mb-1 font-medium">Accès Illimité</strong>
                                            <span className="text-[#86868b] text-base leading-relaxed font-light">Visionnez l'intégralité du catalogue des Masterclass en illimité.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0 border border-white/5 group-hover:border-brand-blue/50 transition-colors">
                                            <Sparkles className="w-6 h-6 text-[#f5f5f7]" />
                                        </div>
                                        <div className="mt-1">
                                            <strong className="block text-[#f5f5f7] text-lg mb-1 font-medium">Nouveautés Récurrentes</strong>
                                            <span className="text-[#86868b] text-base leading-relaxed font-light">Des ajouts de vidéos réguliers pour perfectionner votre technique.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0 border border-white/5 group-hover:border-brand-blue/50 transition-colors">
                                            <BookOpen className="w-6 h-6 text-[#f5f5f7]" />
                                        </div>
                                        <div className="mt-1">
                                            <strong className="block text-[#f5f5f7] text-lg mb-1 font-medium">Supports Pédagogiques</strong>
                                            <span className="text-[#86868b] text-base leading-relaxed font-light">Téléchargez les PDF de révision pour chaque technique abordée.</span>
                                        </div>
                                    </li>
                                </ul>

                                <SubscribeButton
                                    priceId={monthlyProduct?.stripe_price_id}
                                    productId={monthlyProduct?.id}
                                    space="adults"
                                    userLoggedIn={!!user}
                                    buttonText="Rejoindre l'Atelier"
                                    className="bg-white hover:bg-gray-200 text-black font-bold uppercase tracking-widest text-sm py-5 rounded-xl w-full shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all hover:scale-[1.02] relative z-10"
                                />
                            </div>
                        </BentoHoverEffect>
                    </div>
                </FadeInUp>

                <FadeInUp delay={0.5}>
                    <div className="mt-20 text-center">
                        <div className="inline-flex flex-col items-center justify-center p-8 bg-[#0a0a0a] border border-white/10 rounded-[32px] max-w-3xl mx-auto shadow-xl">
                            <h3 className="text-xl font-semibold text-[#f5f5f7] mb-4">Informations Légales & Droit de Rétractation</h3>
                            <p className="text-[#86868b] text-sm leading-relaxed text-justify md:text-center font-light">
                                Conformément à l'Article L221-18 du Code de la consommation, vous bénéficiez d'un délai de rétractation de 14 jours.
                                <strong className="font-medium text-[#f5f5f7]"> Cependant</strong>, l'Atelier des Magiciens fournissant un contenu numérique immédiatement accessible après paiement,
                                <strong className="font-medium text-[#f5f5f7]"> vous renoncez expressément à votre droit de rétractation</strong> en validant votre inscription pour accéder sans délai à la plateforme.
                                L'abonnement mensuel reste bien entendu <em>sans engagement</em> et peut être annulé à tout moment sur simple demande par mail.
                            </p>
                        </div>
                    </div>
                </FadeInUp>

                {/* FAQ */}
                <FadeInUp delay={0.6}>
                    <div className="mt-32 max-w-3xl mx-auto">
                        <h3 className="text-3xl font-semibold text-center text-[#f5f5f7] mb-12 tracking-tight">Questions Fréquentes</h3>

                        <div className="space-y-4">
                            <details className="group bg-[#0a0a0a] border border-white/10 rounded-[24px] [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:border-brand-blue/50 hover:border-brand-blue/30">
                                <summary className="flex items-center justify-between p-6 md:p-8 font-medium cursor-pointer text-[#f5f5f7] text-lg">
                                    Que contient exactement le catalogue des Masterclass ?
                                    <span className="transition duration-300 group-open:rotate-180 text-[#86868b]">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="px-6 md:px-8 pb-6 md:pb-8 text-[#86868b] text-base leading-relaxed animate-in slide-in-from-top-2 duration-300 font-light border-t border-white/5 pt-4 mt-2">
                                    Le catalogue comprend l'ensemble de nos vidéos de formation de haute qualité. Chaque Masterclass décortique des routines, des techniques poussées et la psychologie derrière les miracles, expliquées pas-à-pas par des magiciens professionnels.
                                </div>
                            </details>

                            <details className="group bg-[#0a0a0a] border border-white/10 rounded-[24px] [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:border-brand-blue/50 hover:border-brand-blue/30">
                                <summary className="flex items-center justify-between p-6 md:p-8 font-medium cursor-pointer text-[#f5f5f7] text-lg">
                                    Puis-je résilier facilement ?
                                    <span className="transition duration-300 group-open:rotate-180 text-[#86868b]">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="px-6 md:px-8 pb-6 md:pb-8 text-[#86868b] text-base leading-relaxed animate-in slide-in-from-top-2 duration-300 font-light border-t border-white/5 pt-4 mt-2">
                                    Le Pass Essentiel (Mensuel) est 100% sans engagement. Vous pouvez l'annuler sur simple demande par mail à tout moment, sans aucune justification. Votre accès restera actif jusqu'à la fin de la période facturée.
                                </div>
                            </details>
                            
                            <details className="group bg-[#0a0a0a] border border-white/10 rounded-[24px] [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:border-brand-blue/50 hover:border-brand-blue/30">
                                <summary className="flex items-center justify-between p-6 md:p-8 font-medium cursor-pointer text-[#f5f5f7] text-lg">
                                    Est-ce que mon paiement est sécurisé ?
                                    <span className="transition duration-300 group-open:rotate-180 text-[#86868b]">
                                        <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                    </span>
                                </summary>
                                <div className="px-6 md:px-8 pb-6 md:pb-8 text-[#86868b] text-base leading-relaxed animate-in slide-in-from-top-2 duration-300 font-light border-t border-white/5 pt-4 mt-2">
                                    Oui. Nous utilisons Stripe, le leader mondial du paiement en ligne sécurisé. Nous n'avons jamais accès à vos coordonnées bancaires et vos informations sont chiffrées de bout en bout.
                                </div>
                            </details>
                        </div>
                    </div>
                </FadeInUp>

                <p className="text-center text-[#86868b] text-sm mt-16 font-light">
                    Paiement 100% sécurisé via Stripe.
                </p>

                <div className="w-full text-center mt-8 md:mt-12 pb-4 md:pb-12 relative z-10">
                    <a 
                        href="mailto:contact@atelierdesmagiciens.fr?subject=Besoin%20d'aide%20-%20Atelier%20des%20Magiciens" 
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        J'ai besoin d'aide
                    </a>
                </div>
            </div>
            <Footer space="adults" />
        </div>
    );
}
