"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { List, Save } from "lucide-react";
import { saveAdultsHomeBlockSettings } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

interface AdultHomeBlockTogglesProps {
    initialSettings: Record<string, string>;
}

export default function AdultHomeBlockToggles({ initialSettings }: AdultHomeBlockTogglesProps) {
    const [loading, setLoading] = useState(false);

    // Convert string settings to booleans
    const [toggles, setToggles] = useState({
        show_adults_news: initialSettings.show_adults_news !== "false",
        show_adults_catalog_promo: initialSettings.show_adults_catalog_promo !== "false",
        show_adults_progression: initialSettings.show_adults_progression !== "false",
        show_adults_achievements: initialSettings.show_adults_achievements !== "false",
    });

    const handleToggle = (key: keyof typeof toggles) => {
        setToggles(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await saveAdultsHomeBlockSettings(toggles);
            alert("Réglages des blocs enregistrés avec succès !");
        } catch (error) {
            console.error("Error saving block settings:", error);
            alert("Erreur lors de l'enregistrement des blocs.");
        } finally {
            setLoading(false);
        }
    };

    const blocks = [
        { key: 'show_adults_news' as const, label: 'Les Nouveautés', desc: 'Dernières vidéos publiées' },
        { key: 'show_adults_catalog_promo' as const, label: 'Promo Boutique', desc: 'Encart pour le catalogue premium' },
        { key: 'show_adults_progression' as const, label: 'La Progression', desc: 'Jauge des vidéos validées' },
        { key: 'show_adults_achievements' as const, label: 'Les Succès', desc: 'Derniers trophées obtenus' },
    ];

    return (
        <Card className="bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-purple/30 transition-all overflow-hidden rounded-3xl mt-12 backdrop-blur-md">
            <CardHeader className="border-b border-white/5 bg-transparent p-8">
                <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <List className="text-brand-purple" />
                        Blocs de l'Accueil (L'Atelier)
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                <p className="text-sm text-slate-400 mb-6 font-light">
                    Activez ou désactivez l'affichage des différents modules sur le tableau de bord principal des membres. L'en-tête et les alertes (Live) restent toujours visibles.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {blocks.map((block) => (
                        <div key={block.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 gap-4 hover:border-brand-purple/30 transition-colors">
                            <div>
                                <p className="font-bold text-white uppercase tracking-widest text-xs mb-1">{block.label}</p>
                                <p className="text-[10px] text-slate-400">{block.desc}</p>
                            </div>
                            <button
                                onClick={() => handleToggle(block.key)}
                                className={`relative w-12 h-6 rounded-full p-1 transition-colors flex-shrink-0 ${toggles[block.key] ? 'bg-brand-purple text-black' : 'bg-white/10'}`}
                            >
                                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${toggles[block.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full sm:w-auto bg-brand-purple hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] transition-all h-12 px-8"
                    >
                        <Save className="w-5 h-5 mr-2" />
                        {loading ? "Enregistrement..." : "Enregistrer les blocs"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
