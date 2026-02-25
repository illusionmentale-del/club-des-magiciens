import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ShoppingBag, Lock, Sparkles } from "lucide-react";
import AdminShopClient from "@/components/admin/AdminShopClient";

export const metadata = {
    title: 'Boutique Premium | Admin Kids',
};

export default async function AdminShopPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Verify admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        redirect("/");
    }

    // Fetch all library items for kids
    const { data: libraryItems, error } = await supabase
        .from('library_items')
        .select('*')
        .eq('audience', 'kids')
        .order('published_at', { ascending: false });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <ShoppingBag className="w-8 h-8 text-brand-purple" />
                        Boutique Premium
                    </h1>
                    <p className="text-brand-text-muted mt-2">
                        Rendez vos vidéos payantes en leur ajoutant un lien de paiement Stripe (Payment Link) et un prix. Elles apparaîtront automatiquement dans la section "La Boutique".
                    </p>
                </div>
            </div>

            <div className="bg-brand-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 bg-white/5 flex items-center gap-3">
                    <Lock className="w-5 h-5 text-brand-gold" />
                    <h2 className="text-xl font-bold text-white">Gestion des accès payants</h2>
                </div>

                {/* Pass data to interactive client component */}
                <AdminShopClient initialItems={libraryItems || []} />
            </div>
        </div>
    );
}
