import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AccountForm from "./AccountForm";

export default async function AccountPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-4xl font-serif text-magic-gold mb-2">Mon Profil de Magicien</h1>
                    <p className="text-gray-400">Personnalisez votre identité secrète.</p>
                </header>

                <AccountForm user={user} profile={profile} />
            </div>
        </div>
    );
}
