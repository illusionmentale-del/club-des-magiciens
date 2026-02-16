import { createClient } from "@/lib/supabase/server";
import { Check } from "lucide-react";
// Client Component embedded for simplicity (or split if preferred)

export default async function PricingPage() {
    const supabase = await createClient();

    // Fetch Subscription Products
    const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("type", "subscription")
        .eq("is_active", true)
        .order("price", { ascending: true }); // Kids usually cheaper

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text font-sans py-20 px-4">
            <div className="max-w-5xl mx-auto space-y-16">

                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight font-serif text-brand-text">Rejoignez le Club</h1>
                    <p className="text-xl text-brand-text-muted max-w-2xl mx-auto">
                        Choisissez votre voie. Devenez un initié.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                    {/* KIDS PLAN */}
                    <div className="bg-brand-card border border-brand-purple/30 rounded-3xl p-8 flex flex-col relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Apprenti Magicien</h2>
                            <p className="text-brand-purple font-medium">L'Espace Kids</p>
                        </div>

                        <div className="mb-8">
                            <span className="text-5xl font-black text-white">4.99€</span>
                            <span className="text-brand-text-muted">/mois</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {['Grimoire secret inclus', 'Vidéos interactives', 'Sans engagement'].map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-brand-text-muted">
                                    <div className="w-5 h-5 rounded-full bg-brand-purple/20 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-brand-purple" />
                                    </div>
                                    {feat}
                                </li>
                            ))}
                        </ul>

                        {/* We need a Client Component for the Subscribe Button */}
                        <SubscribeButton
                            priceId={products?.find(p => p.space === 'kids')?.stripe_price_id}
                            productId={products?.find(p => p.space === 'kids')?.id}
                            space="kids"
                        />
                    </div>

                    {/* ADULTS PLAN */}
                    <div className="bg-brand-card border border-brand-gold/30 rounded-3xl p-8 flex flex-col relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Membre Initié</h2>
                            <p className="text-brand-gold font-medium">L'Espace Adultes</p>
                        </div>

                        <div className="mb-8">
                            <span className="text-5xl font-black text-white">9.99€</span>
                            <span className="text-brand-text-muted">/mois</span>
                        </div>

                        <ul className="space-y-4 mb-8 flex-1">
                            {['Programme "Le Club" inclus', '1 Contenu Fort / semaine', 'Accès Boutique & Upsells', 'Communauté Privée'].map((feat, i) => (
                                <li key={i} className="flex items-center gap-3 text-brand-text-muted">
                                    <div className="w-5 h-5 rounded-full bg-brand-gold/20 flex items-center justify-center">
                                        <Check className="w-3 h-3 text-brand-gold" />
                                    </div>
                                    {feat}
                                </li>
                            ))}
                        </ul>

                        <SubscribeButton
                            priceId={products?.find(p => p.space === 'adults')?.stripe_price_id}
                            productId={products?.find(p => p.space === 'adults')?.id}
                            space="adults"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Client Component embedded for simplicity (or split if preferred)
import SubscribeButton from "@/components/SubscribeButton";
