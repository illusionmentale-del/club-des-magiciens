"use client";

import { updateLiveStatus } from "../../../actions";
import Link from "next/link";
import { ArrowLeft, Save, Video } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AddReplayPage() {
    const { id } = useParams();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);

    // Fetch live details just to show title
    useState(() => {
        const fetchLive = async () => {
            const supabase = createClient();
            const { data } = await supabase.from("lives").select("title").eq("id", id).single();
            if (data) setTitle(data.title);
            setLoading(false);
        };
        fetchLive();
    });

    if (loading) return <div className="min-h-screen bg-black text-white p-8">Chargement...</div>;

    const handleSubmit = async (formData: FormData) => {
        const vimeoId = formData.get("vimeo_id") as string;
        // Call action to update status to 'terminé' and set vimeo ID
        await updateLiveStatus(id as string, 'terminé', vimeoId);
        router.push("/admin/lives");
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
            <div className="w-full max-w-lg">
                <Link href="/admin/lives" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                    Retour
                </Link>

                <div className="bg-magic-card border border-white/10 p-8 rounded-2xl">
                    <h1 className="text-2xl font-bold mb-2 text-white">Ajouter un Replay</h1>
                    <p className="text-gray-400 mb-8">Pour le live : <span className="text-magic-purple">{title}</span></p>

                    <form action={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">ID Vidéo Vimeo</label>
                            <div className="relative">
                                <span className="absolute left-4 top-4 text-gray-500 select-none">vimeo.com/</span>
                                <input
                                    name="vimeo_id"
                                    required
                                    placeholder="123456789"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-28 text-white placeholder-gray-600 focus:border-magic-purple focus:ring-1 focus:ring-magic-purple outline-none transition-colors"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Une fois ajouté, le live passera en statut "Terminé" et le bouton "Revoir le Live" apparaîtra pour les membres.
                            </p>
                        </div>

                        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 mt-8">
                            <Save className="w-5 h-5" />
                            Publier le Replay
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
