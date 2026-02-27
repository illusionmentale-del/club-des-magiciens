import { createClient } from "@/lib/supabase/server";
import { Check, Sparkles, Gift, Star, PlayCircle, ShoppingBag, BookOpen, ShieldCheck, Users } from "lucide-react";
import SubscribeButton from "@/components/SubscribeButton";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: "Rejoindre le Club Kids | Tarifs",
    description: "Deviens un véritable petit magicien avec nos abonnements Mensuel et Annuel."
}

export default async function KidsPricingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch Subscription Products specifically for kids space
    // We expect two active products for kids: one monthly, one yearly
    // Since we don't have explicit monthly/yearly flags, we'll sort by price
    const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("type", "subscription")
        .eq("space", "kids")
        .eq("is_active", true)
        .order("price", { ascending: true });

    // Deduce Monthly vs Yearly by price order
    const monthlyProduct = products && products.length > 0 ? products[0] : null;
    const yearlyProduct = products && products.length > 1 ? products[1] : null;

    // Fetch total active users count for social proof
    const { count } = await supabase
        .from("profiles")
        .select("*", { count: 'exact', head: true });

    // Fallback to 15 if count fails for some reason
    const totalUsers = count || 15;

    return (
        <div className="min-h-screen bg-[#050507] text-white font-sans selection:bg-brand-purple/30 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen z-0 animate-pulse-slow"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-pink-600/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen z-0"></div>

            {/* Simple Header */}
            <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 transform group-hover:scale-110 transition-all">
                        <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <span className="font-black text-xl tracking-tight uppercase">Le Club des <span className="text-brand-purple">Petits Magiciens</span></span>
                </Link>
                {user ? (
                    <Link href="/kids" className="text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors backdrop-blur-md">
                        Mon Espace
                    </Link>
                ) : (
                    <Link href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                        J'ai déjà un compte, m'identifier
                    </Link>
                )}
            </header>

            <div className="relative z-10 max-w-5xl mx-auto px-4 pt-32 pb-24">
                {/* Hero Section */}
                <div className="text-center space-y-6 mb-16">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-brand-purple/30 bg-gradient-to-r from-brand-purple/10 to-transparent text-brand-purple text-sm font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(139,92,246,0.2)] backdrop-blur-md">
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Le Club des Petits Magiciens
                        <Sparkles className="w-4 h-4 animate-pulse" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-tight">
                        L'école de magie n°1 <br className="hidden md:block" />
                        en ligne pour les <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-blue">8-14 ans</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
                        Rejoins le club. Découvre des tours incroyables, gagne des badges et épate ton entourage avec des illusions impossibles.
                    </p>
                </div>

                {/* Video Teaser Block */}
                <section className="relative z-20 mb-16 max-w-4xl mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-3xl opacity-30 blur-lg pointer-events-none"></div>
                    <div className="relative bg-brand-card border border-brand-purple/30 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm aspect-video flex flex-col items-center justify-center group cursor-pointer hover:bg-brand-surface transition-colors">
                        {/* 
                            TODO: Remplacer ceci par le vrai lecteur Bunny Stream.
                            Pour l'instant, c'est un espace réservé visuellement attrayant.
                        */}
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.3)] mb-4">
                            <PlayCircle className="w-10 h-10 text-white fill-current ml-1" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-wider text-center px-4">Découvrez le Club en Vidéo</h3>
                        <p className="text-brand-purple-light font-medium mt-2">Appuie sur lecture !</p>
                    </div>

                </section>

                {/* Social Proof dynamique */}
                <div className="flex flex-col items-center justify-center mt-8 mb-16 relative z-10 w-full mx-auto animate-in slide-in-from-bottom-4 duration-700">
                    <div className="flex -space-x-4 mb-4">
                        {/* Fake avatars for social proof */}
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="w-12 h-12 rounded-full border-2 border-brand-bg bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center shadow-lg overflow-hidden relative">
                                <img
                                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=magic${i}&backgroundColor=transparent`}
                                    alt="Membre du club"
                                    className="object-cover w-full h-full"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="text-lg font-bold text-gray-200 text-center max-w-md bg-white/5 border border-white/10 px-6 py-3 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.15)] flex items-center gap-2">
                        <Star className="w-5 h-5 text-brand-gold fill-current" />
                        Rejoins déjà plus de <strong className="text-white text-xl mx-1">{totalUsers > 15 ? totalUsers : 15}</strong> petits magiciens !
                    </div>
                </div>

                {/* Subscriptions Grid */}
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-stretch max-w-5xl mx-auto pt-20">

                    {/* MONTHLY PLAN */}
                    <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-8 md:p-10 flex flex-col relative overflow-hidden backdrop-blur-xl transition-all hover:bg-white/[0.05] mt-8 md:mt-12 shadow-2xl hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] group">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-white mb-2">Abonnement Mensuel</h2>
                            <p className="text-gray-400 font-medium mb-4">Idéal pour découvrir le club à son rythme.</p>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-300 w-fit">
                                <ShieldCheck className="w-4 h-4 text-brand-blue" />
                                100% Sans Engagement
                            </div>
                        </div>

                        <div className="mb-8 flex flex-col">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl md:text-6xl font-black text-white">{monthlyProduct?.price_label || "9,99€"}</span>
                                <span className="text-gray-400 font-bold text-lg">/mois</span>
                            </div>
                            <span className="text-sm text-gray-500 mt-2 font-medium">Annulable en un clic depuis ton espace.</span>
                        </div>

                        <ul className="space-y-6 mb-8 flex-1">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 shadow-inner border border-white/10 group-hover:bg-brand-purple/10 transition-colors">
                                    <BookOpen className="w-5 h-5 text-brand-purple-light" />
                                </div>
                                <div className="mt-0.5">
                                    <strong className="block text-white mb-1">La Formation :</strong>
                                    <span className="text-gray-400 text-sm leading-relaxed">Découvre l'apprentissage d'un nouveau tour de magie chaque semaine.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 shadow-inner border border-white/10 group-hover:bg-brand-blue/10 transition-colors">
                                    <PlayCircle className="w-5 h-5 text-brand-blue-light" />
                                </div>
                                <div className="mt-0.5">
                                    <strong className="block text-white mb-1">Les Masterclass :</strong>
                                    <span className="text-gray-400 text-sm leading-relaxed">Tous les mois des vidéos sur des sujets approfondis pour t'aider à mieux progresser.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 shadow-inner border border-white/10 group-hover:bg-brand-purple/10 transition-colors">
                                    <ShoppingBag className="w-5 h-5 text-brand-purple-light" />
                                </div>
                                <div className="mt-0.5">
                                    <strong className="block text-white mb-1">La Boutique Privée :</strong>
                                    <span className="text-gray-400 text-sm leading-relaxed">Achète des tours de magie physiques et des packs vidéos exclusifs au Club.</span>
                                </div>
                            </li>
                        </ul>

                        <SubscribeButton
                            priceId={monthlyProduct?.stripe_price_id}
                            productId={monthlyProduct?.id}
                            space="kids"
                            userLoggedIn={!!user}
                            buttonText="Commencer l'Aventure"
                            className="bg-white/10 hover:bg-white/20 text-white border border-white/10"
                        />
                    </div>

                    {/* YEARLY PLAN (HIGHLIGHTED) */}
                    <div className="bg-gradient-to-br from-[#1A0B2E] to-[#14081E] border border-brand-purple/40 rounded-[2rem] p-8 flex flex-col relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(168,85,247,0.4)] transform md:-translate-y-4 ring-1 ring-brand-purple/30">
                        {/* Inner subtle glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-[2rem]"></div>

                        {/* Glow effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-purple/30 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        {/* Badge */}
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-brand-purple to-pink-500 text-white font-black text-xs uppercase tracking-widest py-2 px-6 rounded-bl-2xl">
                            Le Choix des Maîtres
                        </div>

                        <div className="mb-6 relative z-10 flex flex-col">
                            <h2 className="text-2xl font-black text-white mb-2">Abonnement Annuel</h2>
                            <p className="text-brand-purple-light font-medium flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                +2 mois offerts vs Mensuel
                            </p>
                        </div>

                        <div className="mb-8 relative z-10 flex flex-col">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl font-black text-white">{yearlyProduct?.price_label || "99,99€"}</span>
                                <span className="text-gray-300 font-bold">/an</span>
                            </div>
                            <span className="text-sm font-bold text-pink-400 mt-1 bg-pink-500/10 w-fit px-2 py-0.5 rounded border border-pink-500/20">
                                Revient à seulement 8,33€/mois !
                            </span>
                        </div>

                        <ul className="space-y-6 mb-8 flex-1 relative z-10">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center shrink-0 shadow-lg shadow-brand-purple/50">
                                    <BookOpen className="w-5 h-5 text-white" />
                                </div>
                                <div className="mt-0.5">
                                    <strong className="block text-white mb-1">La Formation :</strong>
                                    <span className="text-gray-300 text-sm leading-relaxed">Découvre l'apprentissage d'un nouveau tour de magie chaque semaine.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center shrink-0 shadow-lg shadow-brand-purple/50">
                                    <PlayCircle className="w-5 h-5 text-white" />
                                </div>
                                <div className="mt-0.5">
                                    <strong className="block text-white mb-1">Les Masterclass :</strong>
                                    <span className="text-gray-300 text-sm leading-relaxed">Tous les mois des vidéos sur des sujets approfondis pour t'aider à mieux progresser.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center shrink-0 shadow-lg shadow-brand-purple/50">
                                    <ShoppingBag className="w-5 h-5 text-white" />
                                </div>
                                <div className="mt-0.5">
                                    <strong className="block text-white mb-1">La Boutique Privée :</strong>
                                    <span className="text-gray-300 text-sm leading-relaxed">Achète des tours de magie physiques et des packs exclusifs au Club.</span>
                                </div>
                            </li>

                            {/* Premium Bonus Callout */}
                            <li className="flex items-start gap-4 text-brand-purple-light font-black mt-8 bg-gradient-to-r from-brand-purple/20 to-brand-blue/20 p-5 rounded-2xl border border-brand-purple/30 shadow-[0_10px_30px_rgba(139,92,246,0.1)] relative">
                                <div className="absolute top-0 right-0 w-full h-full bg-[url('/noise.png')] opacity-20 pointer-events-none mix-blend-overlay rounded-2xl"></div>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-brand-purple to-brand-blue flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(139,92,246,0.5)] z-10">
                                    <Gift className="w-5 h-5 text-white" />
                                </div>
                                <div className="z-10">
                                    <span className="block text-white mb-1 text-sm tracking-widest uppercase">Cadeau Exclusif :</span>
                                    Débloque 3 Packs Bonus Vidéo de la Boutique automatiquement !
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className="text-xs font-bold text-white/50 line-through">Valeur : 150€</span>
                                        <span className="text-sm font-black text-brand-blue-light uppercase tracking-widest bg-brand-blue/10 px-2 py-1 rounded">100% GRATUIT</span>
                                    </div>
                                </div>
                            </li>
                        </ul>

                        <div className="relative z-10 mt-4">
                            <SubscribeButton
                                priceId={yearlyProduct?.stripe_price_id}
                                productId={yearlyProduct?.id}
                                space="kids"
                                userLoggedIn={!!user}
                                buttonText="Devenir l'Ultime Magicien"
                                className="bg-gradient-to-r from-brand-purple to-brand-blue hover:from-purple-500 hover:to-blue-500 text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] border border-brand-purple/50"
                            />
                        </div>
                    </div>

                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center p-6 bg-brand-surface/50 border border-brand-purple/20 rounded-2xl max-w-3xl mx-auto shadow-lg">
                        <h3 className="text-xl font-bold text-white mb-3">Informations Légales & Droit de Rétractation</h3>
                        <p className="text-brand-text-muted text-sm leading-relaxed text-justify md:text-center">
                            Conformément à l'Article L221-18 du Code de la consommation, vous bénéficiez d'un délai de rétractation de 14 jours.
                            <strong> Cependant</strong>, le Club des Magiciens fournissant un contenu numérique immédiatement accessible après paiement,
                            <strong className="text-white"> vous renoncez expressément à votre droit de rétractation</strong> en validant votre inscription pour accéder sans délai à la plateforme.
                            L'abonnement mensuel reste bien entendu <em>sans engagement</em> et peut être annulé à tout moment depuis votre espace.
                        </p>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <h3 className="text-3xl font-black text-center text-white mb-8">Questions Fréquentes</h3>

                    <div className="space-y-4">
                        <details className="group bg-[#0A0A0E] border border-white/5 rounded-2xl [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:border-brand-purple/30 ring-1 ring-white/5 hover:ring-white/10">
                            <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-white text-lg">
                                Mon enfant a-t-il besoin de matériel spécifique ?
                                <span className="transition duration-300 group-open:rotate-180 text-brand-purple">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed animate-in slide-in-from-top-1 duration-300">
                                Absolument pas ! 90% des tours de l'académie utilisent des objets du quotidien (pièces, élastiques, cartes classiques, stylos). C'est le principe : apprendre à faire de la magie n'importe quand, n'importe où.
                            </div>
                        </details>

                        <details className="group bg-[#0A0A0E] border border-white/5 rounded-2xl [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:border-brand-purple/30 ring-1 ring-white/5 hover:ring-white/10">
                            <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-white text-lg">
                                Est-ce compliqué d'annuler si ça ne lui plaît plus ?
                                <span className="transition duration-300 group-open:rotate-180 text-brand-purple">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed animate-in slide-in-from-top-1 duration-300">
                                Non, c'est ultra simple. Sur l'abonnement mensuel, tu es 100% libre. Un bouton "Gérer mon abonnement" dans l'espace parent te permet d'annuler en un clic, sans avoir à nous contacter.
                            </div>
                        </details>

                        <details className="group bg-[#0A0A0E] border border-white/5 rounded-2xl [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:border-brand-purple/30 ring-1 ring-white/5 hover:ring-white/10">
                            <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-white text-lg">
                                Est-ce que mon paiement est sécurisé ?
                                <span className="transition duration-300 group-open:rotate-180 text-brand-purple">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed animate-in slide-in-from-top-1 duration-300">
                                Oui. Nous utilisons Stripe, le leader mondial du paiement en ligne (utilisé par Amazon, Google, etc.). Nous n'avons jamais accès à tes coordonnées bancaires.
                            </div>
                        </details>
                    </div>
                </div>

                <p className="text-center text-gray-500 text-sm mt-16 font-medium">
                    Paiement 100% sécurisé via Stripe. Annulable à tout moment en 1 clic.
                </p>
            </div>
            <Footer />
        </div>
    );
}
