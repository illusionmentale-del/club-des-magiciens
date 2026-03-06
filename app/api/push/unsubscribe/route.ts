import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { endpoint } = body;

        if (!endpoint) {
            return NextResponse.json({ error: "Endpoint manquant." }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
        }

        // Suppression de l'abonnement
        const { error } = await supabase
            .from("push_subscriptions")
            .delete()
            .eq("user_id", user.id)
            .eq("endpoint", endpoint);

        if (error) {
            console.error("Erreur Supabase lors de la suppression de l'abonnement:", error);
            return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: "Abonnement supprimé avec succès." });

    } catch (error) {
        console.error("Erreur serveur push unsubscribe:", error);
        return NextResponse.json({ error: "Erreur serveur inattendue." }, { status: 500 });
    }
}
