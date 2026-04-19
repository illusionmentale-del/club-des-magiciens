import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// INTERNAL SERVER FUNCTION - NEVER EXPORT AS SERVER ACTION
export async function internal_grantAwardXP(userId: string, actionType: string, amount: number, referenceId?: string) {
    const payload = {
        user_id: userId,
        action_type: actionType,
        xp_awarded: amount,
        reference_id: referenceId || null
    };

    const { error } = await supabaseAdmin.from('user_xp_logs').insert(payload);

    if (error) {
        if (error.code === '23505') {
            console.log(`[XP System] Ignored duplicate XP grant for ${actionType} - ${referenceId}`);
            return { success: true, warning: 'Already awarded' };
        }
        console.error("[XP System] Failed to award XP:", error);
        return { success: false, error: error.message };
    }

    console.log(`[XP System] Awarded ${amount} XP to ${userId} for ${actionType}`);

    let newQuestsData: any[] = [];
    if (!actionType.startsWith('quest_')) {
        const questResult = await internal_evaluateQuests(userId);
        if (questResult?.newQuestsData) {
            newQuestsData = questResult.newQuestsData;
        }
    }

    return { success: true, newQuestsData };
}

// INTERNAL SERVER FUNCTION - NEVER EXPORT AS SERVER ACTION
export async function internal_evaluateQuests(userId: string) {
    const supabase = createAdminClient();

    const { data: quests, error: questsError } = await supabase
        .from('gamification_quests')
        .select('*')
        .eq('is_active', true);
        
    if (questsError || !quests || quests.length === 0) return { success: true, newCompletions: 0 };

    const { data: userQuests } = await supabase
        .from('user_quests')
        .select('quest_id')
        .eq('user_id', userId);
        
    const completedQuestIds = new Set(userQuests?.map((q: any) => q.quest_id) || []);

    const pendingQuests = quests.filter((q: any) => !completedQuestIds.has(q.id));
    if (pendingQuests.length === 0) return { success: true, newCompletions: 0, newQuestsData: [] };

    let newCompletions = 0;
    const newQuestsData: any[] = [];
    const { data: xpLogs } = await supabase.from("user_xp_logs").select("xp_awarded, action_type").eq("user_id", userId);
    
    const globalStats = {
        lifetimeXP: xpLogs?.filter((log: any) => log.xp_awarded > 0).reduce((acc: number, log: any) => acc + log.xp_awarded, 0) || 0,
        videosWatchedCount: 0,
        shopPurchasesCount: 0,
        subscriptionMonths: 0
    };

    const { count: libraryItemsCompletedCount } = await supabase
        .from('library_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_completed', true);
    globalStats.videosWatchedCount = libraryItemsCompletedCount || 0;

    const { count: purchasedSkinsCount } = await supabase
        .from('user_unlocked_skins')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
    globalStats.shopPurchasesCount = purchasedSkinsCount || 0;

    const { data: activeSub } = await supabase
        .from('subscriptions')
        .select('created')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle();

    if (activeSub && activeSub.created) {
        const startDate = new Date(activeSub.created).getTime();
        const now = Date.now();
        const monthsPassed = Math.floor((now - startDate) / (1000 * 60 * 60 * 24 * 30.44));
        globalStats.subscriptionMonths = monthsPassed;
    }

    for (const quest of pendingQuests) {
        let conditionMet = false;

        switch (quest.trigger_type) {
            case 'lifetime_xp': conditionMet = globalStats.lifetimeXP >= quest.trigger_value; break;
            case 'videos_watched': conditionMet = globalStats.videosWatchedCount >= quest.trigger_value; break;
            case 'shop_purchases': conditionMet = globalStats.shopPurchasesCount >= quest.trigger_value; break;
            case 'subscription_months': conditionMet = globalStats.subscriptionMonths >= quest.trigger_value; break;
        }

        if (conditionMet) {
            const { error: insertError } = await supabase.from('user_quests').insert({ user_id: userId, quest_id: quest.id });
            
            if (!insertError) {
                newCompletions++;
                newQuestsData.push(quest);
                
                if (quest.reward_type === 'badge' || !quest.reward_type) {
                    if (quest.reward_xp && quest.reward_xp > 0) {
                        await internal_grantAwardXP(userId, 'quest_reward', quest.reward_xp, `quest_reward_${quest.id}`);
                    }
                } 
                else if (quest.reward_type === 'video' && quest.reward_item_id) {
                    await supabase.from('user_purchases').upsert({
                        user_id: userId,
                        library_item_id: quest.reward_item_id,
                        status: 'active',
                        systeme_io_order_id: `quest_reward_${quest.id}`
                    }, { onConflict: 'user_id,library_item_id' });
                }
                else if (quest.reward_type === 'avatar' && quest.reward_item_id) {
                    await supabase.from('user_unlocked_skins').insert({
                        user_id: userId,
                        skin_id: quest.reward_item_id
                    });
                }
            }
        }
    }

    return { success: true, newCompletions, newQuestsData };
}

// INTERNAL SERVER FUNCTION - NEVER EXPORT AS SERVER ACTION
export async function internal_calculateAndGrantXP(userId: string, videoId: string) {
    const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: oldLogs } = await supabase.from('user_xp_logs').select('xp_awarded').eq('user_id', userId);
    const oldXP = oldLogs ? oldLogs.reduce((acc: number, log: any) => acc + (log.xp_awarded > 0 ? log.xp_awarded : 0), 0) : 0;

    const welcomeRes = await internal_grantAwardXP(userId, "welcome_bonus", 100, `welcome_bonus_first_video`);
    const normalRes = await internal_grantAwardXP(userId, "video_completed", 50, `video_completed_${videoId}`);

    const unlockedWelcome = welcomeRes?.success && !welcomeRes.warning;
    const gainedXP = (unlockedWelcome ? 100 : 0) + (normalRes?.success && !normalRes.warning ? 50 : 0);
    
    const newQuestsData = [
        ...(welcomeRes?.newQuestsData || []),
        ...(normalRes?.newQuestsData || [])
    ];

    let leveledUpTo = null;

    if (gainedXP > 0) {
        const newXP = oldXP + gainedXP;
        const { data: levels } = await supabase.from('gamification_levels').select('*').order('xp_threshold', { ascending: false });
        
        const getTitle = (xp: number) => {
            if (!levels || levels.length === 0) {
                if (xp >= 40000) return "Sorcier Suprême";
                if (xp >= 150) return "Curieux de la Magie";
                if (xp >= 50) return "Magicien";
                return "Apprenti";
            }
            for (const level of levels) {
                if (xp >= level.xp_threshold) return level.name;
            }
            return levels[levels.length - 1].name;
        }
        
        const oldTitle = getTitle(oldXP);
        const newTitle = getTitle(newXP);

        if (oldTitle !== newTitle) {
            leveledUpTo = newTitle;
            await supabase.from('profiles').update({ magic_level: newTitle }).eq('id', userId);
        }
    }

    return { unlockedWelcome, gainedXP, leveledUpTo, newQuestsData };
}
