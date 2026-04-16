"use server";

import { createClient } from "@/lib/supabase/server";
import { grantAwardXP } from "./xp";

export async function evaluateQuests(userId: string) {
    const supabase = await createClient();

    // 1. Fetch available active quests
    const { data: quests, error: questsError } = await supabase
        .from('gamification_quests')
        .select('*')
        .eq('is_active', true);
        
    if (questsError || !quests || quests.length === 0) return { success: true, newCompletions: 0 };

    // 2. Fetch quests already completed by user
    const { data: userQuests } = await supabase
        .from('user_quests')
        .select('quest_id')
        .eq('user_id', userId);
        
    const completedQuestIds = new Set(userQuests?.map(q => q.quest_id) || []);

    // Filter quests the user has NOT completed yet
    const pendingQuests = quests.filter((q: any) => !completedQuestIds.has(q.id));
    
    if (pendingQuests.length === 0) return { success: true, newCompletions: 0, newQuestsData: [] };

    let newCompletions = 0;
    const newQuestsData: any[] = [];
    const { data: xpLogs } = await supabase.from("user_xp_logs").select("xp_awarded, action_type").eq("user_id", userId);
    
    // Calculate global stats for the user once
    const globalStats = {
        lifetimeXP: xpLogs?.filter(log => log.xp_awarded > 0).reduce((acc, log) => acc + log.xp_awarded, 0) || 0,
        videosWatchedCount: 0,
        shopPurchasesCount: 0,
        subscriptionMonths: 0
    };

    // 1. Accuracy on videos watched
    const { count: libraryItemsCompletedCount } = await supabase
        .from('library_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_completed', true);
    globalStats.videosWatchedCount = libraryItemsCompletedCount || 0;

    // 2. Accuracy on shop purchases (skins unlocked)
    const { count: purchasedSkinsCount } = await supabase
        .from('user_unlocked_skins')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
    globalStats.shopPurchasesCount = purchasedSkinsCount || 0;

    // 3. Accuracy on subscription months
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
            case 'lifetime_xp':
                conditionMet = globalStats.lifetimeXP >= quest.trigger_value;
                break;
            case 'videos_watched':
                conditionMet = globalStats.videosWatchedCount >= quest.trigger_value;
                break;
            case 'shop_purchases':
                conditionMet = globalStats.shopPurchasesCount >= quest.trigger_value;
                break;
            case 'subscription_months':
                conditionMet = globalStats.subscriptionMonths >= quest.trigger_value;
                break;
            case 'consecutive_days':
                // Not implemented yet, ignore
                conditionMet = false;
                break;
        }

        if (conditionMet) {
            // Unlocked Quest!
            // 1. Insert into user_quests to prevent duplicate rewards
            const { error: insertError } = await supabase.from('user_quests').insert({
                user_id: userId,
                quest_id: quest.id
            });
            
            if (!insertError) {
                newCompletions++;
                newQuestsData.push(quest);
                console.log(`[Quest System] User ${userId} completed quest "${quest.title}"`);
                
                // 2. Grant Reward
                if (quest.reward_xp && quest.reward_xp > 0) {
                    await grantAwardXP(userId, 'quest_reward', quest.reward_xp, `quest_reward_${quest.id}`);
                }
                
                // 3. Grant Specific Item Reward (if any)
                if (quest.reward_item_id) {
                    await supabase.from('user_purchases').upsert({
                        user_id: userId,
                        library_item_id: quest.reward_item_id,
                        status: 'active',
                        systeme_io_order_id: `quest_reward_${quest.id}`
                    }, { onConflict: 'user_id,library_item_id' });
                    console.log(`[Quest System] User ${userId} unlocked item ${quest.reward_item_id} from quest`);
                }
            } else {
                console.error("[Quest System] Error completing quest:", insertError);
            }
        }
    }

    return { success: true, newCompletions, newQuestsData };
}
