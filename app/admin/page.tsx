import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Shield, Newspaper, ShoppingBag, Users, Settings, LogOut, Video, Instagram } from "lucide-react";

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check if user is admin via 'profiles' table
    // We assume a 'role' column exists. If not, this might fail or return null.
    // For now, let's Secure it by Email as a fallback or if column doesn't exist yet.
    // Replace 'YOUR_ADMIN_EMAIL' with usage of a database check.

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    const isAdmin = profile?.role === 'admin';

    // DOUBLE SECURITY: If not admin, 404 Not Found (Invisible)
    if (!isAdmin) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 border-b border-white/10 pb-8 flex items-center gap-4">
                    <div className="p-3 bg-red-500/20 rounded-xl text-red-500">
                        <Shield className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-serif text-white mb-2">Administration Secrète</h1>
                        <p className="text-gray-400">Section réservée au Grand Maître.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* USERS CARD */}
                    <Link href="/admin/users" className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-magic-purple transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold group-hover:text-magic-purple">Membres</h2>
                            <Users className="w-6 h-6 text-gray-400 group-hover:text-white" />
                        </div>
                        <p className="text-gray-400 text-sm">Gérer les utilisateurs et rôles.</p>
                    </Link>

                    {/* LIVES CARD */}
                    <Link href="/admin/lives" className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-red-500 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold group-hover:text-red-500">Lives & Événements</h2>
                            <Video className="w-6 h-6 text-gray-400 group-hover:text-white" />
                        </div>
                        <p className="text-gray-400 text-sm">Programmer, lancer et gérer les lives.</p>
                    </Link>

                    {/* SETTINGS CARD */}
                    <Link href="/admin/settings" className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-magic-gold transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold group-hover:text-magic-gold">Réglages Site</h2>
                            <Settings className="w-6 h-6 text-gray-400 group-hover:text-white" />
                        </div>
                        <p className="text-gray-400 text-sm">Configurer l'accueil, les liens, etc.</p>
                    </Link>

                    {/* NEWS CARD (Original structure, kept for reference if other cards need to be updated) */}
                    <div className="bg-magic-card border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Video className="w-5 h-5 text-magic-gold" />
                            Contenu (News)
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">Publier des actualités.</p>
                        <Link href="/admin/news" className="block w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-center text-white font-medium">Gérer les news</Link>
                    </div>

                    <div className="bg-magic-card border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-400" />
                            Paramètres QG
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">Titres, Messages, Vidéo.</p>
                        <Link href="/admin/settings" className="block w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-center text-white font-medium">Modifier le QG</Link>
                    </div>

                    <div className="bg-magic-card border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-amber-500" />
                            Boutique
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">Gérer les produits.</p>
                        <Link href="/admin/products" className="block w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-center text-white font-medium">Gérer la boutique</Link>
                    </div>

                    <div className="bg-magic-card border border-white/10 p-6 rounded-2xl">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Instagram className="w-5 h-5 text-pink-500" />
                            Instagram
                        </h3>
                        <p className="text-gray-400 text-sm mb-4">Gérer le feed manuel.</p>
                        <Link href="/admin/instagram" className="block w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-center text-white font-medium">Gérer Instagram</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
