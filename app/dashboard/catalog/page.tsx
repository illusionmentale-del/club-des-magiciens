import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProductCard from "@/components/ProductCard";

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
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Catalogue</h1>
                    <p className="text-gray-400">Découvrez nos formations spécialisées et masterclasses.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        isPurchased={purchasedIds.has(product.id)}
                        space="adults"
                    />
                ))}

                {(!products || products.length === 0) && (
                    <div className="col-span-full py-12 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                        Aucun produit disponible dans le catalogue pour le moment.
                    </div>
                )}
            </div>
        </div>
    );
}
