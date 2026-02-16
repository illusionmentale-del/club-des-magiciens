"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleLike(courseId: string, isLike: boolean) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Check if vote exists
    const { data: existingVote } = await supabase
        .from("course_likes")
        .select("*")
        .eq("user_id", user.id)
        .eq("course_id", courseId)
        .single();

    if (existingVote) {
        if (existingVote.is_like === isLike) {
            // Remove vote if clicking same button (toggle off)
            await supabase.from("course_likes").delete().eq("id", existingVote.id);
        } else {
            // Change vote (up to down or vice versa)
            await supabase.from("course_likes").update({ is_like: isLike }).eq("id", existingVote.id);
        }
    } else {
        // Create new vote
        await supabase.from("course_likes").insert({
            user_id: user.id,
            course_id: courseId,
            is_like: isLike
        });
    }

    revalidatePath(`/watch/${courseId}`);
    revalidatePath(`/kids/courses`);
}

export async function addComment(courseId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");
    if (!content.trim()) return;

    await supabase.from("course_comments").insert({
        user_id: user.id,
        course_id: courseId,
        content: content.trim()
    });

    revalidatePath(`/watch/${courseId}`);
}
