import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdultBoutiqueCard from "@/components/AdultBoutiqueCard";
import BientotDispo from "@/components/dashboard/BientotDispo";
import { ShoppingBag, Star } from "lucide-react";
import BackButton from "@/components/BackButton";
import { FadeInUp } from "@/components/adults/MotionWrapper";

export const metadata = {
    title: 'La Boutique | L\'Atelier des Magiciens',
    description: 'Découvrez nos formations spécialisées et masterclasses en magie.',
};

export default async function CatalogPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if the catalog is enabled in settings
    const { data: setting } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'enable_adults_catalog')
        .single();

    if (setting?.value === 'false') {
        return <BientotDispo
            title="La Boutique ouvre bientôt"
            description="Le catalogue premium est actuellement en cours de préparation. De nouvelles ressources exclusives, masterclass et routines avancées y seront dévoilées très prochainement !"
        />;
    }

    // 1. Fetch Products (Packs & Courses for Adults)
    const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("space", "adults")
        .in("type", ["pack", "course"])
        .eq("is_active", true)
        .order("created_at", { ascending: false });

    // 2. Fetch User Purchases to check ownership
    const { data: purchases } = await supabase
        .from("purchases")
        .select("product_id")
        .eq("user_id", user.id)
        .eq("status", "paid");

    const purchasedIds = new Set(purchases?.map(p => p.product_id) || []);

    return (
        <div className="min-h-screen bg-[#000000] text-[#f5f5f7] p-4 md:p-8 pb-32 font-sans relative selection:bg-white/30">

            <div className="max-w-6xl mx-auto relative z-10">
                <BackButton />
                {/* Header */}
                <FadeInUp delay={0.1}>
                    <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 mb-12">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-[#86868b] mb-2">
                                <Star className="w-5 h-5 fill-current text-[#f5f5f7]" />
                                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Accès Premium Seulement</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-semibold text-[#f5f5f7] tracking-tight mt-2">
                                La Boutique
                            </h1>
                            <p className="text-[#86868b] mt-3 text-xl font-light max-w-2xl">
                                Découvrez des formations spécialisées, masterclasses et techniques secrètes pour faire passer votre magie au niveau supérieur.
                            </p>
                        </div>
                    </header>
                </FadeInUp>

                {/* Shop Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products?.map((product, index) => (
                        <FadeInUp key={product.id} delay={0.2 + (index * 0.1)}>
                            <AdultBoutiqueCard
                                product={product}
                                isPurchased={purchasedIds.has(product.id)}
                            />
                        </FadeInUp>
                    ))}

                    {(!products || products.length === 0) && (
                        <FadeInUp delay={0.2}>
                            <div className="col-span-full bg-[#1c1c1e] border border-white/5 p-16 rounded-[32px] text-center flex flex-col items-center shadow-xl">
                                <ShoppingBag className="w-16 h-16 text-[#86868b] mb-4 opacity-50" />
                                <h3 className="text-2xl font-semibold text-[#f5f5f7] mb-2 tracking-tight">Le Catalogue est vide pour le moment</h3>
                                <p className="text-[#86868b] font-light">Revenez plus tard pour découvrir de nouvelles formations exclusives.</p>
                            </div>
                        </FadeInUp>
                    )}
                </div>
            </div>
        </div>
    );
}
