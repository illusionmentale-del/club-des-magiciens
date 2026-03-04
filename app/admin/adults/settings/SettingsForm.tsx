"use client";

import { updateSettings } from "@/app/admin/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { LogoCropper } from "@/components/LogoCropper";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

type SettingsFormProps = {
    settings: Record<string, string>;
};

export default function SettingsForm({ settings }: SettingsFormProps) {
    const getValue = (key: string) => {
        return settings[key] || "";
    };

    return (
        <div className="min-h-screen transition-colors duration-500 bg-magic-bg">
            <div className="p-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className="p-2 rounded-lg transition-colors bg-white/5 hover:bg-white/10 text-white">
                                <ArrowLeft />
                            </Link>
                            <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
                                <Shield className="w-8 h-8 text-blue-400" />
                                Paramètres de la Vitrine <span className="text-sm font-normal text-slate-400 mt-2 ml-2">(Logo, Textes, RS)</span>
                            </h1>
                        </div>
                    </header>

                    <div className="bg-magic-card border border-white/10 p-8 rounded-2xl shadow-xl transition-all duration-500">
                        <form action={updateSettings} className="space-y-8">
                            <input type="hidden" name="context" value="adult" />

                            <section className="space-y-4">
                                <h3 className="font-bold text-gray-400 uppercase tracking-wider text-xs">Logo du Site (Adulte)</h3>
                                <LogoCropper currentLogo={getValue("site_logo") || undefined} />
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-bold text-magic-gold border-b border-white/10 pb-2">Textes Généraux</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Titre Principal Dashboard</label>
                                    <input
                                        type="text"
                                        name="dashboard_title"
                                        defaultValue={getValue("dashboard_title")}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-xl p-3 focus:ring-2 focus:ring-magic-purple outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Message de Bienvenue</label>
                                    <textarea
                                        name="welcome_message"
                                        rows={3}
                                        defaultValue={getValue("welcome_message")}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-xl p-3 focus:ring-2 focus:ring-magic-purple outline-none transition-all"
                                    />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-bold text-magic-gold border-b border-white/10 pb-2">Sections</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Titre Section News</label>
                                    <input
                                        type="text"
                                        name="news_title"
                                        defaultValue={getValue("news_title")}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-xl p-3 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Titre Section Instagram</label>
                                    <input
                                        type="text"
                                        name="instagram_title"
                                        defaultValue={getValue("instagram_title")}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-xl p-3 outline-none"
                                    />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-bold text-magic-gold border-b border-white/10 pb-2">Réseaux Sociaux (Barre Latérale)</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['youtube', 'instagram', 'facebook', 'tiktok'].map((social) => (
                                        <div key={social}>
                                            <label className="block text-sm font-medium text-gray-400 mb-1 capitalize">{social} (URL)</label>
                                            <input
                                                type="url"
                                                name={`social_${social}`}
                                                defaultValue={getValue(`social_${social}`)}
                                                className="w-full bg-black/50 border border-white/10 text-white rounded-xl p-3 outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className="text-xl font-bold text-magic-gold border-b border-white/10 pb-2">Contenu Multimédia</h2>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">ID Vidéo YouTube à la une</label>
                                    <input
                                        type="text"
                                        name="featured_video"
                                        defaultValue={getValue("featured_video")}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-xl p-3 outline-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">L'ID est la partie après 'v=' dans l'URL. Ex: 5K17iK1vF6s</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Lien Global Boutique (Fallback)</label>
                                    <input
                                        type="url"
                                        name="shop_link"
                                        defaultValue={getValue("shop_link")}
                                        className="w-full bg-black/50 border border-white/10 text-white rounded-xl p-3 outline-none"
                                    />
                                </div>
                            </section>

                            <div className="pt-4 sticky bottom-4 z-10 bg-magic-card/90 backdrop-blur pb-2">
                                <SubmitButton label="Sauvegarder" />
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
