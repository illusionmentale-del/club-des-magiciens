"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function dismissGlobalAlert(alertId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Non autorisé" };

    const { error } = await supabase.from("user_alerts_read").insert({
        alert_id: alertId,
        user_id: user.id
    });

    if (error) {
        // Code 23505 = unique_violation, meaning already read
        if (error.code !== "23505") {
            console.error("Error dismissing alert:", error);
            return { error: "Erreur lors de la validation de l'alerte." };
        }
    }

    revalidatePath("/kids");
    return { success: true };
}
