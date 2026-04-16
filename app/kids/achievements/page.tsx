import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Trophy, Star, Lock, Medal } from "lucide-react";
import BackButton from "@/components/BackButton";

export const metadata = {
    title: 'Mes Succès | Club des Magiciens',
    description: 'Ta salle des trophées secrète !',
};

// Force dynamic because user queries are involved
export const revalidate = 0;

export default async function KidsAchievementsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch all quests/achievements
    const { data: allQuests } = await supabase
        .from("gamification_quests")
        .select("*")
        .eq("is_active", true)
        .order("reward_xp", { ascending: true }); // Trier par la taille de la récompense (donc difficulté globale)

    // 2. Fetch completed quests for user
    const { data: userQuests } = await supabase
        .from("user_quests")
        .select("quest_id, completed_at")
        .eq("user_id", user.id);

    const completedQuestIds = new Set(userQuests?.map(q => q.quest_id) || []);

    const quests = allQuests || [];

    // 3. Fetch global stats for individual progress bars
    const globalStats = {
        lifetimeXP: 0,
        videosWatchedCount: 0,
        shopPurchasesCount: 0,
        subscriptionMonths: 0
    };

    const { data: xpLogs } = await supabase.from("user_xp_logs").select("xp_awarded").eq("user_id", user.id);
    globalStats.lifetimeXP = xpLogs?.filter(log => log.xp_awarded > 0).reduce((acc, log) => acc + log.xp_awarded, 0) || 0;

    const { count: libraryItemsCompletedCount } = await supabase.from('library_progress').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_completed', true);
    globalStats.videosWatchedCount = libraryItemsCompletedCount || 0;

    const { count: purchasedSkinsCount } = await supabase.from('user_unlocked_skins').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
    globalStats.shopPurchasesCount = purchasedSkinsCount || 0;

    const { data: activeSub } = await supabase.from('subscriptions').select('created').eq('user_id', user.id).eq('status', 'active').maybeSingle();
    if (activeSub && activeSub.created) {
        const startDate = new Date(activeSub.created).getTime();
        globalStats.subscriptionMonths = Math.floor((Date.now() - startDate) / (1000 * 60 * 60 * 24 * 30.44));
    }

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans relative selection:bg-brand-gold/30">
            {/* Ambient Background Lights */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            <div className="max-w-5xl mx-auto relative z-10 space-y-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="mb-4">
                            <BackButton />
                        </div>
                        <div className="flex items-center gap-2 text-brand-gold mb-2">
                            <Trophy className="w-5 h-5 fill-current animate-pulse text-brand-gold" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            La Salle des <span className="text-brand-purple">Trophées</span>
                        </h1>
                        <p className="text-brand-text-muted mt-2 text-lg">
                            Visualise tout ton parcours magique. Accomplis des missions secrètes pour tous les débloquer !
                        </p>
                    </div>
                </header>

                {/* Milestones Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-brand-card border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-xl">
                        <Trophy className="w-8 h-8 text-yellow-400 mb-2" />
                        <div className="text-2xl font-black text-white">{completedQuestIds.size} / {quests.length}</div>
                        <div className="text-xs text-brand-text-muted uppercase tracking-widest font-bold mt-1">Succès Débloqués</div>
                    </div>
                    {/* Visual Progress Bar taking remaining space */}
                    <div className="col-span-2 md:col-span-3 bg-brand-card border border-white/5 p-6 rounded-2xl flex flex-col justify-center shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Star className="w-32 h-32" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-3">Progression Globale</h3>
                        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400" 
                                style={{ width: `${Math.max((completedQuestIds.size / (quests.length || 1)) * 100, 2)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Grid of Achievements */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                    {quests.map(quest => {
                        const isUnlocked = completedQuestIds.has(quest.id);

                        let currentValue = 0;
                        switch (quest.trigger_type) {
                            case 'lifetime_xp': currentValue = globalStats.lifetimeXP; break;
                            case 'videos_watched': currentValue = globalStats.videosWatchedCount; break;
                            case 'shop_purchases': currentValue = globalStats.shopPurchasesCount; break;
                            case 'subscription_months': currentValue = globalStats.subscriptionMonths; break;
                        }
                        const progressPercent = Math.min((currentValue / quest.trigger_value) * 100, 100);

                        return (
                            <div 
                                key={quest.id} 
                                className={`relative group h-full flex flex-col rounded-3xl overflow-hidden shadow-xl cursor-default
                                    ${isUnlocked ? 'bg-gradient-to-br from-brand-card to-brand-bg border border-brand-purple/20 hover:-translate-y-1 transition-all duration-300' 
                                                 : 'bg-black/50 border border-white/5 opacity-80 grayscale hover:grayscale-0 active:grayscale-0 hover:opacity-100 active:opacity-100 hover:scale-[1.02] active:scale-[1.02] transition-all duration-500'}`}
                            >
                                <div className="p-6 flex flex-col items-center text-center h-full">
                                    {/* Icon Container */}
                                    <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-4 relative overflow-hidden shadow-inner transition-all duration-500
                                        ${isUnlocked ? 'bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 border-2 border-brand-purple/30' 
                                                     : 'bg-white/5 border border-white/10 group-hover:bg-gradient-to-br group-hover:from-brand-purple/10 group-hover:to-brand-blue/10 group-hover:border-brand-purple/20'}`}
                                    >
                                        {!isUnlocked && (
                                            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/0 group-active:bg-black/0 z-10 flex items-center justify-center backdrop-blur-[2px] group-hover:backdrop-blur-none group-active:backdrop-blur-none transition-all duration-500">
                                                <Lock className="w-8 h-8 text-gray-400 group-hover:opacity-0 group-active:opacity-0 transition-opacity duration-300" />
                                            </div>
                                        )}
                                        
                                        {(() => {
                                            let iconSrc = null;
                                            if (quest.trigger_type === 'videos_watched' && quest.reward_xp === 100) iconSrc = '/achievements/quest_scroll.png';
                                            else if (quest.trigger_type === 'videos_watched' && quest.reward_xp === 500) iconSrc = '/achievements/quest_hat.png';
                                            else if (quest.trigger_type === 'videos_watched' && quest.reward_xp >= 2000) iconSrc = '/achievements/quest_book.png';
                                            else if (quest.trigger_type === 'shop_purchases' && quest.reward_xp === 200) iconSrc = '/achievements/quest_chest_sm.png';
                                            else if (quest.trigger_type === 'shop_purchases' && quest.reward_xp >= 1000) iconSrc = '/achievements/quest_chest_bg.png';
                                            else if (quest.trigger_type === 'lifetime_xp' && quest.reward_xp === 250) iconSrc = '/achievements/quest_star_sm.png';
                                            else if (quest.trigger_type === 'lifetime_xp' && quest.reward_xp >= 5000) iconSrc = '/achievements/quest_star_bg.png';
                                            else if (quest.trigger_type === 'subscription_months' && quest.reward_xp === 500) iconSrc = '/achievements/quest_hourglass.png';
                                            else if (quest.trigger_type === 'subscription_months' && quest.reward_xp >= 3000) iconSrc = '/achievements/quest_sun.png';

                                            return iconSrc ? (
                                                <Image src={iconSrc} alt="" fill className="object-cover p-3 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                                            ) : (
                                                <Medal className={`w-14 h-14 ${isUnlocked ? 'text-brand-gold drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]' : 'text-gray-600'}`} />
                                            );
                                        })()}
                                    </div>

                                    <h3 className={`text-lg font-black mb-2 leading-tight transition-colors duration-500 ${isUnlocked ? 'text-white' : 'text-gray-500 group-hover:text-white group-active:text-white'}`}>
                                        {quest.title}
                                    </h3>
                                    
                                    <p className={`text-sm flex-1 transition-colors duration-500 ${isUnlocked ? 'text-brand-text-muted mt-2' : 'text-gray-600 group-hover:text-brand-text-muted group-active:text-brand-text-muted mt-2'}`}>
                                        {quest.description || (isUnlocked ? "Tu as accompli ce succès !" : "Un secret t'attend...")}
                                    </p>

                                    {/* Individual Progress Bar (if locked) */}
                                    {!isUnlocked && (
                                        <div className="w-full mt-auto mb-4 border-t border-white/5 pt-4">
                                            <div className="flex justify-between items-end mb-1">
                                                <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">Progression</span>
                                                <span className="text-xs font-bold text-gray-500">{currentValue} / {quest.trigger_value}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-brand-purple transition-all duration-1000 ease-out" 
                                                    style={{ width: `${progressPercent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Reward Tag */}
                                    {quest.reward_xp > 0 && (
                                        <div className={`mt-auto px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border transition-colors duration-500
                                            ${isUnlocked ? 'bg-brand-gold/10 text-brand-gold border-brand-gold/20' 
                                                         : 'bg-black border-white/10 text-gray-700 group-hover:text-brand-gold group-active:text-brand-gold group-hover:border-brand-gold/50 group-active:border-brand-gold/50'}`}
                                        >
                                            <Star className={`w-3.5 h-3.5 ${isUnlocked ? 'fill-current' : ''}`} />
                                            {isUnlocked ? `+ ${quest.reward_xp} Poussières GAGNÉES` : `${quest.reward_xp} Poussières à gagner`}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {quests.length === 0 && (
                        <div className="col-span-full py-20 text-center flex flex-col items-center border border-dashed border-white/10 rounded-3xl">
                            <Trophy className="w-16 h-16 text-gray-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-400">Aucun succès défini</h3>
                            <p className="text-gray-500">L'administrateur n'a pas encore ajouté de succès dans le Club.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
