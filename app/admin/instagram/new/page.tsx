"use client";

import { createInstagramPost } from "../../actions";
import Link from "next/link";
import { ArrowLeft, Save, Instagram } from "lucide-react";
import { useAdmin } from "../../AdminContext";

export default function NewInstagramPostPage() {
    const { audience } = useAdmin();
    const themeColor = audience === 'adults' ? 'bg-pink-600' : 'bg-pink-500';

    return (
        <div className={`min-h-screen ${audience === 'adults' ? 'bg-magic-bg' : 'bg-gray-900'} text-white p-8 transition-colors duration-500`}>
            <div className="max-w-2xl mx-auto">
                <header className="flex items-center gap-4 mb-8">
                    <Link href="/admin/instagram" className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ArrowLeft /></Link>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Instagram className="w-8 h-8 text-pink-500" />
                        Nouveau Post Instagram ({audience === 'adults' ? 'Adulte' : 'Enfant'})
                    </h1>
                </header>

                <div className={`bg-magic-card border ${audience === 'adults' ? 'border-white/10' : 'border-purple-500/20'} p-8 rounded-2xl`}>
                    <form action={createInstagramPost} className="space-y-6">
                        {/* Hidden Audience Field - Auto-filled by context */}
                        <input type="hidden" name="audience" value={audience} />

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Cible (Audience)</label>
                            <select name="audience_override" className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white text-gray-400">
                                <option value={audience}>Cible : Uniquement {audience === 'adults' ? 'Adultes' : 'Enfants'} (Par défaut)</option>
                                <option value="all">Tout le monde (Feed commun)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Image du Post (URL)</label>
                            <input type="url" name="image_url" required placeholder="https://..." className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                            <p className="text-xs text-gray-500 mt-1">Faites un screenshot de votre post, hébergez-le (ou prenez l'URL de l'image si publique) et collez le lien ici.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Lien vers le Post Instagram</label>
                            <input type="url" name="link_url" required placeholder="https://instagram.com/p/..." className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                        </div>

                        <div className="pt-4">
                            <button type="submit" className={`w-full ${themeColor} hover:opacity-90 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20`}>
                                <Save className="w-5 h-5" />
                                Ajouter au Feed
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
