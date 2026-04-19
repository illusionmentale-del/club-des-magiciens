import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Sparkles, PackageSearch } from "lucide-react";
import ShopBuyWithXP from "@/components/kids/ShopBuyWithXP";
import SkinLocker from "@/components/kids/SkinLocker";

export const metadata = {
    title: 'Cabinet de Curiosité | Club des Magiciens',
    description: 'Dépensez votre XP pour débloquer de nouveaux avatars exclusifs et objets pour l\'Atelier.',
};

export default async function AdultShopPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch XP balance for the user
    let trueXP = 0;
    try {
        const { data: xpLogs } = await supabase.from("user_xp_logs").select("xp_awarded").eq("user_id", user.id);
        if (xpLogs) {
            trueXP = xpLogs.reduce((acc, log) => acc + log.xp_awarded, 0);
        }
    } catch(e) {
        console.error("Could not fetch xp logs for adults");
    }

    // 2. Fetch Avatars Data (Only Adults or All)
    const { data: skins } = await supabase
        .from('avatar_skins')
        .select('*')
        .in('target_audience', ['adults', 'all'])
        .order('price_xp', { ascending: true });
    
    // 3. Fetch Profile (for equipped skin)
    const { data: profile } = await supabase.from('profiles').select('equipped_skin_id').eq('id', user.id).single();
    
    // 4. Fetch Unlocked Skins
    const { data: unlockedSkins } = await supabase.from('user_unlocked_skins').select('skin_id').eq('user_id', user.id);
    const unlockedSkinIds = unlockedSkins?.map(s => s.skin_id) || [];

    // Ensure Default skin is always unlocked
    if (!unlockedSkinIds.includes('default')) {
        unlockedSkinIds.push('default');
    }

    // 5. Partition skins into unlocked vs locked for the Locker
    const mySkins = skins?.filter(s => unlockedSkinIds.includes(s.id)) || [];
    const lockedSkins = skins?.filter(s => !unlockedSkinIds.includes(s.id)) || [];

    return (
        <div className="min-h-screen bg-[#050507] text-white p-4 md:p-8 pb-32 font-sans relative selection:bg-magic-royal/30">
            {/* Ambient Background Lights */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-magic-royal/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="max-w-6xl mx-auto relative z-10 space-y-12">
            
                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-4 border-b border-white/5 pb-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-magic-royal mb-2">
                            <Sparkles className="w-5 h-5" />
                            <span className="text-xs font-bold uppercase tracking-widest">Récompenses & XP</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight font-serif mb-2">
                            Le <span className="text-magic-gold">Cabinet</span> de Curiosités
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg font-light max-w-2xl">
                            Dépensez votre Expérience acquise en regardant les Ateliers pour débloquer de nouveaux avatars de profil.
                        </p>
                    </div>
                    
                    {/* XP Balance Display */}
                    <div className="bg-black/40 border border-magic-gold/20 backdrop-blur-md rounded-2xl p-4 flex items-center justify-center min-w-[200px] shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                        <div className="text-center">
                            <p className="text-xs text-magic-gold font-bold uppercase tracking-wider mb-1">Solde Disponible</p>
                            <div className="flex items-center justify-center gap-2 text-white font-black text-4xl">
                                {trueXP} <span className="text-lg text-magic-gold mt-1">XP</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Locker */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-black/30 border border-white/5 rounded-3xl p-6 shadow-xl">
                            <h2 className="text-xl font-bold text-white mb-6 font-serif flex items-center gap-2">
                                <PackageSearch className="w-5 h-5 text-magic-royal" />
                                Mon Vestiaire
                            </h2>
                            <p className="text-slate-400 text-sm mb-6">
                                Sélectionnez l'avatar qui s'affichera sur votre profil d'Illusionniste.
                            </p>
                            
                            <SkinLocker 
                                skins={mySkins} 
                                equippedId={profile?.equipped_skin_id || 'default'} 
                                adultMode={true}
                            />
                        </div>
                    </div>

                    {/* Right Column: Shop Items to unlock */}
                    <div className="lg:col-span-2">
                        <div className="bg-black/30 border border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                            <h2 className="text-xl font-bold text-white mb-6 font-serif border-b border-white/5 pb-4">
                                Catalogues d'Avatars (Adultes)
                            </h2>
                            
                            {lockedSkins.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                                    {lockedSkins.map((skin) => (
                                        <ShopBuyWithXP 
                                            key={skin.id}
                                            itemId={skin.id}
                                            title={skin.name}
                                            description="Modifie votre avatar de profil"
                                            imageUrl={skin.image_url}
                                            priceXP={skin.price_xp}
                                            currentXP={trueXP}
                                            itemType="skin"
                                            adultMode={true}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 bg-magic-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-magic-gold/20">
                                        <Sparkles className="w-8 h-8 text-magic-gold" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Vous possédez tout !</h3>
                                    <p className="text-slate-400 mt-2">D'autres objets magiques prestigieux viendront plus tard.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
