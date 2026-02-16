"use client";

import { createClient } from "@/lib/supabase/client";
import { deleteInstagramPost } from "../actions";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Instagram } from "lucide-react";
import Image from "next/image";
import { useAdmin } from "../AdminContext";
import { useEffect, useState } from "react";

// Types
type InstagramPost = {
    id: string;
    image_url: string;
    link_url?: string;
    caption?: string;
    audience: string;
    created_at: string;
};

export default function AdminInstagramPage() {
    const { audience } = useAdmin();
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const supabase = createClient();

    useEffect(() => {
        const fetchPosts = async () => {
            const { data } = await supabase.from("instagram_posts").select("*").order("created_at", { ascending: false });
            if (data) setPosts(data);
        };
        fetchPosts();
    }, []);

    const filteredPosts = posts.filter(post => {
        if (audience === 'adults') return post.audience === 'adults' || post.audience === 'all';
        if (audience === 'kids') return post.audience === 'kids' || post.audience === 'all';
        return true;
    });

    const themeColor = audience === 'adults' ? 'bg-pink-600' : 'bg-pink-500';

    return (
        <div className={`min-h-screen ${audience === 'adults' ? 'bg-magic-bg' : 'bg-gray-900'} text-white p-8 transition-colors duration-500`}>
            <div className="max-w-5xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ArrowLeft /></Link>
                        <div>
                            <h1 className="text-3xl font-bold flex items-center gap-2">
                                <Instagram className="w-8 h-8 text-pink-500" />
                                Feed Instagram (Manuel)
                            </h1>
                            <div className={`text-sm px-2 py-0.5 rounded inline-block mt-1 uppercase font-bold tracking-wider ${audience === 'adults' ? 'bg-pink-500/20 text-pink-500' : 'bg-white/20 text-white'}`}>
                                Mode {audience === 'adults' ? 'Adulte' : 'Enfant'}
                            </div>
                        </div>
                    </div>
                    <Link href="/admin/instagram/new" className={`${themeColor} hover:opacity-90 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-lg shadow-pink-900/20`}>
                        <Plus className="w-4 h-4" />
                        Ajouter un Post {audience === 'kids' && '(Kids)'}
                    </Link>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredPosts.map((post) => (
                        <div key={post.id} className={`bg-magic-card border ${audience === 'adults' ? 'border-white/10' : 'border-purple-500/20'} rounded-2xl overflow-hidden group relative hover:bg-white/5 transition-colors`}>
                            <div className="aspect-square relative bg-black/50">
                                {post.image_url ? (
                                    <Image src={post.image_url} alt="Insta" fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">Pas d'image</div>
                                )}
                                <div className={`absolute bottom-2 left-2 px-2 py-1 rounded text-[10px] font-bold uppercase border border-white/20 backdrop-blur-md ${post.audience === 'kids' ? 'bg-purple-600/80 text-white' : post.audience === 'all' ? 'bg-yellow-500/80 text-black' : 'bg-gray-800/80 text-gray-300'}`}>
                                    {post.audience === 'kids' ? 'Enfants' : post.audience === 'all' ? 'Tout le monde' : 'Adultes'}
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center flex-col gap-2 p-4">
                                <a href={post.link_url || "#"} target="_blank" className="text-white hover:underline text-xs truncate max-w-full">
                                    Voir le post
                                </a>
                                <form action={deleteInstagramPost.bind(null, post.id)}>
                                    <button className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1">
                                        <Trash2 className="w-3 h-3" /> Supprimer
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                    {filteredPosts.length === 0 && (
                        <div className="col-span-full text-center py-12 text-gray-500 italic">
                            Aucun post instagram configuré pour l'espace <span className="font-bold">{audience === 'adults' ? 'Adulte' : 'Enfant'}</span>.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
