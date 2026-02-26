"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { ReplyNotificationEmail } from "@/components/emails/ReplyNotificationEmail";

export async function markAsReadAndReply(
    originalCommentId: string,
    courseId: string,
    content: string,
    mediaType: 'text' | 'video_bunny' | 'pdf',
    mediaUrl: string,
    mediaTitle: string,
    isBroadcast: boolean = false,
    targetUserId?: string,
    context: string = 'kids'
) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Check if user has admin role
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== 'admin' && !user.email?.includes('admin@')) {
        throw new Error("Unauthorized");
    }

    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Fetch the original comment to get the target_user_id
    const { data: originalComment } = await supabaseAdmin
        .from("course_comments")
        .select(`
            user_id,
            profiles(email, full_name)
        `)
        .eq("id", originalCommentId)
        .single();

    let finalTargetUserId = targetUserId || null;
    let targetEmail = null;
    let targetName = "Apprenti Magicien";

    if (originalComment) {
        finalTargetUserId = finalTargetUserId || originalComment.user_id;
        const profile = Array.isArray(originalComment.profiles) ? originalComment.profiles[0] : originalComment.profiles;
        if (profile) {
            targetEmail = profile.email;
            targetName = profile.full_name || targetName;
        }
    }

    // 1. Insert the Admin Reply
    await supabaseAdmin.from("course_comments").insert({
        user_id: user.id,
        course_id: courseId,
        content: content.trim() || 'Voici ma réponse en vidéo/PDF !',
        media_type: mediaType,
        media_url: mediaUrl || null,
        media_title: mediaTitle || null,
        target_user_id: isBroadcast ? null : finalTargetUserId, // If broadcast, no specific target
        kid_notified: false, // Trigger the red badge to the student
        context: context // Ensure the reply stays within the right ecosystem
    });

    // 2. Mark the original kid's question as read
    await supabaseAdmin.from("course_comments").update({ is_read: true }).eq("id", originalCommentId);

    // 3. Send Email Notification(s)
    if (process.env.RESEND_API_KEY) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            const fromEmail = 'Club des Petits Magiciens <contact@clubdespetitsmagiciens.fr>';
            const videoLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://clubdespetitsmagiciens.fr'}/watch/${courseId}`; // Unified link

            if (isBroadcast) {
                // Fetch all kids emails (parents) via admin client to bypass RLS
                const { data: kidsProfiles } = await supabaseAdmin
                    .from("profiles")
                    .select("email")
                    .eq("role", "kid")
                    .not("email", "is", null);

                if (kidsProfiles && kidsProfiles.length > 0) {
                    const bccList = kidsProfiles.map(p => p.email).filter(Boolean) as string[];
                    // Resend allows max 50 recipients per request, loop if necessary (assuming < 50 for now or chunks)
                    const chunkSize = 50;
                    for (let i = 0; i < bccList.length; i += chunkSize) {
                        const chunk = bccList.slice(i, i + chunkSize);
                        const { data, error } = await resend.emails.send({
                            from: fromEmail,
                            to: ['notifications@clubdespetitsmagiciens.fr'], // Dummy TO
                            bcc: chunk,
                            subject: '🎩 Nouvelle astuce magique de Jérémy !',
                            react: ReplyNotificationEmail({
                                kidName: 'Apprentis Magiciens',
                                videoUrl: videoLink,
                                messageContent: content.trim(),
                                mediaTitle: mediaTitle
                            }),
                        });

                        if (error) {
                            console.error("Resend API failed inside broadcast loop:", error);
                            throw new Error(`Broadcast failed on chunk: ${error.message}`);
                        } else {
                            console.log("Broadcast chunk sent successfully! Data:", data);
                        }
                    }
                }
            } else if (targetEmail) {
                // Standard notification to the single asking child
                await resend.emails.send({
                    from: fromEmail,
                    to: [targetEmail],
                    subject: '🎩 Jérémy a répondu à ta question magique !',
                    react: ReplyNotificationEmail({
                        kidName: targetName,
                        videoUrl: videoLink,
                        messageContent: content.trim(),
                        mediaTitle: mediaTitle
                    }),
                });
            }
        } catch (e) {
            console.error("Failed to send reply notification email:", e);
        }
    }

    revalidatePath("/admin/kids/inbox");
    // Depending on the section, courseId is either a UUID or a Bunny string
    revalidatePath(`/kids/videos/${courseId}`);
    revalidatePath(`/watch/${courseId}`);
    revalidatePath("/kids"); // Revalidate sidebar
}

export async function dismissQuestion(commentId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    if (profile?.role !== 'admin' && !user.email?.includes('admin@')) {
        throw new Error("Unauthorized");
    }

    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    await supabaseAdmin.from("course_comments").update({ is_read: true }).eq("id", commentId);
    revalidatePath("/admin/kids/inbox");
}

export async function deleteQuestion(commentId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Optional: Check if user has admin role
    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    if (profile?.role !== 'admin' && !user.email?.includes('admin@')) {
        throw new Error("Unauthorized: Only admins can delete questions");
    }

    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    await supabaseAdmin.from("course_comments").delete().eq("id", commentId);
    revalidatePath("/admin/kids/inbox");
}
