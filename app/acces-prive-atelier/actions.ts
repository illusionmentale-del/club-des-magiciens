"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitAdultVIPRequest(formData: FormData) {
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const context = formData.get("context") as string;
    const newsletter = formData.get("newsletter") as string;

    if (!fullName || !email || !context) {
        return { success: false, error: "Tous les champs sont requis." };
    }
    if (!email.includes("@")) {
        return { success: false, error: "L'adresse e-mail semble invalide." };
    }

    try {
        const supabase = await createClient();
        
        const { error } = await supabase
            .from("adult_vip_requests")
            .insert({
                full_name: fullName.trim(),
                email: email.trim().toLowerCase(),
                context: context.trim(),
                wants_newsletter: newsletter === "yes",
            });

        if (error) {
            console.error("Erreur lors de l'insertion VIP Adulte:", error);
            // It might fail if the table doesn't exist yet, we should give a gentle message
            return { success: false, error: "Une erreur est survenue lors de l'envoi. (Table manquante ?)" };
        }

        return { success: true };
    } catch (err) {
        console.error("Exception in submitAdultVIPRequest:", err);
        return { success: false, error: "Erreur inattendue." };
    }
}
