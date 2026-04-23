import { createClient } from "@/lib/supabase/server";
import { Check, Sparkles, Gift, Star, PlayCircle, ShoppingBag, BookOpen, ShieldCheck, Crown } from "lucide-react";
import SubscribeButton from "@/components/SubscribeButton";
import Footer from "@/components/Footer";
import Link from "next/link";
import AnimatedLink from "@/components/AnimatedLink";
import { redirect } from "next/navigation";

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
        .not("title", "ilike", "Option%")
        .order("price", { ascending: true });

    // Deduce Monthly vs Yearly by price order
    const monthlyProduct = products && products.length > 0 ? products[0] : null;
    const yearlyProduct = products && products.length > 1 ? products[1] : null;

    const signOutAction = async () => {
        "use server";
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect("/login");
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-magic-royal/30 relative overflow-hidden">
            {/* Cinematic subtle noise overlay could go here, for now pure black */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/[0.02] via-black to-black pointer-events-none z-0"></div>

            {/* Simple Header */}
            <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <Crown className="w-8 h-8 md:w-10 md:h-10 text-magic-royal transform group-hover:scale-110 transition-all drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                    <span className="font-serif font-bold text-lg md:text-xl tracking-wider uppercase">L'Atelier des <span className="text-magic-royal">Magiciens</span></span>
                </Link>
                {user ? (
                    <div className="flex items-center gap-3">
                        <form action={signOutAction}>
                            <button type="submit" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                                Se déconnecter
                            </button>
                        </form>
                        <Link href="/dashboard" className="text-sm font-bold bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-colors backdrop-blur-md">
                            Mon QG
                        </Link>
                    </div>
                ) : (
                    <AnimatedLink href="/login" className="text-base font-bold text-white bg-transparent border-b border-magic-royal hover:text-magic-royal px-2 py-1 rounded-none transition-colors">
                        Connexion
                    </AnimatedLink>
                )}
            </header>

            <div className="relative z-10 max-w-5xl mx-auto px-4 pt-32 pb-24">
                {/* Hero Section */}
                <div className="text-center space-y-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-6 py-2 border-b border-magic-royal/50 bg-gradient-to-r from-transparent via-magic-royal/5 to-transparent text-magic-royal text-sm font-bold uppercase tracking-widest backdrop-blur-md">
                        <Sparkles className="w-4 h-4" />
                        L'Atelier des Magiciens
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-tight text-white leading-[1.1]">
                        Passez à la vitesse <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-magic-royal to-yellow-600 whitespace-nowrap italic pr-2">supérieure.</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed">
                        Des Masterclass exclusives tournées par des professionnels. Des secrets jalousement gardés, enfin dévoilés étape par étape pour perfectionner votre art.
                    </p>
                </div>

                {/* Video Teaser Block */}
                <section className="relative z-20 mb-16 max-w-4xl mx-auto">
                    <div className="relative bg-[#050505] border border-white/10 rounded-sm overflow-hidden shadow-2xl backdrop-blur-sm aspect-video flex flex-col items-center justify-center group cursor-pointer hover:border-magic-royal/30 transition-colors">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                        <div className="w-20 h-20 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-magic-royal/50 group-hover:bg-magic-royal/20 transition-all z-20 shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-4">
                            <PlayCircle className="w-10 h-10 text-white fill-current ml-1" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-white uppercase tracking-wider text-center px-4 z-20">Découvrez l'Atelier en Vidéo</h3>
                        <p className="text-magic-gold font-medium mt-2 z-20">Appuyez sur lecture !</p>
                    </div>
                </section>

                {/* Social Proof dynamique */}
                <div className="flex flex-col items-center justify-center mt-8 mb-8 relative z-10 w-full mx-auto animate-in slide-in-from-bottom-4 duration-700">
                    <div className="relative group cursor-pointer inline-block">
                        <div className="relative text-sm md:text-base font-serif font-bold text-gray-200 text-center bg-black border-y border-magic-royal/30 px-12 py-4 shadow-lg flex items-center justify-center gap-4">
                            <Star className="w-5 h-5 text-magic-royal fill-magic-royal animate-pulse" />
                            <span>
                                Rejoignez déjà le Cercle de <span className="text-transparent bg-clip-text bg-gradient-to-r from-magic-royal to-yellow-500 text-2xl font-bold mx-1">300</span> maîtres
                            </span>
                            <Star className="w-5 h-5 text-magic-royal fill-magic-royal animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Subscriptions Grid */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-stretch max-w-5xl mx-auto pt-4">

                    {/* MONTHLY PLAN */}
                    <div className="bg-[#050505] border border-white/5 rounded-sm p-8 md:p-10 flex flex-col relative overflow-hidden transition-all hover:bg-[#080808] hover:border-magic-royal/20 mt-8 md:mt-12 group">
                        <div className="mb-6">
                            <h2 className="text-2xl font-serif font-bold text-white mb-2 uppercase tracking-wide">Le Pass Essentiel</h2>
                            <p className="text-gray-400 font-medium mb-4">Idéal pour découvrir l'Atelier sans contrainte.</p>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-300 w-fit">
                                <ShieldCheck className="w-4 h-4 text-magic-royal" />
                                100% Sans Engagement
                            </div>
                        </div>

                        <div className="mb-8 flex flex-col border-b border-white/10 pb-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl md:text-6xl font-serif font-bold text-white">{monthlyProduct?.price_label || "4,99€"}</span>
                                <span className="text-gray-400 font-bold text-lg">/mois</span>
                            </div>
                            <span className="text-sm text-gray-500 mt-2 font-medium">Annulable en un clic depuis votre QG.</span>
                        </div>

                        <ul className="space-y-6 mb-8 flex-1">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 shadow-inner border border-white/10 group-hover:bg-magic-royal/10 transition-colors">
                                    <PlayCircle className="w-5 h-5 text-magic-gold" />
                                </div>
                                <div className="mt-0.5">
                                    <strong className="block text-white mb-1">Accès Illimité :</strong>
                                    <span className="text-gray-400 text-sm leading-relaxed">Visionnez l'intégralité du catalogue des Masterclass en illimité.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 shadow-inner border border-white/10 group-hover:bg-magic-royal/10 transition-colors">
                                    <Sparkles className="w-5 h-5 text-magic-gold" />
                                </div>
                                <div className="mt-0.5">
                                    <strong className="block text-white mb-1">Nouveautés Récurrentes :</strong>
                                    <span className="text-gray-400 text-sm leading-relaxed">Des ajouts de vidéos réguliers pour perfectionner votre technique.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 shadow-inner border border-white/10 group-hover:bg-magic-royal/10 transition-colors">
                                    <BookOpen className="w-5 h-5 text-magic-gold" />
                                </div>
                                <div className="mt-0.5">
                                    <strong className="block text-white mb-1">Supports Pédagogiques :</strong>
                                    <span className="text-gray-400 text-sm leading-relaxed">Téléchargez les PDF de révision pour chaque technique abordée.</span>
                                </div>
                            </li>
                        </ul>

                        <SubscribeButton
                            priceId={monthlyProduct?.stripe_price_id}
                            productId={monthlyProduct?.id}
                            space="adults"
                            userLoggedIn={!!user}
                            buttonText="Rejoindre l'Atelier"
                            className="bg-transparent hover:bg-white/5 text-white border border-white/20 uppercase tracking-widest text-sm font-bold py-4 rounded-sm"
                        />
                    </div>

                    {/* YEARLY PLAN (HIGHLIGHTED) */}
                    <div className="bg-[#0A0A0A] border border-magic-royal/40 rounded-sm p-8 flex flex-col relative overflow-hidden shadow-2xl transform md:-translate-y-4">
                        {/* Badge */}
                        <div className="absolute top-0 right-0 bg-magic-royal text-black font-bold text-xs uppercase tracking-[0.2em] py-2 px-6">
                            Le Choix des Maîtres
                        </div>

                        <div className="mb-6 relative z-10 flex flex-col pt-6">
                            <h2 className="text-2xl font-serif font-bold text-magic-royal mb-2 uppercase tracking-wide">Le Cercle (Annuel)</h2>
                            <p className="text-white/60 font-medium flex items-center gap-2 text-sm uppercase tracking-widest">
                                <Sparkles className="w-4 h-4 text-magic-royal" />
                                +2 mois offerts vs Mensuel
                            </p>
                        </div>

                        <div className="mb-8 relative z-10 flex flex-col border-b border-white/10 pb-6">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-serif font-bold text-white">{yearlyProduct?.price_label || "49,99€"}</span>
                                <span className="text-gray-400 font-bold">/an</span>
                            </div>
                            <span className="text-sm font-bold text-amber-400 mt-1 bg-amber-500/10 w-fit px-2 py-0.5 rounded border border-amber-500/20">
                                Paiement en une fois
                            </span>
                        </div>

                        <ul className="space-y-6 mb-8 flex-1 relative z-10">
                            <li className="flex items-start gap-4">
                                <div className="mt-0.5 w-6 flex justify-center">
                                    <PlayCircle className="w-5 h-5 text-magic-royal" />
                                </div>
                                <div className="mt-0.5 border-l border-white/10 pl-4">
                                    <strong className="block text-white mb-1 uppercase text-sm tracking-widest">Accès Intégral :</strong>
                                    <span className="text-gray-400 text-sm leading-relaxed">Profitez de toute la bibliothèque de l'Atelier sans aucune limite.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="mt-0.5 w-6 flex justify-center">
                                    <ShoppingBag className="w-5 h-5 text-magic-royal" />
                                </div>
                                <div className="mt-0.5 border-l border-white/10 pl-4">
                                    <strong className="block text-white mb-1 uppercase text-sm tracking-widest">La Boutique Privée :</strong>
                                    <span className="text-gray-400 text-sm leading-relaxed">Accédez à des routines exclusives et du matériel professionnel à un tarif préférentiel.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="mt-0.5 w-6 flex justify-center">
                                    <Crown className="w-5 h-5 text-magic-royal" />
                                </div>
                                <div className="mt-0.5 border-l border-white/10 pl-4">
                                    <strong className="block text-white mb-1 uppercase text-sm tracking-widest">Statut VIP :</strong>
                                    <span className="text-gray-400 text-sm leading-relaxed">Participez aux Lives privés pour interagir en direct avec l'équipe.</span>
                                </div>
                            </li>

                            {/* Premium Bonus Callout */}
                            <li className="flex items-start gap-4 text-magic-royal font-bold mt-8 border-y border-magic-royal/20 py-6 relative">
                                <div className="mt-0.5 w-6 flex justify-center">
                                    <Gift className="w-5 h-5 text-magic-royal" />
                                </div>
                                <div className="z-10">
                                    <span className="block text-white mb-1 text-sm tracking-widest uppercase">Cadeau Exclusif :</span>
                                    Une formation premium offerte (valeur 19,99€) dans la boutique !
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-xs font-bold text-white/50 line-through">Valeur : 19,99€</span>
                                        <span className="text-sm font-black text-amber-400 uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">INCLUS</span>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <div className="relative z-10 mt-4">
                            <SubscribeButton
                                priceId={yearlyProduct?.stripe_price_id}
                                productId={yearlyProduct?.id}
                                space="adults"
                                userLoggedIn={!!user}
                                buttonText="Rejoindre pour 1 an"
                                className="bg-magic-royal hover:bg-yellow-500 text-black border-none font-bold text-sm uppercase tracking-widest w-full py-4 rounded-sm"
                            />
                        </div>
                    </div>

                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center p-6 bg-[#0A0A0E] border border-white/5 rounded-2xl max-w-3xl mx-auto shadow-lg">
                        <h3 className="text-xl font-bold text-white mb-3">Informations Légales & Droit de Rétractation</h3>
                        <p className="text-gray-400 text-sm leading-relaxed text-justify md:text-center">
                            Conformément à l'Article L221-18 du Code de la consommation, vous bénéficiez d'un délai de rétractation de 14 jours.
                            <strong> Cependant</strong>, l'Atelier des Magiciens fournissant un contenu numérique immédiatement accessible après paiement,
                            <strong className="text-white"> vous renoncez expressément à votre droit de rétractation</strong> en validant votre inscription pour accéder sans délai à la plateforme.
                            L'abonnement mensuel reste bien entendu <em>sans engagement</em> et peut être annulé à tout moment depuis votre QG.
                        </p>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <h3 className="text-3xl font-serif font-bold text-center text-white mb-12 uppercase tracking-wide">Questions Fréquentes</h3>

                    <div className="space-y-2">
                        <details className="group bg-transparent border-b border-white/10 [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
                            <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-white text-lg">
                                Que contient exactement le catalogue des Masterclass ?
                                <span className="transition duration-300 group-open:rotate-180 text-magic-royal">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed animate-in slide-in-from-top-1 duration-300">
                                Le catalogue comprend l'ensemble de nos vidéos de formation de haute qualité. Chaque Masterclass décortique des routines, des techniques poussées et la psychologie derrière les miracles, expliquées pas-à-pas par des magiciens professionnels.
                            </div>
                        </details>

                        <details className="group bg-transparent border-b border-white/10 [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
                            <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-white text-lg">
                                Puis-je résilier facilement ?
                                <span className="transition duration-300 group-open:rotate-180 text-magic-royal">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed animate-in slide-in-from-top-1 duration-300">
                                Le Pass Essentiel (Mensuel) est 100% sans engagement. Vous pouvez l'annuler d'un simple clic dans votre espace "Mon QG" à tout moment, sans avoir à nous contacter. Votre accès restera actif jusqu'à la fin de la période facturée.
                            </div>
                        </details>
                        
                        <details className="group bg-transparent border-b border-white/10 [&_summary::-webkit-details-marker]:hidden transition-all duration-300">
                            <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-white text-lg">
                                Est-ce que mon paiement est sécurisé ?
                                <span className="transition duration-300 group-open:rotate-180 text-magic-royal">
                                    <svg fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed animate-in slide-in-from-top-1 duration-300">
                                Oui. Nous utilisons Stripe, le leader mondial du paiement en ligne sécurisé. Nous n'avons jamais accès à vos coordonnées bancaires et vos informations sont chiffrées de bout en bout.
                            </div>
                        </details>
                    </div>
                </div>

                <p className="text-center text-gray-500 text-sm mt-16 font-medium">
                    Paiement 100% sécurisé via Stripe.
                </p>
            </div>
            <Footer space="adults" />
        </div>
    );
}
