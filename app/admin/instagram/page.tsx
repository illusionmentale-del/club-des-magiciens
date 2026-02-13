import { createClient } from "@/lib/supabase/server";
import { deleteInstagramPost } from "../actions";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, Instagram } from "lucide-react";
import Image from "next/image";

export default async function AdminInstagramPage() {
    const supabase = await createClient();
    const { data: posts } = await supabase.from("instagram_posts").select("*").order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8">
            <div className="max-w-5xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ArrowLeft /></Link>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <Instagram className="w-8 h-8 text-pink-500" />
                            Feed Instagram (Manuel)
                        </h1>
                    </div>
                    <Link href="/admin/instagram/new" className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors">
                        <Plus className="w-4 h-4" />
                        Ajouter un Post
                    </Link>
                </header>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {posts?.map((post) => (
                        <div key={post.id} className="bg-magic-card border border-white/10 rounded-2xl overflow-hidden group relative">
                            <div className="aspect-square relative bg-black/50">
                                {post.image_url ? (
                                    <Image src={post.image_url} alt="Insta" fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">Pas d'image</div>
                                )}
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
                    {(!posts || posts.length === 0) && (
                        <div className="col-span-full text-center py-12 text-gray-500 italic">
                            Aucun post instagram configuré.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
