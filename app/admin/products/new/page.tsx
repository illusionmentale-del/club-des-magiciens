"use client";

import { createProduct } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

export default function NewProductPage() {
    return (
        <div className="min-h-screen bg-magic-bg text-white p-8">
            <div className="max-w-2xl mx-auto">
                <header className="flex items-center gap-4 mb-8">
                    <Link href="/admin/products" className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ArrowLeft /></Link>
                    <h1 className="text-3xl font-bold">Nouveau Produit</h1>
                </header>

                <div className="bg-magic-card border border-white/10 p-8 rounded-2xl">
                    <form action={createProduct} className="space-y-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Titre du produit</label>
                            <input type="text" name="title" required placeholder="Ex: Jeu de Cartes Bicycle" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Prix (Texte affiché)</label>
                            <input type="text" name="price" placeholder="Ex: 15€" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Lien de l'image (URL)</label>
                            <input type="url" name="image_url" placeholder="https://..." className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                            <p className="text-xs text-gray-500 mt-1">Collez l'URL d'une image hébergée (ou clic droit &gt; copier l'adresse de l'image sur Google).</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Lien de paiement (Destination)</label>
                            <input type="url" name="link_url" required placeholder="https://systeme.io/..." className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                                <Save className="w-5 h-5" />
                                Ajouter à la Boutique
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
