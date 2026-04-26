import { createClient } from "@/lib/supabase/server";
import { Check, Sparkles, Gift, Star, PlayCircle, ShoppingBag, BookOpen, ShieldCheck, Users } from "lucide-react";
import SubscribeButton from "@/components/SubscribeButton";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import AnimatedLink from "@/components/AnimatedLink";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Rejoindre le Club Kids | Tarifs",
    description: "Deviens un véritable petit magicien avec notre abonnement Mensuel."
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
        <div className="min-h-screen bg-brand-bg text-white font-sans selection:bg-brand-purple/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-purple/10 via-brand-bg to-brand-bg pointer-events-none z-0"></div>

            {/* Simple Header */}
            <header className="absolute top-0 w-full p-6 flex justify-between items-center z-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 transform group-hover:scale-110 transition-all">
                        <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                    </div>
                    <span className="font-black text-xl tracking-tight uppercase hidden sm:block">Le Club des <span className="text-brand-purple">Petits Magiciens</span></span>
                </Link>
                {user ? (
                    <div className="flex items-center gap-3">
                        <form action={signOutAction}>
                            <button type="submit" className="text-xs sm:text-sm font-bold text-gray-400 hover:text-white transition-colors">
                                Se déconnecter
                            </button>
                        </form>
                        <Link href="/kids" className="text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors backdrop-blur-md">
                            Mon Espace
                        </Link>
                    </div>
                ) : (
                    <AnimatedLink href="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">
                        J'ai déjà un compte, m'identifier
                    </AnimatedLink>
                )}
            </header>

            <div className="relative z-10 max-w-5xl mx-auto px-4 pt-32 pb-12 md:pb-24">
                {/* Hero Section */}
                <div className="text-center space-y-6 mb-16 relative">
                    <div className="relative z-10 inline-flex items-center gap-2 px-5 py-2 border border-brand-purple/30 bg-brand-purple/5 rounded-full text-brand-purple text-[11px] font-bold tracking-[0.2em] uppercase backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.15)] mb-4 cursor-default">
                        <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
                        Le Club des Petits Magiciens
                    </div>
                    
                    <h1 className="relative z-10 text-5xl md:text-7xl lg:text-[90px] font-bold tracking-tighter text-white leading-[1.05] pb-2 drop-shadow-sm">
                        Apprends la <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-purple-400 drop-shadow-[0_0_25px_rgba(168,85,247,0.3)]">Magie</span> ✨
                    </h1>
                    
                    <p className="relative z-10 text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-light leading-relaxed mt-6">
                        Chaque semaine, découvre de nouveaux tours et apprends de véritables secrets de magiciens dans une école en ligne ludique et sécurisée.
                    </p>
                </div>

                {/* Video Teaser Block */}
                <section className="relative z-20 mb-16 max-w-4xl mx-auto">
                    <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm aspect-video flex flex-col items-center justify-center group cursor-pointer hover:border-brand-purple/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all">
                        {/* 
                            TODO: Remplacer ceci par le vrai lecteur Bunny Stream.
                            Pour l'instant, c'est un espace réservé visuellement attrayant.
                        */}
                        <div className="w-20 h-20 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center border border-brand-purple/50 group-hover:bg-brand-purple/20 transition-all z-20 shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-4">
                            <PlayCircle className="w-10 h-10 text-white fill-current ml-1" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase tracking-wider text-center px-4 z-20">Découvrez le Club en Vidéo</h3>
                        <p className="text-brand-purple-light font-medium mt-2">Appuie sur lecture !</p>
                    </div>

                </section>

                {/* Social Proof dynamique */}
                <div className="flex flex-col items-center justify-center mt-8 mb-8 relative z-10 w-full mx-auto animate-in slide-in-from-bottom-4 duration-700">
                    <div className="relative group cursor-pointer inline-block">
                        <div className="relative text-sm md:text-base font-bold text-gray-200 text-center bg-[#0a0a0a] border-y border-brand-purple/30 px-12 py-4 shadow-lg flex items-center justify-center gap-4">
                            <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />
                            <span>
                                Rejoins déjà plus de <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-300 text-xl font-black mx-1 drop-shadow-[0_0_10px_rgba(252,211,77,0.5)]">100</span> apprentis magiciens !
                            </span>
                            <Sparkles className="w-5 h-5 text-brand-gold animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Subscriptions */}
                <div className="relative z-10 w-full max-w-md mx-auto pt-4">

                    {/* MONTHLY PLAN */}
                    <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 md:p-10 flex flex-col relative overflow-hidden transition-all hover:bg-[#0a0a0a] hover:border-brand-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] mt-8 md:mt-12 group">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-white mb-3">Abonnement Mensuel</h2>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-gray-300 w-fit">
                                <ShieldCheck className="w-4 h-4 text-brand-blue" />
                                100% Sans Engagement
                            </div>
                        </div>

                        <div className="mb-8 flex flex-col">
                            <div className="flex items-baseline gap-2">
                                <span className="text-5xl md:text-6xl font-black text-white">{monthlyProduct?.price_label || "4,99€"}</span>
                                <span className="text-gray-400 font-bold text-lg">/mois</span>
                            </div>
                            <span className="text-sm text-gray-500 mt-2 font-medium">Annulable à tout moment sur simple demande par mail.</span>
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
                                    <strong className="block text-white mb-1">Les Ateliers :</strong>
                                    <span className="text-gray-400 text-sm leading-relaxed">Tous les mois des vidéos sur des sujets approfondis pour t'aider à mieux progresser.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 shadow-inner border border-white/10 group-hover:bg-brand-purple/10 transition-colors">
                                    <ShoppingBag className="w-5 h-5 text-brand-purple-light" />
                                </div>
                                <div className="mt-0.5">
                                    <strong className="block text-white mb-1">La Boutique Privée :</strong>
                                    <span className="text-gray-400 text-sm leading-relaxed">Accède à une boutique privée avec des vidéos et des articles sélectionnés à un tarif préférentiel.</span>
                                </div>
                            </li>
                        </ul>

                        <SubscribeButton
                            priceId={monthlyProduct?.stripe_price_id}
                            productId={monthlyProduct?.id}
                            space="kids"
                            userLoggedIn={!!user}
                            buttonText="Commencer l'Aventure"
                            className="bg-transparent hover:bg-white/5 text-white border border-white/20 uppercase tracking-widest text-sm font-bold py-4 rounded-xl"
                        />
                    </div>

                </div>

                <div className="mt-16 text-center">
                    <div className="inline-flex flex-col items-center justify-center p-6 bg-[#0a0a0a] border border-white/10 rounded-2xl max-w-3xl mx-auto shadow-lg">
                        <h3 className="text-xl font-bold text-white mb-3">Informations Légales & Droit de Rétractation</h3>
                        <p className="text-gray-400 text-sm leading-relaxed text-justify md:text-center">
                            Conformément à l'Article L221-18 du Code de la consommation, vous bénéficiez d'un délai de rétractation de 14 jours.
                            <strong> Cependant</strong>, le Club des Magiciens fournissant un contenu numérique immédiatement accessible après paiement,
                            <strong className="text-white"> vous renoncez expressément à votre droit de rétractation</strong> en validant votre inscription pour accéder sans délai à la plateforme.
                            L'abonnement mensuel reste bien entendu <em>sans engagement</em> et peut être annulé à tout moment sur simple demande par mail.
                        </p>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mt-24 max-w-3xl mx-auto">
                    <h3 className="text-3xl font-black text-center text-white mb-8">Questions Fréquentes</h3>

                    <div className="space-y-4">
                        <details className="group bg-[#0a0a0a] border border-white/10 rounded-2xl [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:border-brand-purple/50 hover:border-brand-purple/30">
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

                        <details className="group bg-[#0a0a0a] border border-white/10 rounded-2xl [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:border-brand-purple/50 hover:border-brand-purple/30">
                            <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-white text-lg">
                                Est-ce compliqué d'annuler si ça ne lui plaît plus ?
                                <span className="transition duration-300 group-open:rotate-180 text-brand-purple">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed animate-in slide-in-from-top-1 duration-300">
                                Non, c'est ultra simple. Sur l'abonnement mensuel, vous êtes 100% libre. Vous pouvez annuler à tout moment sur simple demande par mail, sans aucune justification.
                            </div>
                        </details>

                        <details className="group bg-[#0a0a0a] border border-white/10 rounded-2xl [&_summary::-webkit-details-marker]:hidden transition-all duration-300 open:border-brand-purple/50 hover:border-brand-purple/30">
                            <summary className="flex items-center justify-between p-6 font-bold cursor-pointer text-white text-lg">
                                Est-ce que mon paiement est sécurisé ?
                                <span className="transition duration-300 group-open:rotate-180 text-brand-purple">
                                    <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                </span>
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed animate-in slide-in-from-top-1 duration-300">
                                Oui. Nous utilisons Stripe, le leader mondial du paiement en ligne (utilisé par Amazon, Google, etc.). Nous n'avons jamais accès à vos coordonnées bancaires.
                            </div>
                        </details>
                    </div>
                </div>

                <p className="text-center text-gray-500 text-sm mt-16 font-medium">
                    Paiement 100% sécurisé via Stripe. Annulable à tout moment sur simple demande par mail.
                </p>

                <div className="w-full text-center mt-8 md:mt-12 pb-4 md:pb-12 relative z-10">
                    <a 
                        href="mailto:contact@clubdespetitsmagiciens.fr?subject=Question%20-%20Club%20des%20petits%20magiciens" 
                        className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                        Poser une question
                    </a>
                </div>
            </div>
            <Footer />
        </div>
    );
}
