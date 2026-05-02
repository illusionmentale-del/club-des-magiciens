"use server";

import { createClient } from "@/lib/supabase/server";

export async function getAdultsDashboardStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profileCheck } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profileCheck?.role !== 'admin') return null;

    // 1. Get total adult profiles and tracking connections
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, last_adults_login, xp')
        .eq('has_adults_access', true); 

    if (profileError || !profiles) {
        console.error("Failed to fetch adult profiles", profileError);
        return null;
    }

    const totalAdults = profiles.length;
    const now = new Date();

    // Active last 7 days
    const activeAdults = profiles.filter(p => {
        if (!p.last_adults_login) return false;
        const diffTime = Math.abs(now.getTime() - new Date(p.last_adults_login).getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) <= 7;
    });

    // Ghosts (no login for 14+ days)
    const ghostAdults = profiles.filter(p => {
        if (!p.last_adults_login) return true; // Never logged in
        const diffTime = Math.abs(now.getTime() - new Date(p.last_adults_login).getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) > 14;
    });

    // Leaderboard
    const sortedByXP = [...profiles].sort((a, b) => (b.xp || 0) - (a.xp || 0));
    const leaderboard = sortedByXP.slice(0, 5);
    const totalXpGenerated = profiles.reduce((sum, p) => sum + (p.xp || 0), 0);

    const enhancedLeaderboard = leaderboard.map(l => {
        // Determine level based on adult logic
        let magicLevel = "Initié";
        if ((l.xp || 0) >= 150) magicLevel = "Illusionniste Confirmé";
        else if ((l.xp || 0) >= 50) magicLevel = "Praticien";

        return {
            id: l.id,
            fullName: l.full_name || l.email?.split('@')[0] || "Inconnu",
            email: l.email,
            xp: l.xp || 0,
            magicLevel: magicLevel
        };
    });

    // Level Distribution
    const levelCounts: Record<string, number> = {
        "Initié": 0,
        "Praticien": 0,
        "Illusionniste Confirmé": 0
    };
    
    profiles.forEach(p => {
        const xp = p.xp || 0;
        let lvl = "Initié";
        if (xp >= 150) lvl = "Illusionniste Confirmé";
        else if (xp >= 50) lvl = "Praticien";
        levelCounts[lvl]++;
    });
    
    const levelDistribution = Object.keys(levelCounts).map(lvl => ({
        name: lvl,
        count: levelCounts[lvl],
        percent: Math.round((levelCounts[lvl] / (totalAdults || 1)) * 100)
    })).sort((a, b) => b.count - a.count);

    // 2. Get video progress
    const { data: videoProgress } = await supabase.from('kids_video_progress').select('video_id, progress_seconds, progress_percent, is_completed').in('user_id', profiles.map(p => p.id));
    const { data: libProgress } = await supabase.from('library_progress').select('item_id, status').in('user_id', profiles.map(p => p.id));

    // Process top videos
    const videoStats: Record<string, { views: number, totalPercent: number, completions: number }> = {};
    
    (videoProgress || []).forEach(vp => {
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
        videoStats[lp.item_id].totalPercent += 100;
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
    }).sort((a, b) => b.views - a.views).slice(0, 5);

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

    return {
        totalAdults,
        activeAdultsCount: activeAdults.length,
        ghostAdults: ghostAdults.map(k => ({ ...k, fullName: k.full_name || k.email?.split('@')[0] || "Inconnu" })),
        topVideos: enhancedTopVideos,
        totalXpGenerated,
        leaderboard: enhancedLeaderboard,
        levelDistribution
    };
}
