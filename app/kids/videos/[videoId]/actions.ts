"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addKidsComment(videoId: string, content: string, currentPath?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");
    if (!content.trim()) return;

    // We reuse the course_comments table, passing the Bunny GUID as course_id
    await supabase.from("course_comments").insert({
        user_id: user.id,
        course_id: videoId,
        content: content.trim()
    });

    if (currentPath) {
        revalidatePath(currentPath);
    } else {
        revalidatePath(`/kids/videos/${videoId}`);
        revalidatePath(`/watch/${videoId}`);
    }
}
