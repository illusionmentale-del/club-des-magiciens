"use client";

import { createClient } from "@/lib/supabase/client";
import { deleteNews, createNews } from "../actions";
import Link from "next/link";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useAdmin } from "../AdminContext";
import { useEffect, useState } from "react";

// Types
type NewsItem = {
    id: string;
    title: string;
    content: string;
    type: string;
    audience: string;
    created_at: string;
    link_url?: string;
    link_text?: string;
};

export default function AdminNewsPage() {
    const { audience } = useAdmin();
    const [news, setNews] = useState<NewsItem[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchNews = async () => {
            const { data } = await supabase.from("news").select("*").order("created_at", { ascending: false });
            if (data) setNews(data);
        };
        fetchNews();
    }, []);

    // Filter based on selected audience
    // Logic: 'all' content should probably be seen by both? 
    // Or does "Espace Adulte" mean "Manage Adult Content"? 
    // Usually: 
    // - Mode Adulte: See 'adults' AND 'all'
    // - Mode Kids: See 'kids' AND 'all'
    // Let's implement this overlap for visibility.
    const filteredNews = news.filter(item => {
        if (audience === 'adults') return item.audience === 'adults' || item.audience === 'all';
        if (audience === 'kids') return item.audience === 'kids' || item.audience === 'all';
        return true;
    });

    const themeColor = audience === 'adults' ? 'bg-magic-purple' : 'bg-purple-500';

    return (
        <div className={`min-h-screen ${audience === 'adults' ? 'bg-magic-bg' : 'bg-gray-900'} text-white p-8 transition-colors duration-500`}>
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ArrowLeft /></Link>
                        <div>
                            <h1 className="text-3xl font-bold">Gérer les Actualités</h1>
                            <div className={`text-sm px-2 py-0.5 rounded inline-block mt-1 uppercase font-bold tracking-wider ${audience === 'adults' ? 'bg-magic-purple/20 text-magic-purple' : 'bg-white/20 text-white'}`}>
                                Mode {audience === 'adults' ? 'Adulte' : 'Enfant'}
                            </div>
                        </div>
                    </div>
                </header>

                {/* CREATE FORM */}
                <div className={`bg-magic-card border ${audience === 'adults' ? 'border-white/10' : 'border-purple-500/30'} p-6 rounded-2xl mb-8`}>
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5" /> Publier une info ({audience === 'adults' ? 'Adulte' : 'Enfant'})</h2>
                    <form action={createNews} className="space-y-4">
                        {/* HIDDEN AUDIENCE INPUT - FORCE VALUE BASED ON CONTEXT */}
                        <input type="hidden" name="audience" value={audience} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="title" placeholder="Titre (ex: Nouveau Cours)" required className="bg-black/50 border border-white/10 rounded-lg p-3 w-full" />
                            <select name="type" className="bg-black/50 border border-white/10 rounded-lg p-3 w-full">
                                <option value="info">Information</option>
                                <option value="event">Évènement</option>
                                <option value="alert">Alerte</option>
                            </select>
                        </div>

                        {/* We hide the audience selector because the context decides */}
                        {/* But maybe user wants to post to 'all'? Let's allow 'all' or 'current' */}
                        <div>
                            <select name="audience_override" className="bg-black/50 border border-white/10 rounded-lg p-3 w-full text-gray-400">
                                <option value={audience}>Cible : Uniquement {audience === 'adults' ? 'Adultes' : 'Enfants'} (Par défaut)</option>
                                <option value="all">Visibilité : Tout le monde (Adultes + Enfants)</option>
                            </select>
                        </div>

                        <textarea name="content" placeholder="Contenu du message..." rows={3} className="bg-black/50 border border-white/10 rounded-lg p-3 w-full" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="link_text" placeholder="Texte du bouton (Optionnel)" className="bg-black/50 border border-white/10 rounded-lg p-3 w-full" />
                            <input name="link_url" placeholder="Lien URL (Optionnel)" className="bg-black/50 border border-white/10 rounded-lg p-3 w-full" />
                        </div>
                        <button type="submit" className={`w-full ${themeColor} hover:opacity-90 text-white font-bold py-3 rounded-xl transition-colors`}>
                            Publier
                        </button>
                    </form>
                </div>

                {/* LIST */}
                <div className="space-y-4">
                    {filteredNews.map((item) => (
                        <div key={item.id} className="bg-magic-card border border-white/5 p-4 rounded-xl flex items-center justify-between group">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'event' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {item.type}
                                    </span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full border border-white/10 ${item.audience === 'kids' ? 'text-purple-400' : item.audience === 'all' ? 'text-yellow-400' : 'text-gray-400'}`}>
                                        {item.audience === 'kids' ? 'Enfants' : item.audience === 'all' ? 'Tout le monde' : 'Adultes'}
                                    </span>
                                    <span className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span>
                                </div>
                                <h3 className="font-bold">{item.title}</h3>
                                <p className="text-sm text-gray-400 line-clamp-1">{item.content}</p>
                            </div>
                            <form action={deleteNews.bind(null, item.id)}>
                                <button className="p-2 text-gray-500 hover:text-red-500 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    ))}
                    {filteredNews.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            Aucune actualité pour l'espace <span className="font-bold">{audience === 'adults' ? 'Adulte' : 'Enfant'}</span>.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
