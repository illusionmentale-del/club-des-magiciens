"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Plus, Trash2, CheckCircle, XCircle, Tag, Euro } from "lucide-react";
import { deleteProduct, toggleProductStatus } from "./actions";
import { useAdmin } from "../AdminContext";
import { useEffect, useState } from "react";
import Image from "next/image";

// Types
type Product = {
    id: string;
    title: string;
    description?: string;
    price: number;
    space: 'kids' | 'adults';
    type: 'subscription' | 'pack' | 'course' | 'coaching';
    stripe_price_id?: string;
    is_active: boolean;
    image_url?: string;
};

export default function AdminProductsPage() {
    const { audience } = useAdmin();
    const [products, setProducts] = useState<Product[]>([]);
    const supabase = createClient();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            const { data } = await supabase
                .from("products")
                .select("*")
                .order("created_at", { ascending: false });
            if (data) setProducts(data);
            setIsLoading(false);
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product => {
        if (audience === 'adults') return product.space === 'adults';
        if (audience === 'kids') return product.space === 'kids';
        return true;
    });

    const themeColor = audience === 'adults' ? 'bg-orange-600' : 'bg-purple-600';
    const borderColor = audience === 'adults' ? 'border-orange-500/30' : 'border-purple-500/30';

    return (
        <div className={`min-h-screen ${audience === 'adults' ? 'bg-black' : 'bg-[#0F1014]'} text-white p-8 transition-colors duration-500`}>
            <header className="flex items-center justify-between mb-8 max-w-6xl mx-auto">
                <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Retour au QG Admin
                </Link>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${audience === 'adults' ? 'bg-orange-500/20 text-orange-500' : 'bg-purple-500/20 text-purple-500'}`}>
                        <ShoppingBag className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Boutique ({audience === 'adults' ? 'Adulte' : 'Enfant'})</h1>
                        <div className={`text-sm px-2 py-0.5 rounded inline-block mt-1 uppercase font-bold tracking-wider ${audience === 'adults' ? 'bg-orange-500/20 text-orange-500' : 'bg-purple-600/20 text-purple-400'}`}>
                            Mode {audience === 'adults' ? 'Adulte' : 'Enfant'}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto space-y-8">
                {/* Actions */}
                <div className="flex justify-end">
                    <Link
                        href={`/admin/products/new?space=${audience}`}
                        className={`px-6 py-3 ${themeColor} hover:opacity-90 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-black/40`}
                    >
                        <Plus className="w-5 h-5" />
                        Ajouter un Produit {audience === 'kids' ? '(Kids)' : '(Adulte)'}
                    </Link>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className={`bg-white/5 border ${borderColor} rounded-2xl overflow-hidden group hover:bg-white/10 transition-colors flex flex-col`}>
                            {/* Image Header */}
                            <div className="h-40 bg-black/50 relative">
                                {product.image_url ? (
                                    <Image
                                        src={product.image_url}
                                        alt={product.title}
                                        fill
                                        className="object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-white/10">
                                        <ShoppingBag className="w-12 h-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${product.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                        {product.is_active ? 'Actif' : 'Inactif'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold line-clamp-1" title={product.title}>{product.title}</h3>
                                    <span className="font-mono text-lg font-bold text-green-400">
                                        {(product.price / 100).toFixed(2)}€
                                    </span>
                                </div>

                                <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>

                                <div className="space-y-2 text-xs text-gray-500 font-mono bg-black/20 p-3 rounded-lg border border-white/5 mb-4">
                                    <div className="flex items-center gap-2">
                                        <Tag className="w-3 h-3" />
                                        Type: <span className="text-white uppercase">{product.type}</span>
                                    </div>
                                    <div className="flex items-center gap-2 truncate" title={product.stripe_price_id}>
                                        <Euro className="w-3 h-3" />
                                        ID: <span className="text-blue-400 select-all">{product.stripe_price_id || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mt-auto pt-4 border-t border-white/5">
                                    <form action={toggleProductStatus.bind(null, product.id, product.is_active)} className="flex-1">
                                        <button className={`w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 ${product.is_active ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 hover:bg-green-500/20'}`}>
                                            {product.is_active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                                            {product.is_active ? 'Désactiver' : 'Activer'}
                                        </button>
                                    </form>

                                    <form action={deleteProduct.bind(null, product.id)}>
                                        <button
                                            className="p-2 bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            onClick={(e) => {
                                                if (!confirm("Voulez-vous vraiment supprimer ce produit ? Cela ne remboursera pas les clients existants.")) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredProducts.length === 0 && !isLoading && (
                        <div className="col-span-full text-center text-gray-500 py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                            Aucun produit dans le catalogue <span className="font-bold">{audience === 'adults' ? 'Adulte' : 'Kid'}</span>.
                            <br />Cliquez sur "Ajouter" pour commencer.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
