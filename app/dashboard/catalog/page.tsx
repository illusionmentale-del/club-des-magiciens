import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AdultBoutiqueCard from "@/components/AdultBoutiqueCard";
import { ShoppingBag, Star } from "lucide-react";

export const metadata = {
    title: 'La Boutique | Club des Magiciens',
    description: 'Découvrez nos formations spécialisées et masterclasses en magie.',
};

export default async function CatalogPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
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
        <div className="min-h-screen bg-[#050507] text-white p-4 md:p-8 pb-32 font-sans relative selection:bg-magic-gold/30">
            {/* Ambient Background Lights */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-amber-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-magic-gold/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="max-w-6xl mx-auto relative z-10 space-y-12">

                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-magic-gold mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse text-magic-gold" />
                            <span className="text-xs font-bold uppercase tracking-widest text-magic-gold">Accès Premium Seulement</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-serif">
                            La <span className="text-magic-gold">Boutique</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg font-light max-w-2xl">
                            Découvrez des formations spécialisées, masterclasses et techniques secrètes pour faire passer votre magie au niveau supérieur.
                        </p>
                    </div>
                </header>

                {/* Shop Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products?.map((product) => (
                        <AdultBoutiqueCard
                            key={product.id}
                            product={product}
                            isPurchased={purchasedIds.has(product.id)}
                        />
                    ))}

                    {(!products || products.length === 0) && (
                        <div className="col-span-full bg-white/5 border border-white/5 p-12 rounded-3xl text-center flex flex-col items-center">
                            <ShoppingBag className="w-16 h-16 text-white/20 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-2">Le Catalogue est vide pour le moment</h3>
                            <p className="text-slate-400">Revenez plus tard pour découvrir de nouvelles formations exclusives.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
