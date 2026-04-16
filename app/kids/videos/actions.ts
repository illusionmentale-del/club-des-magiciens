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
        const xpEvent = await calculateAndGrantXP(user.id, videoId);
        return { success: true, ...xpEvent };
    }

    return { success: true };
}

/**
 * Logique centrale de calcul d'XP et de niveau pour tout type de validation de vidéo
 */
export async function calculateAndGrantXP(userId: string, videoId: string) {
    const { grantAwardXP } = await import("@/app/actions/xp");
    const supabase = await createClient();

    // Fetch old lifetime XP
    const { data: oldLogs } = await supabase.from('user_xp_logs').select('xp_awarded').eq('user_id', userId);
    const oldXP = oldLogs ? oldLogs.reduce((acc, log) => acc + (log.xp_awarded > 0 ? log.xp_awarded : 0), 0) : 0;

    // 1. Bonus de bienvenue (Seule la 1ère vidéo le débloquera grâce à l'unicité stricte)
    const welcomeRes = await grantAwardXP(userId, "welcome_bonus", 100, `welcome_bonus_first_video`);

    // 2. XP normal pour la complétion (50 points par vidéo)
    const normalRes = await grantAwardXP(userId, "video_completed", 50, `video_completed_${videoId}`);

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
            // Update profile with the new title
            await supabase.from('profiles').update({ magic_level: newTitle }).eq('id', userId);
        }
    }

    return { unlockedWelcome, gainedXP, leveledUpTo, newQuestsData };
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

    // Grant XP
    const xpEvent = await calculateAndGrantXP(user.id, itemId);

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
    const xpEvent = await calculateAndGrantXP(user.id, videoId);

    return { success: true, ...xpEvent };
}
