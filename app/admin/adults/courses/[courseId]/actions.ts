"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addVideoToCourse(courseId: string, data: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from("videos").insert({
        course_id: courseId,
        title: data.title,
        video_url: data.video_url,
        description: data.description,
        resource_url: data.resource_url,
        position: data.position || 0
    });

    if (error) throw error;
    revalidatePath(`/admin/adults/courses/${courseId}`);
}

export async function updateVideoInCourse(videoId: string, courseId: string, data: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from("videos").update({
        title: data.title,
        video_url: data.video_url,
        description: data.description,
        resource_url: data.resource_url,
        position: data.position
    }).eq("id", videoId);

    if (error) throw error;
    revalidatePath(`/admin/adults/courses/${courseId}`);
}

export async function deleteVideoFromCourse(videoId: string, courseId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from("videos").delete().eq("id", videoId);

    if (error) throw error;
    revalidatePath(`/admin/adults/courses/${courseId}`);
}
