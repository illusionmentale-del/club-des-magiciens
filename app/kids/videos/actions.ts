"use server";

import { createClient } from "@/lib/supabase/server";

export async function saveKidsVideoProgress(videoId: string, progressSeconds: number, totalSeconds: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "Not logged in" };
    }

    const progressPercent = totalSeconds > 0 ? Math.round((progressSeconds / totalSeconds) * 100) : 0;
    const isCompleted = progressPercent >= 90;

    const { error } = await supabase
        .from('kids_video_progress')
        .upsert(
            {
                user_id: user.id,
                video_id: videoId,
                progress_seconds: Math.floor(progressSeconds),
                progress_percent: progressPercent,
                is_completed: isCompleted,
                updated_at: new Date().toISOString()
            },
            { onConflict: 'user_id,video_id' }
        );

    if (error) {
        console.error("Failed to save video progress:", error);
        return { success: false, error: error.message };
    }

    // AWARD XP IF COMPLETED (Inviolable backend logic)
    if (isCompleted) {
        const { grantAwardXP } = await import("@/app/actions/xp");
        
        // On accorde 50 points d'XP pour avoir fini une vidéo d'entrainement.
        // Le reference_id empêche d'avoir l'XP 2 fois pour la même vidéo ("video_completed_xyz")
        await grantAwardXP(user.id, "video_completed", 50, `video_completed_${videoId}`);
    }

    return { success: true };
}
