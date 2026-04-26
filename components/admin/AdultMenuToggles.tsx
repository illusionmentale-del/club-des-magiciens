"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { List, Save } from "lucide-react";
import { saveAdultsMenuSettings } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

interface AdultMenuTogglesProps {
    initialSettings: Record<string, string>;
}

export default function AdultMenuToggles({ initialSettings }: AdultMenuTogglesProps) {
    const [loading, setLoading] = useState(false);

    // Convert string settings to booleans
    const [toggles, setToggles] = useState({
        enable_adults_program: initialSettings.enable_adults_program !== "false",
        enable_adults_masterclass: initialSettings.enable_adults_masterclass !== "false",
        enable_adults_account: initialSettings.enable_adults_account !== "false",
        enable_adults_catalog: initialSettings.enable_adults_catalog !== "false",
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
            await saveAdultsMenuSettings(toggles);
            alert("Réglages des menus enregistrés avec succès !");
        } catch (error) {
            console.error("Error saving menu settings:", error);
            alert("Erreur lors de l'enregistrement des réglages.");
        } finally {
            setLoading(false);
        }
    };

    const menus = [
        { key: 'enable_adults_program' as const, label: 'Accueil VIP', desc: 'Le centre de contrôle' },
        { key: 'enable_adults_masterclass' as const, label: 'Les Masterclass', desc: 'Contenu premium approfondi' },
        { key: 'enable_adults_account' as const, label: 'Mon Compte', desc: 'Progression et réglages' },
        { key: 'enable_adults_catalog' as const, label: 'La Boutique', desc: 'Boutique premium' },
    ];

    return (
        <Card className="bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] hover:border-brand-purple/30 transition-all overflow-hidden rounded-3xl mt-12 backdrop-blur-md">
            <CardHeader className="border-b border-white/5 bg-transparent p-8">
                <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <List className="text-brand-purple" />
                        Visibilité du Menu (L'Atelier)
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                <p className="text-sm text-slate-400 mb-6 font-light">
                    Activez ou désactivez les éléments du menu latéral de l'Espace Premium "L'Atelier".
                    Si désactivé, le lien disparait et l'accès via URL redirigera vers l'accueil (`/dashboard`).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menus.map((menu) => (
                        <div key={menu.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 gap-4 hover:border-brand-purple/30 transition-colors">
                            <div>
                                <p className="font-bold text-white uppercase tracking-widest text-xs mb-1">{menu.label}</p>
                                <p className="text-[10px] text-slate-400">{menu.desc}</p>
                            </div>
                            <button
                                onClick={() => handleToggle(menu.key)}
                                className={`relative w-12 h-6 rounded-full p-1 transition-colors flex-shrink-0 ${toggles[menu.key] ? 'bg-brand-purple text-black' : 'bg-white/10'}`}
                            >
                                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${toggles[menu.key] ? 'translate-x-6' : 'translate-x-0'}`} />
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
                        {loading ? "Enregistrement..." : "Enregistrer les menus"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
