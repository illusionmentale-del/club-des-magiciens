import { createClient } from "@/lib/supabase/server";
import { updateSettings } from "../actions";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { SubmitButton } from "@/components/SubmitButton";
import { LogoCropper } from "@/components/LogoCropper";

export default async function AdminSettingsPage() {
    const supabase = await createClient();
    const { data: settings } = await supabase.from("settings").select("*");

    const settingsMap = settings?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>) || {};

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8">
            <div className="max-w-2xl mx-auto">
                <header className="flex items-center gap-4 mb-8">
                    <Link href="/admin" className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><ArrowLeft /></Link>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Shield className="w-8 h-8 text-blue-400" />
                        Paramètres du QG
                    </h1>
                </header>

                <div className="bg-magic-card border border-white/10 p-8 rounded-2xl">
                    <form action={updateSettings.bind(null, null)} className="space-y-8">

                        <section className="space-y-4">
                            <LogoCropper currentLogo={settingsMap["site_logo"]} />
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-magic-gold border-b border-white/10 pb-2">Textes Généraux</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Titre Principal Dashboard</label>
                                <input type="text" name="dashboard_title" defaultValue={settingsMap["dashboard_title"] || "Le QG du Club ✨"}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Message de Bienvenue</label>
                                <textarea name="welcome_message" rows={3} defaultValue={settingsMap["welcome_message"]}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-magic-gold border-b border-white/10 pb-2">Sections</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Titre Section News</label>
                                <input type="text" name="news_title" defaultValue={settingsMap["news_title"] || "Quoi de neuf ?"}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Titre Section Instagram</label>
                                <input type="text" name="instagram_title" defaultValue={settingsMap["instagram_title"] || "Sur Instagram"}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-magic-gold border-b border-white/10 pb-2">Réseaux Sociaux (Barre Latérale)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">YouTube (URL)</label>
                                    <input type="url" name="social_youtube" defaultValue={settingsMap["social_youtube"] || "https://youtube.com/@LeMagicienPOV"}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Instagram (URL)</label>
                                    <input type="url" name="social_instagram" defaultValue={settingsMap["social_instagram"] || "https://instagram.com/LeMagicienPOV"}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Facebook (URL)</label>
                                    <input type="url" name="social_facebook" defaultValue={settingsMap["social_facebook"] || "https://facebook.com/LeMagicienPOV"}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">TikTok (URL)</label>
                                    <input type="url" name="social_tiktok" defaultValue={settingsMap["social_tiktok"] || "https://tiktok.com/@LeMagicienPOV"}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-magic-gold border-b border-white/10 pb-2">Contenu Multimédia</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">ID Vidéo YouTube à la une</label>
                                <input type="text" name="featured_video" defaultValue={settingsMap["featured_video"]}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                                <p className="text-xs text-gray-500 mt-1">L'ID est la partie après 'v=' dans l'URL. Ex: 5K17iK1vF6s</p>
                            </div>

                            {/* Legacy Shop Link - Kept just in case, but Products override */}
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Lien Global Boutique (Fallback)</label>
                                <input type="url" name="shop_link" defaultValue={settingsMap["shop_link"]}
                                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white" />
                            </div>
                        </section>

                        <div className="pt-4 sticky bottom-4">
                            <SubmitButton />
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
