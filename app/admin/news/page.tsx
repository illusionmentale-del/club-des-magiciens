import { createClient } from "@/lib/supabase/server";
import { deleteNews, createNews } from "../actions";
import Link from "next/link";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

export default async function AdminNewsPage() {
    const supabase = await createClient();
    const { data: news } = await supabase.from("news").select("*").order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ArrowLeft /></Link>
                        <h1 className="text-3xl font-bold">Gérer les Actualités</h1>
                    </div>
                    {/* Trigger Modal or Navigate to New Page? Let's use details for Create inline */}
                </header>

                {/* CREATE FORM */}
                <div className="bg-magic-card border border-white/10 p-6 rounded-2xl mb-8">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5" /> Publier une info</h2>
                    <form action={createNews} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="title" placeholder="Titre (ex: Nouveau Cours)" required className="bg-black/50 border border-white/10 rounded-lg p-3 w-full" />
                            <select name="type" className="bg-black/50 border border-white/10 rounded-lg p-3 w-full">
                                <option value="info">Information</option>
                                <option value="event">Évènement</option>
                                <option value="alert">Alerte</option>
                            </select>
                        </div>
                        <div>
                            <select name="audience" className="bg-black/50 border border-white/10 rounded-lg p-3 w-full">
                                <option value="adults">Cible : Adultes</option>
                                <option value="kids">Cible : Enfants</option>
                                <option value="all">Cible : Tout le monde</option>
                            </select>
                        </div>
                        <textarea name="content" placeholder="Contenu du message..." rows={3} className="bg-black/50 border border-white/10 rounded-lg p-3 w-full" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="link_text" placeholder="Texte du bouton (Optionnel)" className="bg-black/50 border border-white/10 rounded-lg p-3 w-full" />
                            <input name="link_url" placeholder="Lien URL (Optionnel)" className="bg-black/50 border border-white/10 rounded-lg p-3 w-full" />
                        </div>
                        <button type="submit" className="w-full bg-magic-purple hover:bg-magic-purple/80 text-white font-bold py-3 rounded-xl transition-colors">
                            Publier
                        </button>
                    </form>
                </div>

                {/* LIST */}
                <div className="space-y-4">
                    {news?.map((item) => (
                        <div key={item.id} className="bg-magic-card border border-white/5 p-4 rounded-xl flex items-center justify-between group">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'event' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {item.type}
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
                    {news?.length === 0 && <p className="text-gray-500 text-center">Aucune actualité.</p>}
                </div>
            </div>
        </div>
    );
}
