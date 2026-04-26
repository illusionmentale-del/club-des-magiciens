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
        .in("target_audience", ["kids", "all"])
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
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans relative selection:bg-brand-purple/30">
            {/* Ambient Background Lights */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-purple/10 via-brand-bg to-brand-bg pointer-events-none z-0"></div>

            <div className="max-w-5xl mx-auto relative z-10 space-y-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="mb-4">
                            <BackButton />
                        </div>
                        <div className="flex items-center gap-2 text-brand-purple mb-2">
                            <Trophy className="w-5 h-5 fill-current animate-pulse text-brand-purple" />
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
                    <div className="bg-[#100b1a] border border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)]">
                        <Trophy className="w-8 h-8 text-cyan-400 mb-2" />
                        <div className="text-2xl font-black text-white">{completedQuestIds.size} / {quests.length}</div>
                        <div className="text-xs text-brand-text-muted uppercase tracking-widest font-bold mt-1">Succès Débloqués</div>
                    </div>
                    {/* Visual Progress Bar taking remaining space */}
                    <div className="col-span-2 md:col-span-3 bg-[#100b1a] border border-white/10 p-6 rounded-2xl flex flex-col justify-center shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Star className="w-32 h-32" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-3">Progression Globale</h3>
                        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full bg-gradient-to-r from-indigo-600 to-cyan-400" 
                                style={{ width: `${Math.max((completedQuestIds.size / (quests.length || 1)) * 100, 2)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* SECTION 1 : Le Grimoire des Quêtes (Active Quests) */}
                <div className="pt-8">
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-6 flex items-center gap-3">
                        <span className="text-blue-400">📖</span> Le Grimoire des Quêtes
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quests.filter(q => q.reward_type && q.reward_type !== 'badge').map(quest => {
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
                                    className={`relative group h-full flex flex-col rounded-2xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] cursor-default border
                                        ${isUnlocked ? 'bg-[#100b1a] border-blue-500/50 hover:-translate-y-1 transition-all duration-300' 
                                                     : 'bg-black border-white/10 hover:border-blue-500/30 hover:-translate-y-1 transition-all duration-500'}`}
                                >
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center p-2 shadow-inner 
                                                ${isUnlocked ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-white/5 border border-white/10'}`}>
                                                {quest.reward_type === 'video' ? (
                                                    <Image src="/achievements/reward_video.png" alt="Vidéo Secrète" width={48} height={48} className="drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                                ) : (
                                                    <Image src="/achievements/reward_avatar.png" alt="Avatar Légendaire" width={48} height={48} className="drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
                                                )}
                                            </div>
                                            {!isUnlocked && <Lock className="w-6 h-6 text-gray-500" />}
                                        </div>
                                        <h3 className={`text-xl font-black mb-2 leading-tight ${isUnlocked ? 'text-white' : 'text-gray-300'}`}>
                                            {quest.title}
                                        </h3>
                                        <p className={`text-sm flex-1 mb-6 ${isUnlocked ? 'text-brand-text-muted' : 'text-gray-500'}`}>
                                            {quest.description}
                                        </p>

                                        {!isUnlocked && (
                                            <div className="w-full mt-auto mb-4 border-t border-white/5 pt-4">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Objectif</span>
                                                    <span className="text-xs font-bold text-gray-400">{currentValue} / {quest.trigger_value}</span>
                                                </div>
                                                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden shadow-inner">
                                                    <div 
                                                        className="h-full bg-blue-500 transition-all duration-1000 ease-out" 
                                                        style={{ width: `${progressPercent}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        <div className={`mt-auto px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border transition-colors duration-500
                                            ${isUnlocked ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                                                         : 'bg-black border-white/10 text-gray-400'}`}
                                        >
                                            {isUnlocked ? "Récompense Obtenue !" : (quest.reward_type === 'video' ? "Vidéo Secrète à débloquer" : "Avatar Légendaire à la clef")}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {quests.filter(q => q.reward_type && q.reward_type !== 'badge').length === 0 && (
                            <div className="col-span-full py-12 text-center flex flex-col items-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                                <span className="text-4xl mb-3 opacity-50">📖</span>
                                <h3 className="text-lg font-bold text-gray-400">Le Grimoire est vide</h3>
                                <p className="text-gray-500 text-sm">Aucune quête active pour le moment.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* SECTION 2 : Le Panthéon des Succès (Passive Badges) */}
                <div className="pt-8">
                    <h2 className="text-2xl md:text-3xl font-black text-white mb-6 flex items-center gap-3">
                        <span className="text-brand-purple">🏆</span> Le Panthéon des Trophées
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quests.filter(q => !q.reward_type || q.reward_type === 'badge').map(quest => {
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
                                    className={`relative group h-full flex flex-col rounded-2xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] cursor-default
                                        ${isUnlocked ? 'bg-[#100b1a] border border-brand-purple/20 hover:-translate-y-1 transition-all duration-300' 
                                                     : 'bg-black border border-white/5 opacity-80 grayscale hover:grayscale-0 hover:opacity-100 hover:scale-[1.02] transition-all duration-500'}`}
                                >
                                    <div className="p-6 flex flex-col items-center text-center h-full">
                                        <div className={`w-28 h-28 rounded-full flex items-center justify-center mb-4 relative overflow-hidden shadow-inner transition-all duration-500
                                            ${isUnlocked ? 'bg-gradient-to-br from-brand-purple/20 to-brand-blue/20 border-2 border-brand-purple/30' 
                                                         : 'bg-white/5 border border-white/10 group-hover:bg-gradient-to-br group-hover:from-brand-purple/10 group-hover:to-brand-blue/10 group-hover:border-brand-purple/20'}`}
                                        >
                                            {!isUnlocked && (
                                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/0 z-10 flex items-center justify-center backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all duration-500">
                                                    <Lock className="w-8 h-8 text-gray-400 group-hover:opacity-0 transition-opacity duration-300" />
                                                </div>
                                            )}
                                            
                                            {(() => {
                                                let iconSrc = null;
                                                if (quest.trigger_type === 'videos_watched' && quest.reward_xp <= 100) iconSrc = '/achievements/quest_scroll.png';
                                                else if (quest.trigger_type === 'videos_watched' && quest.reward_xp === 500) iconSrc = '/achievements/quest_hat.png';
                                                else if (quest.trigger_type === 'videos_watched' && quest.reward_xp >= 2000) iconSrc = '/achievements/quest_book.png';
                                                else if (quest.trigger_type === 'shop_purchases' && quest.reward_xp === 200) iconSrc = '/achievements/quest_chest_sm.png';
                                                else if (quest.trigger_type === 'shop_purchases' && quest.reward_xp >= 1000) iconSrc = '/achievements/quest_chest_bg.png';
                                                else if (quest.trigger_type === 'lifetime_xp' && quest.reward_xp <= 250) iconSrc = '/achievements/quest_star_sm.png';
                                                else if (quest.trigger_type === 'lifetime_xp' && quest.reward_xp >= 5000) iconSrc = '/achievements/quest_star_bg.png';
                                                else if (quest.trigger_type === 'subscription_months' && quest.reward_xp <= 500) iconSrc = '/achievements/quest_hourglass.png';
                                                else if (quest.trigger_type === 'subscription_months' && quest.reward_xp >= 3000) iconSrc = '/achievements/quest_sun.png';

                                                return iconSrc ? (
                                                    <Image src={iconSrc} alt="" fill className="object-cover p-3 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                                                ) : (
                                                    <Medal className={`w-14 h-14 ${isUnlocked ? 'text-brand-purple drop-shadow-[0_0_15px_rgba(94,92,230,0.5)]' : 'text-gray-600'}`} />
                                                );
                                            })()}
                                        </div>

                                        <h3 className={`text-lg font-black mb-2 leading-tight transition-colors duration-500 ${isUnlocked ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
                                            {quest.title}
                                        </h3>
                                        
                                        <p className={`text-sm flex-1 transition-colors duration-500 ${isUnlocked ? 'text-brand-text-muted mt-2' : 'text-gray-600 group-hover:text-brand-text-muted mt-2'}`}>
                                            {quest.description || (isUnlocked ? "Tu as accompli ce succès !" : "Un secret t'attend...")}
                                        </p>

                                        {!isUnlocked && (
                                            <div className="w-full mt-auto mb-4 border-t border-white/5 pt-4">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className="text-[10px] font-bold text-brand-purple uppercase tracking-wider">Progression</span>
                                                    <span className="text-xs font-bold text-gray-500">{currentValue} / {quest.trigger_value}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-brand-purple transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
                                                </div>
                                            </div>
                                        )}

                                        {quest.reward_xp > 0 && (
                                            <div className={`mt-auto px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg border transition-colors duration-500
                                                ${isUnlocked ? 'bg-brand-purple/20 text-brand-purple border-brand-purple/30' 
                                                            : 'bg-black border-white/10 text-gray-700 group-hover:text-brand-purple group-hover:border-brand-purple/40'}`}
                                            >
                                                <Image src="/achievements/stardust.png" alt="XP" width={16} height={16} className={!isUnlocked ? "grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" : ""} />
                                                {isUnlocked ? `+ ${quest.reward_xp} GAGNÉES` : `${quest.reward_xp} à gagner`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {quests.filter(q => !q.reward_type || q.reward_type === 'badge').length === 0 && (
                            <div className="col-span-full py-12 text-center flex flex-col items-center border border-dashed border-white/10 rounded-2xl bg-white/5">
                                <Trophy className="w-12 h-12 text-gray-600 mb-3" />
                                <h3 className="text-lg font-bold text-gray-400">Aucun succès</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
