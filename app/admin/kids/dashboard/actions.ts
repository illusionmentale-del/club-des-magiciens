"use server";

import { createClient } from "@/lib/supabase/server";

export async function getKidsDashboardStats() {
    const supabase = await createClient();

    // 1. Get total kids profiles and tracking connections
    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, full_name, email, last_kids_login')
        .eq('role', 'kid'); // Ensure we only target kids

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

    // 2. Get video progress grouped by video
    const { data: videoProgress, error: vpError } = await supabase
        .from('kids_video_progress')
        .select('video_id, progress_seconds, progress_percent, is_completed, updated_at, user_id');

    if (vpError) {
        console.error("Failed to fetch video progress", vpError);
        return null;
    }

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

    // 3. To bring real titles, we would cross reference with Bunny or Library
    // We will do a simple join with library_items if available
    const videoUrls = topVideos.map(tv => tv.videoId.split('_')[1] || tv.videoId);

    let libraryData: any[] = [];
    if (videoUrls.length > 0) {
        const { data: libItems } = await supabase
            .from('library_items')
            .select('title, video_url')
            .in('video_url', videoUrls);
        if (libItems) libraryData = libItems;
    }

    const enhancedTopVideos = topVideos.map(tv => {
        const urlId = tv.videoId.split('_')[1] || tv.videoId;
        const match = libraryData.find(item => item.video_url === urlId);
        return {
            ...tv,
            title: match?.title || `Vidéo (${urlId})`
        };
    });

    return {
        totalKids,
        activeKidsCount: activeKids.length,
        totalWatchTimeHours: Math.round(totalWatchTimeSeconds / 3600),
        ghostKids,
        topVideos: enhancedTopVideos
    };
}
