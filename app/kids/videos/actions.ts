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
        const { internal_calculateAndGrantXP } = await import("@/lib/gamification");
        const xpEvent = await internal_calculateAndGrantXP(user.id, videoId);
        return { success: true, ...xpEvent };
    }

    return { success: true };
}

/**
 * Validation manuelle ("JE VALIDE !") pour les LibraryItems (Les Ateliers)
 */
export async function validateKidsLibraryItem(itemId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non connecté" };

    const { error } = await supabase.from("library_progress").upsert({
        user_id: user.id,
        item_id: itemId
    });

    if (error) return { success: false, error: error.message };

    // Calculate XP
    const { internal_calculateAndGrantXP } = await import("@/lib/gamification");
    const xpEvent = await internal_calculateAndGrantXP(user.id, itemId);

    return { success: true, ...xpEvent };
}

/**
 * Validation manuelle ("Marquer comme terminé") pour les Courses Videos (La Formation)
 */
export async function validateKidsCourseVideo(videoId: string, courseId: string, markAsDone: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Non connecté" };

    if (!markAsDone) {
        await supabase
            .from("user_progress")
            .delete()
            .eq("user_id", user.id)
            .eq("video_id", videoId);
        return { success: true };
    }

    const { error } = await supabase
        .from("user_progress")
        .upsert({
            user_id: user.id,
            video_id: videoId,
            course_id: courseId,
            is_completed: true,
            last_watched_at: new Date().toISOString()
        });

    if (error) return { success: false, error: error.message };

    // Grant XP
    const { internal_calculateAndGrantXP } = await import('@/lib/gamification');
    const xpEvent = await internal_calculateAndGrantXP(user.id, videoId);

    return { success: true, ...xpEvent };
}
