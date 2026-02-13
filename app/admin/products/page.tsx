import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "../actions";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";

export default async function AdminProductsPage() {
    const supabase = await createClient();
    const { data: products } = await supabase.from("products").select("*").order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8">
            <div className="max-w-5xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ArrowLeft /></Link>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <ShoppingBag className="w-8 h-8 text-amber-500" />
                            Gestion Boutique
                        </h1>
                    </div>
                    <Link href="/admin/products/new" className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors">
                        <Plus className="w-4 h-4" />
                        Ajouter un Produit
                    </Link>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products?.map((product) => (
                        <div key={product.id} className="bg-magic-card border border-white/10 rounded-2xl overflow-hidden group">
                            <div className="aspect-square relative bg-black/50">
                                {product.image_url ? (
                                    <Image src={product.image_url} alt={product.title} fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">Pas d'image</div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/70 px-2 py-1 rounded text-xs font-bold text-amber-400 border border-amber-500/30">
                                    {product.price || "Gratuit"}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 truncate">{product.title}</h3>
                                <a href={product.link_url} target="_blank" className="text-xs text-blue-400 hover:underline mb-4 block truncate">
                                    {product.link_url}
                                </a>
                                <form action={deleteProduct.bind(null, product.id)}>
                                    <button className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-bold">
                                        <Trash2 className="w-4 h-4" /> Supprimer
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                    {(!products || products.length === 0) && (
                        <div className="col-span-full text-center py-12 text-gray-500 italic">
                            Aucun produit dans la boutique.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
