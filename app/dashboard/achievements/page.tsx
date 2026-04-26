import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Trophy, Star, Lock, Medal, Target } from "lucide-react";
import BackButton from "@/components/BackButton";

export const metadata = {
    title: 'Mes Succès | L\'Atelier',
    description: 'Votre journal d\'apprentissage et vos accomplissements.',
};

// Force dynamic because user queries are involved
export const revalidate = 0;

export default async function AdultAchievementsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // 1. Fetch all quests/achievements for adults
    const { data: allQuests } = await supabase
        .from("gamification_quests")
        .select("*")
        .eq("is_active", true)
        .in("target_audience", ["adults", "all"])
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
        <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-32 font-sans relative selection:bg-magic-royal/30">

            <div className="max-w-6xl mx-auto relative z-10">
                <BackButton />
                {/* Header */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4 border-b border-white/5 pb-8 mb-12">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-brand-purple mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-widest text-brand-purple">Votre Parcours</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight mb-2">
                            Journal <span className="text-magic-royal">d'Apprentissage</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg font-light max-w-2xl">
                            Visualisez votre progression, vos succès, et les objectifs à atteindre pour maîtriser les arcanes de la magie.
                        </p>
                    </div>
                </header>

                {/* Milestones Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-black border border-white/10 p-4 rounded-none flex flex-col items-center justify-center text-center shadow-2xl">
                        <Trophy className="w-8 h-8 text-brand-purple mb-2" />
                        <div className="text-2xl font-black text-white">{completedQuestIds.size} / {quests.length}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest font-bold mt-1">Succès Accompli(s)</div>
                    </div>
                    {/* Visual Progress Bar taking remaining space */}
                    <div className="col-span-2 md:col-span-3 bg-black border border-white/10 p-6 rounded-none flex flex-col justify-center shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <Star className="w-32 h-32" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest mb-3">Maîtrise Globale</h3>
                        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                            <div 
                                className="h-full bg-gradient-to-r from-blue-800 to-magic-royal" 
                                style={{ width: `${Math.max((completedQuestIds.size / (quests.length || 1)) * 100, 2)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* SECTION 1 : Objectifs Principaux (Active Quests) */}
                <div className="pt-8">
                    <h2 className="text-2xl md:text-3xl font-serif text-white mb-6 flex items-center gap-3">
                        <Target className="text-magic-royal" /> Les Objectifs de l'Atelier
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
                                        className={`relative group h-full flex flex-col rounded-none overflow-hidden shadow-2xl cursor-default border
                                            ${isUnlocked ? 'bg-black border-magic-royal/50 hover:border-magic-royal transition-all duration-300' 
                                                         : 'bg-black border-white/10 hover:border-white/30 transition-all duration-500'}`}
                                    >
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`w-16 h-16 rounded-none flex items-center justify-center p-2 shadow-inner 
                                                ${isUnlocked ? 'bg-magic-royal/10 border border-magic-royal/30' : 'bg-black border border-white/10'}`}>
                                                {quest.reward_type === 'video' ? (
                                                    <Image src="/achievements/reward_video.png" alt="Contenu Secret" width={48} height={48} className="drop-shadow-[0_0_8px_rgba(0,102,255,0.8)]" />
                                                ) : (
                                                    <Image src="/achievements/reward_avatar.png" alt="Avatar Premium" width={48} height={48} className="drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                                                )}
                                            </div>
                                            {!isUnlocked && <Lock className="w-6 h-6 text-gray-500" />}
                                        </div>
                                        <h3 className={`text-xl font-serif mb-2 leading-tight ${isUnlocked ? 'text-white' : 'text-gray-300'}`}>
                                            {quest.title}
                                        </h3>
                                        <p className={`text-sm flex-1 mb-6 ${isUnlocked ? 'text-slate-400' : 'text-gray-500'}`}>
                                            {quest.description}
                                        </p>

                                        {!isUnlocked && (
                                            <div className="w-full mt-auto mb-4 border-t border-white/5 pt-4">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className="text-[10px] font-bold text-magic-royal uppercase tracking-wider">Objectif</span>
                                                    <span className="text-xs font-bold text-gray-400">{currentValue} / {quest.trigger_value}</span>
                                                </div>
                                                <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden shadow-inner">
                                                    <div 
                                                        className="h-full bg-magic-royal transition-all duration-1000 ease-out" 
                                                        style={{ width: `${progressPercent}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        )}

                                        <div className={`mt-auto px-4 py-2 rounded-none text-sm font-serif uppercase tracking-widest flex items-center justify-center gap-2 border transition-colors duration-500
                                            ${isUnlocked ? 'bg-magic-royal/10 text-magic-royal border-magic-royal/30' 
                                                         : 'bg-black border-white/10 text-gray-400'}`}
                                        >
                                            {isUnlocked ? "Accompli !" : (quest.reward_type === 'video' ? "Contenu à débloquer" : "Objet Premium à la clef")}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {quests.filter(q => q.reward_type && q.reward_type !== 'badge').length === 0 && (
                            <div className="col-span-full py-12 text-center flex flex-col items-center border border-dashed border-white/10 rounded-none bg-black">
                                <Target className="w-12 h-12 text-gray-600 mb-3" />
                                <h3 className="text-lg font-bold text-gray-400">Aucun objectif défini</h3>
                                <p className="text-gray-500 text-sm">Les missions s'afficheront ici.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* SECTION 2 : Les Titres et Trophées (Passive Badges) */}
                <div className="pt-8">
                    <h2 className="text-2xl md:text-3xl font-serif text-white mb-6 flex items-center gap-3">
                        <Medal className="text-brand-purple" /> Les Titres et Trophées
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
                                    className={`relative group h-full flex flex-col rounded-none overflow-hidden shadow-2xl cursor-default border
                                        ${isUnlocked ? 'bg-black border-brand-purple/30 hover:border-brand-purple transition-all duration-300' 
                                                     : 'bg-black border-white/10 hover:border-white/30 transition-all duration-500'}`}
                                >
                                    <div className="p-6 flex flex-col items-center text-center h-full">
                                        <div className={`w-28 h-28 rounded-none flex items-center justify-center mb-4 relative overflow-hidden shadow-inner transition-all duration-500
                                            ${isUnlocked ? 'bg-black border border-brand-purple/30' 
                                                         : 'bg-black border border-white/10'}`}
                                        >
                                            {!isUnlocked && (
                                                <div className="absolute inset-0 bg-black/60 group-hover:bg-black/0 z-10 flex items-center justify-center backdrop-blur-[2px] group-hover:backdrop-blur-none transition-all duration-500">
                                                    <Lock className="w-8 h-8 text-gray-400 group-hover:opacity-0 transition-opacity duration-300" />
                                                </div>
                                            )}
                                            
                                            {(() => {
                                                let iconSrc = null;
                                                if (quest.trigger_type === 'videos_watched') iconSrc = '/achievements/quest_scroll.png';
                                                else if (quest.trigger_type === 'shop_purchases') iconSrc = '/achievements/quest_chest_sm.png';
                                                else if (quest.trigger_type === 'lifetime_xp') iconSrc = '/achievements/quest_book.png';
                                                else if (quest.trigger_type === 'subscription_months') iconSrc = '/achievements/quest_hourglass.png';

                                                return iconSrc ? (
                                                    <Image src={iconSrc} alt="" fill className="object-cover p-3 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]" />
                                                ) : (
                                                    <Medal className={`w-14 h-14 ${isUnlocked ? 'text-brand-purple drop-shadow-[0_0_15px_rgba(94,92,230,0.5)]' : 'text-gray-600'}`} />
                                                );
                                            })()}
                                        </div>

                                        <h3 className={`text-lg font-serif mb-2 leading-tight transition-colors duration-500 ${isUnlocked ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
                                            {quest.title}
                                        </h3>
                                        
                                        <p className={`text-sm flex-1 transition-colors duration-500 ${isUnlocked ? 'text-slate-400 mt-2' : 'text-gray-600 group-hover:text-slate-400 mt-2'}`}>
                                            {quest.description || (isUnlocked ? "Titre accompli." : "Reste à débloquer.")}
                                        </p>

                                        {!isUnlocked && (
                                            <div className="w-full mt-auto mb-4 border-t border-white/5 pt-4">
                                                <div className="flex justify-between items-end mb-1">
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Progression</span>
                                                    <span className="text-xs font-bold text-gray-500">{currentValue} / {quest.trigger_value}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-slate-600 transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
                                                </div>
                                            </div>
                                        )}

                                        {quest.reward_xp > 0 && (
                                            <div className={`mt-auto px-4 py-1.5 rounded-none text-xs font-serif uppercase tracking-widest flex items-center gap-2 shadow-lg border transition-colors duration-500
                                                ${isUnlocked ? 'bg-brand-purple/10 text-brand-purple border-brand-purple/30' 
                                                            : 'bg-black border-white/10 text-gray-700 group-hover:text-brand-purple group-hover:border-brand-purple/20'}`}
                                            >
                                                <Star className={`w-3.5 h-3.5 ${isUnlocked ? '' : 'grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500'}`} />
                                                {isUnlocked ? `+ ${quest.reward_xp} XP GAGNÉS` : `${quest.reward_xp} XP à gagner`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {quests.filter(q => !q.reward_type || q.reward_type === 'badge').length === 0 && (
                            <div className="col-span-full py-12 text-center flex flex-col items-center border border-dashed border-white/10 rounded-none bg-black">
                                <Trophy className="w-12 h-12 text-gray-600 mb-3" />
                                <h3 className="text-lg font-bold text-gray-400">Aucun accomplissement</h3>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
