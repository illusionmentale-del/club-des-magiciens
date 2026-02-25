import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Package, PlayCircle, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata = {
    title: 'Mes Achats | Club des Magiciens',
};

// Remove cache for real-time purchase updates
export const revalidate = 0;

export default async function KidsPurchasesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch user purchases
    const { data: purchases, error: purchaseError } = await supabase
        .from('user_purchases')
        .select('library_item_id, created_at')
        .eq('user_id', user.id)
        .eq('status', 'active');

    if (purchaseError) {
        console.error("Error fetching purchases:", purchaseError);
        return <div>Une erreur est survenue lors du chargement de tes achats.</div>;
    }

    // 2. Fetch the actual library items details
    const purchaseIds = purchases?.map(p => p.library_item_id).filter(id => id !== null) || [];

    let purchasedItems: any[] = [];

    if (purchaseIds.length > 0) {
        const { data: items, error: itemsError } = await supabase
            .from('library_items')
            .select('*')
            .in('id', purchaseIds)
            .order('published_at', { ascending: false });

        if (!itemsError && items) {
            purchasedItems = items;
        }
    }

    // Format duration from seconds to MM:SS or HH:MM:SS
    const formatDuration = (seconds?: number) => {
        if (!seconds) return '00:00';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-20">
            {/* Header section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand-purple/20 via-brand-bg to-brand-gold/10 border border-white/10 p-8 md:p-12 shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/20 blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>

                <div className="relative z-10 max-w-2xl text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-purple font-bold text-sm mb-6 uppercase tracking-widest">
                        <Package className="w-4 h-4" />
                        Trésors Magiques
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-[1.1] mb-6">
                        Mes <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-gold">Achats Secrets</span>
                    </h1>
                    <p className="text-lg text-brand-text-muted leading-relaxed font-medium">
                        Retrouve ici toutes les Masterclass et vidéos premium que tu as débloquées. Ton savoir magique t'appartient pour l'éternité !
                    </p>
                </div>
            </div>

            {/* Video Grid */}
            <div className="bg-brand-card/50 border border-white/5 rounded-[2.5rem] p-6 shadow-2xl">
                {purchasedItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {purchasedItems.map((item) => (
                            <Link href={`/kids/videos/${item.video_url || item.id}`} key={item.id} className="group flex flex-col bg-brand-bg rounded-2xl overflow-hidden border border-white/5 hover:border-brand-purple/50 transition-all hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(168,85,247,0.2)] h-full">
                                {/* Thumbnail Container */}
                                <div className="relative aspect-video bg-black/50 overflow-hidden shrink-0">
                                    {item.thumbnail_url ? (
                                        <Image
                                            src={item.thumbnail_url}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <PlayCircle className="w-12 h-12 text-white/20" />
                                        </div>
                                    )}
                                    {/* Play Overlay overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-16 h-16 bg-brand-purple rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.6)] transform scale-75 group-hover:scale-100 transition-all duration-300">
                                            <PlayCircle className="w-8 h-8 text-white ml-1" />
                                        </div>
                                    </div>
                                    {/* Duration Badge */}
                                    {item.duration && (
                                        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-white border border-white/10 flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 text-brand-text-muted" />
                                            {formatDuration(item.duration)}
                                        </div>
                                    )}
                                </div>

                                {/* Content Container */}
                                <div className="p-5 flex flex-col flex-1">
                                    <h3 className="font-bold text-white text-lg mb-2 line-clamp-2 group-hover:text-brand-purple transition-colors leading-tight">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-brand-text-muted line-clamp-2 leading-relaxed">
                                        {item.description || "Aucune description pour cette vidéo."}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                            <Package className="w-10 h-10 text-brand-text-muted" />
                        </div>
                        <h3 className="text-2xl font-black text-white uppercase mb-3">Tu n'as pas encore d'achats</h3>
                        <p className="text-brand-text-muted max-w-md mx-auto mb-8">
                            Mais attends... Si tu n'as pas encore de trésors ici, c'est parce que de grands secrets t'attendent dans la Boutique !
                        </p>
                        <Link href="/kids/shop" className="bg-brand-gold text-black font-black uppercase tracking-widest py-4 px-8 rounded-xl hover:scale-105 transition-transform flex items-center gap-3">
                            Découvir La Boutique
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
