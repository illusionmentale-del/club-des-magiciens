"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitVIPRequest(formData: FormData) {
    const childName = formData.get("childName") as string;
    const parentEmail = formData.get("parentEmail") as string;
    const context = formData.get("context") as string;

    if (!childName || !parentEmail || !context) {
        return { success: false, error: "Tous les champs sont requis." };
    }
    if (!parentEmail.includes("@")) {
        return { success: false, error: "L'adresse email semble invalide." };
    }

    try {
        const supabase = await createClient();
        
        const { error } = await supabase
            .from("vip_requests")
            .insert({
                child_name: childName.trim(),
                parent_email: parentEmail.trim().toLowerCase(),
                context: context.trim(),
            });

        if (error) {
            console.error("Erreur lors de l'insertion VIP:", error);
            return { success: false, error: "Une erreur est survenue lors de l'envoi." };
        }

        return { success: true };
    } catch (err) {
        console.error("Exception in submitVIPRequest:", err);
        return { success: false, error: "Erreur inattendue." };
    }
}
