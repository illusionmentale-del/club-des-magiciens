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
        content: content.trim(),
        context: 'kids'
    });

    if (currentPath) {
        revalidatePath(currentPath);
    } else {
        revalidatePath(`/kids/videos/${videoId}`);
        revalidatePath(`/watch/${videoId}`);
    }
}

export async function deleteKidsComment(commentId: string, currentPath?: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    // Verify requesting user is admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    // Also check if admin by email backup
    const isAdmin = profile?.role === 'admin' || (user.email?.includes('admin@') ?? false);

    if (!isAdmin) {
        throw new Error("Forbidden - Admins only");
    }

    // We must use the Service Role Key here to bypass any potential RLS issues
    // just like we did in the inbox, ensuring the admin can delete *any* comment.
    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseAdmin(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { error } = await supabaseAdmin
        .from("course_comments")
        .delete()
        .eq("id", commentId);

    if (error) {
        console.error("Error deleting comment:", error);
        throw new Error("Failed to delete comment");
    }

    if (currentPath) {
        revalidatePath(currentPath);
    }
}
