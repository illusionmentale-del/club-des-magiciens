"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, ShoppingCart } from "lucide-react";
import { createClient } from '@/lib/supabase/client';
import { SpaceType } from "./CourseSelector";

interface ProductSelectorProps {
    space: SpaceType;
    onSelect: (productId: string | null) => void;
}

export function ProductSelector({ space, onSelect }: ProductSelectorProps) {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const supabase = createClient();
                let query = supabase
                    .from('products')
                    .select('id, title, description, price, thumbnail_url, space')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });
                
                if (space !== 'all') {
                    // Si on cible explicitement adulte ou enfant, filtrer (Optionnel : si 'all', récupérer tout)
                    query = query.eq('space', space);
                }

                const { data, error } = await query;

                if (error) throw error;
                if (data) setProducts(data);
            } catch (e) {
                console.error("Erreur chargement produits:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [space]);

    const filteredProducts = products.filter(p => 
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (id: string) => {
        if (selectedId === id) {
            setSelectedId(null);
            onSelect(null);
        } else {
            setSelectedId(id);
            onSelect(id);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8 border border-white/5 rounded-2xl bg-black/20"><Loader2 className="w-6 h-6 animate-spin text-brand-cyan" /></div>;
    }

    return (
        <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5 shadow-inner">
            <h3 className="font-bold text-sm text-brand-cyan uppercase tracking-widest flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" /> Sélectionner un Produit Boutique
            </h3>
            
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input 
                    type="text"
                    placeholder="Rechercher par titre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-cyan/50"
                />
            </div>

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredProducts.map(product => (
                    <button
                        key={product.id}
                        type="button"
                        onClick={() => handleSelect(product.id)}
                        className={`flex items-center gap-4 p-3 rounded-xl border text-left transition-all ${
                            selectedId === product.id
                                ? 'bg-brand-cyan/10 border-brand-cyan/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                        }`}
                    >
                        {product.thumbnail_url ? (
                            <img src={product.thumbnail_url} alt="" className="w-16 h-12 object-cover rounded-lg shrink-0" />
                        ) : (
                            <div className="w-16 h-12 bg-black/50 rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                                <ShoppingCart className="w-5 h-5 text-white/30" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <p className={`text-sm font-bold truncate ${selectedId === product.id ? 'text-brand-cyan' : 'text-white'}`}>{product.title}</p>
                                <span className="text-xs font-bold text-brand-cyan bg-brand-cyan/10 px-2 py-0.5 rounded-md ml-2 shrink-0 border border-brand-cyan/20 whitespace-nowrap">{product.price} €</span>
                            </div>
                            <p className="text-xs text-brand-text-muted truncate mt-0.5">{product.description || "Aucune description."}</p>
                        </div>
                        {selectedId === product.id && (
                            <div className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-brand-cyan"></div>
                            </div>
                        )}
                    </button>
                ))}
                
                {filteredProducts.length === 0 && (
                    <p className="text-center text-sm text-white/50 py-4">Aucun résultat trouvé.</p>
                )}
            </div>
        </div>
    );
}
