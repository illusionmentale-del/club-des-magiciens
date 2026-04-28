"use server";

import { createClient } from "@/lib/supabase/server";

export async function getKidsDashboardStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profileCheck } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profileCheck?.role !== 'admin') return null;

    // 1. Get total kids profiles and tracking connections
    // Fix: previous code used .eq('role', 'kid') which was wrong, users have role 'user' and access_level 'kid'
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, last_kids_login, xp, magic_level')
        .or('access_level.eq.kid,has_kids_access.eq.true'); 

    if (profileError || !profiles) {
        console.error("Failed to fetch kid profiles", profileError);
        return null;
    }

    const totalKids = profiles.length;
    const now = new Date();

    // Active last 7 days
    const activeKids = profiles.filter(p => {
        if (!p.last_kids_login) return false;
        const diffTime = Math.abs(now.getTime() - new Date(p.last_kids_login).getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 7;
    });

    // Ghosts (no login for 14+ days)
    const ghostKids = profiles.filter(p => {
        if (!p.last_kids_login) return true; // Never logged in
        const diffTime = Math.abs(now.getTime() - new Date(p.last_kids_login).getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) > 14;
    });

    // Leaderboard
    const sortedByXP = [...profiles].sort((a, b) => (b.xp || 0) - (a.xp || 0));
    const leaderboard = sortedByXP.slice(0, 5);
    const totalXpGenerated = profiles.reduce((sum, p) => sum + (p.xp || 0), 0);

    // Level Distribution
    const levelCounts: Record<string, number> = {};
    profiles.forEach(p => {
        const lvl = p.magic_level || 'Apprenti';
        levelCounts[lvl] = (levelCounts[lvl] || 0) + 1;
    });
    
    // Define an ordered list of levels if we want them sorted correctly, or just sort by count
    const levelDistribution = Object.keys(levelCounts).map(lvl => ({
        name: lvl,
        count: levelCounts[lvl],
        percent: Math.round((levelCounts[lvl] / totalKids) * 100)
    })).sort((a, b) => b.count - a.count);

    // 2. Get video progress grouped by video
    const { data: videoProgress } = await supabase.from('kids_video_progress').select('video_id, progress_seconds, progress_percent, is_completed');
    const { data: libProgress } = await supabase.from('library_progress').select('item_id, status');

    // Total Quests
    const { count: totalQuestsCompleted } = await supabase.from('user_quests').select('*', { count: 'exact', head: true });

    // Most Popular Skins
    const { data: unlockedSkins } = await supabase.from('user_unlocked_skins').select('skin_id');
    const skinCounts: Record<string, number> = {};
    (unlockedSkins || []).forEach(us => {
        skinCounts[us.skin_id] = (skinCounts[us.skin_id] || 0) + 1;
    });

    const { data: allAvatars } = await supabase.from('avatar_skins').select('id, name, image_url');
    const popularSkins = Object.keys(skinCounts)
        .map(skinId => {
            const avatar = allAvatars?.find(a => a.id === skinId);
            return {
                skinId,
                name: avatar?.name || 'Avatar Inconnu',
                imageUrl: avatar?.image_url,
                unlocks: skinCounts[skinId]
            };
        })
        .filter(s => s.imageUrl) // Filter out deleted skins
        .sort((a, b) => b.unlocks - a.unlocks)
        .slice(0, 4);

    // Process top videos
    const videoStats: Record<string, { views: number, totalPercent: number, completions: number }> = {};
    let totalWatchTimeSeconds = 0;

    (videoProgress || []).forEach(vp => {
        totalWatchTimeSeconds += vp.progress_seconds || 0;

        if (!videoStats[vp.video_id]) {
            videoStats[vp.video_id] = { views: 0, totalPercent: 0, completions: 0 };
        }
        videoStats[vp.video_id].views++;
        videoStats[vp.video_id].totalPercent += vp.progress_percent || 0;
        if (vp.is_completed) {
            videoStats[vp.video_id].completions++;
        }
    });

    (libProgress || []).forEach(lp => {
        if (!videoStats[lp.item_id]) {
            videoStats[lp.item_id] = { views: 0, totalPercent: 0, completions: 0 };
        }
        videoStats[lp.item_id].views++;
        videoStats[lp.item_id].totalPercent += 100; // Library progress is binary completed
        if (lp.status === 'completed') {
            videoStats[lp.item_id].completions++;
        }
    });

    // Format top videos
    const topVideos = Object.keys(videoStats).map(videoId => {
        const stats = videoStats[videoId];
        return {
            videoId,
            views: stats.views,
            avgCompletion: Math.round(stats.totalPercent / stats.views),
            completions: stats.completions
        };
    }).sort((a, b) => b.views - a.views).slice(0, 5); // Top 5

    const videoUrls = topVideos.map(tv => tv.videoId.split('_')[1] || tv.videoId);

    let libraryData: any[] = [];
    if (videoUrls.length > 0) {
        const { data: libItems } = await supabase
            .from('library_items')
            .select('id, title, video_url')
            .or(`video_url.in.(${videoUrls.join(',')}),id.in.(${videoUrls.join(',')})`);
        if (libItems) libraryData = libItems;
    }

    const enhancedTopVideos = topVideos.map(tv => {
        const urlId = tv.videoId.split('_')[1] || tv.videoId;
        const match = libraryData.find(item => item.video_url === urlId || item.id === tv.videoId);
        return {
            ...tv,
            title: match?.title || `Vidéo (${urlId})`
        };
    });

    // Leaderboard Quests completed
    const { data: leaderboardQuests } = await supabase.from('user_quests').select('user_id').in('user_id', leaderboard.map(l => l.id));
    const questCounts: Record<string, number> = {};
    (leaderboardQuests || []).forEach(q => {
        questCounts[q.user_id] = (questCounts[q.user_id] || 0) + 1;
    });

    const enhancedLeaderboard = leaderboard.map(l => ({
        id: l.id,
        fullName: l.full_name || l.email?.split('@')[0] || "Inconnu",
        email: l.email,
        xp: l.xp || 0,
        magicLevel: l.magic_level || 'Apprenti',
        questsCompleted: questCounts[l.id] || 0
    }));

    return {
        totalKids,
        activeKidsCount: activeKids.length,
        totalWatchTimeHours: Math.round(totalWatchTimeSeconds / 3600),
        ghostKids: ghostKids.map(k => ({ ...k, fullName: k.full_name || k.email?.split('@')[0] || "Inconnu" })),
        topVideos: enhancedTopVideos,
        totalXpGenerated,
        totalQuestsCompleted: totalQuestsCompleted || 0,
        leaderboard: enhancedLeaderboard,
        levelDistribution,
        popularSkins
    };
}
