"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Save, Type } from "lucide-react";
import { saveAdultUiLabels } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

interface AdultLabelsConfigProps {
    initialSettings: Record<string, string>;
}

export const defaultAdultLabels = {
    nav_actu: "L'Actu du Club",
    nav_videos: "Mes Vidéos",
    nav_formations: "Mes Formations",
    nav_boutique: "La Boutique",
    nav_settings: "Mes Paramètres",
    page_dashboard_title: "Le QG de la Magie",
    page_videos_title: "Les Vidéos",
    page_formations_title: "Mes Formations",
    page_formations_subtitle: "Apprentissage Structuré"
};

export default function AdultLabelsConfig({ initialSettings }: AdultLabelsConfigProps) {
    const [loading, setLoading] = useState(false);

    // Parse existing labels or use defaults
    let initialLabels = defaultAdultLabels;
    try {
        if (initialSettings.adult_ui_labels) {
            initialLabels = { ...defaultAdultLabels, ...JSON.parse(initialSettings.adult_ui_labels) };
        }
    } catch (e) {
        console.error("Failed to parse adult_ui_labels", e);
    }

    const [labels, setLabels] = useState<Record<string, string>>(initialLabels);

    const handleChange = (key: string, value: string) => {
        setLabels(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await saveAdultUiLabels(labels);
            alert("Noms et intitulés enregistrés avec succès !");
        } catch (error) {
            console.error("Error saving UI labels:", error);
            alert("Erreur lors de l'enregistrement des intitulés.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-black/50 border-white/5 shadow-2xl overflow-hidden mt-12 backdrop-blur-md">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <Type className="text-brand-purple" />
                        Personnalisation des Noms (Interface Adulte)
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
                <p className="text-sm text-slate-400 font-light">
                    Modifiez ici tous les textes importants de l'interface membre "Atelier" sans avoir à toucher au code.
                </p>

                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-magic-royal border-b border-white/10 pb-2">Menu Latéral (Navigation)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lien Accueil</label>
                            <input
                                type="text"
                                value={labels.nav_actu}
                                onChange={(e) => handleChange('nav_actu', e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-magic-royal/50 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lien Vidéos Hebdo</label>
                            <input
                                type="text"
                                value={labels.nav_videos}
                                onChange={(e) => handleChange('nav_videos', e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-magic-royal/50 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lien Hub Formations</label>
                            <input
                                type="text"
                                value={labels.nav_formations}
                                onChange={(e) => handleChange('nav_formations', e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-magic-royal/50 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lien Boutique</label>
                            <input
                                type="text"
                                value={labels.nav_boutique}
                                onChange={(e) => handleChange('nav_boutique', e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-magic-royal/50 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Lien Paramètres</label>
                            <input
                                type="text"
                                value={labels.nav_settings}
                                onChange={(e) => handleChange('nav_settings', e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-magic-royal/50 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-magic-royal border-b border-white/10 pb-2">Titres de Pages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Titre Accueil (QG)</label>
                            <input
                                type="text"
                                value={labels.page_dashboard_title}
                                onChange={(e) => handleChange('page_dashboard_title', e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-magic-royal/50 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Titre Section Vidéos</label>
                            <input
                                type="text"
                                value={labels.page_videos_title}
                                onChange={(e) => handleChange('page_videos_title', e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-magic-royal/50 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Surtitre Hub Formations (Petit)</label>
                            <input
                                type="text"
                                value={labels.page_formations_subtitle}
                                onChange={(e) => handleChange('page_formations_subtitle', e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-magic-royal/50 outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Titre Hub Formations (Gros)</label>
                            <input
                                type="text"
                                value={labels.page_formations_title}
                                onChange={(e) => handleChange('page_formations_title', e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-lg p-3 text-white text-sm focus:border-magic-royal/50 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-brand-purple text-black font-bold hover:bg-brand-purple"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Enregistrement..." : "Enregistrer les textes"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
