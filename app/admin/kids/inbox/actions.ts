"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { ReplyNotificationEmail } from "@/components/emails/ReplyNotificationEmail";

export async function markAsReadAndReply(originalCommentId: string, courseId: string, content: string, mediaType: 'text' | 'video_bunny' | 'pdf', mediaUrl: string, mediaTitle: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Fetch the original comment to get the target_user_id
    const { data: originalComment } = await supabase
        .from("course_comments")
        .select(`
            user_id,
            profiles(email, full_name)
        `)
        .eq("id", originalCommentId)
        .single();

    let targetUserId = null;
    let targetEmail = null;
    let targetName = "Apprenti Magicien";

    if (originalComment) {
        targetUserId = originalComment.user_id;
        const profile = Array.isArray(originalComment.profiles) ? originalComment.profiles[0] : originalComment.profiles;
        if (profile) {
            targetEmail = profile.email;
            targetName = profile.full_name || targetName;
        }
    }

    // 1. Insert the Admin Reply
    await supabase.from("course_comments").insert({
        user_id: user.id,
        course_id: courseId,
        content: content.trim() || 'Voici ma réponse en vidéo/PDF !',
        media_type: mediaType,
        media_url: mediaUrl || null,
        media_title: mediaTitle || null,
        target_user_id: targetUserId,
        kid_notified: false // Trigger the red badge to the kid
    });

    // 2. Mark the original kid's question as read
    await supabase.from("course_comments").update({ is_read: true }).eq("id", originalCommentId);

    // 3. Send Email Notification to Parent
    if (targetEmail && process.env.RESEND_API_KEY) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const fromEmail = 'Club des Petits Magiciens <contact@clubdespetitsmagiciens.fr>';

            await resend.emails.send({
                from: fromEmail,
                to: [targetEmail],
                subject: '🎩 Jérémy a répondu à la question magique !',
                react: ReplyNotificationEmail({
                    kidName: targetName,
                    videoUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://clubdespetitsmagiciens.fr'}/kids/videos/${courseId}`,
                    messageContent: content.trim(),
                    mediaTitle: mediaTitle
                }),
            });
        } catch (e) {
            console.error("Failed to send reply notification email:", e);
        }
    }

    revalidatePath("/admin/kids/inbox");
    revalidatePath(`/kids/videos/${courseId}`);
    revalidatePath("/kids"); // Revalidate sidebar
}

export async function dismissQuestion(commentId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    await supabase.from("course_comments").update({ is_read: true }).eq("id", commentId);
    revalidatePath("/admin/kids/inbox");
}
