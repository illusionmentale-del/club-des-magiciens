"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addComment(courseId: string, prevState: any, formData: FormData) {
    const supabase = await createClient();
    const content = formData.get("content") as string;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "Vous devez être connecté pour commenter." };

    if (!content || content.trim().length === 0) {
        return { error: "Le commentaire ne peut pas être vide." };
    }

    const { error } = await supabase
        .from("comments")
        .insert({
            course_id: courseId,
            user_id: user.id,
            content: content
        });

    if (error) {
        return { error: "Erreur lors de l'ajout du commentaire." };
    }

    revalidatePath(`/watch/${courseId}`);
    return { success: true };
}
