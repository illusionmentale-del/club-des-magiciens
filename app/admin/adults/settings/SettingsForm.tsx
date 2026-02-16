"use client";

import { useAdmin } from "../AdminContext";
import { updateSettings } from "@/app/admin/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { LogoCropper } from "@/components/LogoCropper";
import { User, Baby, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

type SettingsFormProps = {
    settings: Record<string, string>;
};

export default function SettingsForm({ settings }: SettingsFormProps) {
    const { audience, setAudience } = useAdmin();
    // Map context 'adults'|'kids' to form 'adult'|'kid'
    // If audience is 'all' (shouldn't happen in this view logic), default to 'adult'
    const mode = audience === 'kids' ? 'kid' : 'adult';

    const getValue = (key: string) => {
        if (mode === 'adult') return settings[key] || "";
        return settings[`kid_${key}`] || "";
    };

    // Helper to get fallback for placeholder
    const getPlaceholder = (key: string) => {
        if (mode === 'kid') return settings[key] || "Valeur par défaut (Adulte)";
        return "";
    }

    const themeColor = mode === 'adult' ? 'bg-magic-card' : 'bg-white text-gray-900';
    const textColor = mode === 'adult' ? 'text-white' : 'text-gray-900';
    const labelColor = mode === 'adult' ? 'text-gray-400' : 'text-gray-600';
    const inputBg = mode === 'adult' ? 'bg-black/50 border-white/10 text-white' : 'bg-gray-50 border-gray-300 text-gray-900';
    const borderColor = mode === 'adult' ? 'border-white/10' : 'border-gray-200';
    const titleColor = mode === 'adult' ? 'text-magic-gold' : 'text-purple-600';

    return (
        <div className={`min-h-screen transition-colors duration-500 ${mode === 'adult' ? 'bg-magic-bg' : 'bg-gray-100'}`}>
            <div className="p-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className={`p-2 rounded-lg transition-colors ${mode === 'adult' ? 'bg-white/5 hover:bg-white/10 text-white' : 'bg-white hover:bg-gray-200 text-gray-900 shadow-sm'}`}>
                                <ArrowLeft />
                            </Link>
                            <h1 className={`text-3xl font-bold flex items-center gap-2 ${mode === 'adult' ? 'text-white' : 'text-gray-900'}`}>
                                <Shield className={`w-8 h-8 ${mode === 'adult' ? 'text-blue-400' : 'text-purple-600'}`} />
                                Paramètres du QG
                            </h1>
                        </div>

                        {/* Switcher - Now syncs with Global Context */}
                        <div className="bg-black/20 p-1 rounded-xl flex items-center gap-1 backdrop-blur-sm">
                            <button
                                type="button"
                                onClick={() => setAudience('adults')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${mode === 'adult' ? 'bg-magic-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <User className="w-4 h-4" />
                                Adulte
                            </button>
                            <button
                                type="button"
                                onClick={() => setAudience('kids')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${mode === 'kid' ? 'bg-white text-purple-600 shadow-lg' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Baby className="w-4 h-4" />
                                Enfant (Kids)
                            </button>
                        </div>
                    </header>

                    <div className={`${themeColor} border ${borderColor} p-8 rounded-2xl shadow-xl transition-all duration-500`}>
                        <form action={updateSettings} className="space-y-8">
                            <input type="hidden" name="context" value={mode} />

                            <section className="space-y-4">
                                <h3 className={`font-bold ${labelColor} uppercase tracking-wider text-xs`}>Logo du Site ({mode === 'adult' ? 'Adulte' : 'Enfant'})</h3>
                                <LogoCropper currentLogo={getValue("site_logo") || (mode === 'kid' ? settings['site_logo'] : undefined)} />
                                {/* For Kid, if no specific logo, we might want to show Adult logo as preview? Logic handled in LogoCropper maybe? 
                                    Let's just pass the value. If empty, LogoCropper handles it. 
                                */}
                            </section>

                            <section className="space-y-4">
                                <h2 className={`text-xl font-bold ${titleColor} border-b ${borderColor} pb-2`}>Textes Généraux</h2>

                                <div>
                                    <label className={`block text-sm font-medium ${labelColor} mb-1`}>Titre Principal Dashboard</label>
                                    <input
                                        key={`${mode}-dashboard_title`} // Force re-render on mode change
                                        type="text"
                                        name="dashboard_title"
                                        defaultValue={getValue("dashboard_title")}
                                        placeholder={getPlaceholder("dashboard_title")}
                                        className={`w-full ${inputBg} border ${borderColor} rounded-xl p-3 focus:ring-2 focus:ring-magic-purple outline-none transition-all`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${labelColor} mb-1`}>Message de Bienvenue</label>
                                    <textarea
                                        key={`${mode}-welcome_message`}
                                        name="welcome_message"
                                        rows={3}
                                        defaultValue={getValue("welcome_message")}
                                        placeholder={getPlaceholder("welcome_message")}
                                        className={`w-full ${inputBg} border ${borderColor} rounded-xl p-3 focus:ring-2 focus:ring-magic-purple outline-none transition-all`}
                                    />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className={`text-xl font-bold ${titleColor} border-b ${borderColor} pb-2`}>Sections</h2>

                                <div>
                                    <label className={`block text-sm font-medium ${labelColor} mb-1`}>Titre Section News</label>
                                    <input
                                        key={`${mode}-news_title`}
                                        type="text"
                                        name="news_title"
                                        defaultValue={getValue("news_title")}
                                        placeholder={getPlaceholder("news_title")}
                                        className={`w-full ${inputBg} border ${borderColor} rounded-xl p-3 outline-none`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${labelColor} mb-1`}>Titre Section Instagram</label>
                                    <input
                                        key={`${mode}-instagram_title`}
                                        type="text"
                                        name="instagram_title"
                                        defaultValue={getValue("instagram_title")}
                                        placeholder={getPlaceholder("instagram_title")}
                                        className={`w-full ${inputBg} border ${borderColor} rounded-xl p-3 outline-none`}
                                    />
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className={`text-xl font-bold ${titleColor} border-b ${borderColor} pb-2`}>Réseaux Sociaux (Barre Latérale)</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {['youtube', 'instagram', 'facebook', 'tiktok'].map((social) => (
                                        <div key={social}>
                                            <label className={`block text-sm font-medium ${labelColor} mb-1 capitalize`}>{social} (URL)</label>
                                            <input
                                                key={`${mode}-social_${social}`}
                                                type="url"
                                                name={`social_${social}`}
                                                defaultValue={getValue(`social_${social}`)}
                                                placeholder={getPlaceholder(`social_${social}`)}
                                                className={`w-full ${inputBg} border ${borderColor} rounded-xl p-3 outline-none`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="space-y-4">
                                <h2 className={`text-xl font-bold ${titleColor} border-b ${borderColor} pb-2`}>Contenu Multimédia</h2>

                                <div>
                                    <label className={`block text-sm font-medium ${labelColor} mb-1`}>ID Vidéo YouTube à la une</label>
                                    <input
                                        key={`${mode}-featured_video`}
                                        type="text"
                                        name="featured_video"
                                        defaultValue={getValue("featured_video")}
                                        placeholder={getPlaceholder("featured_video")}
                                        className={`w-full ${inputBg} border ${borderColor} rounded-xl p-3 outline-none`}
                                    />
                                    <p className={`text-xs ${labelColor} mt-1`}>L'ID est la partie après 'v=' dans l'URL. Ex: 5K17iK1vF6s</p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${labelColor} mb-1`}>Lien Global Boutique (Falllback)</label>
                                    <input
                                        key={`${mode}-shop_link`}
                                        type="url"
                                        name="shop_link"
                                        defaultValue={getValue("shop_link")}
                                        placeholder={getPlaceholder("shop_link")}
                                        className={`w-full ${inputBg} border ${borderColor} rounded-xl p-3 outline-none`}
                                    />
                                </div>
                            </section>

                            <div className="pt-4 sticky bottom-4">
                                <SubmitButton label={mode === 'adult' ? "Sauvegarder (Adulte)" : "Sauvegarder (Enfant)"} />
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
