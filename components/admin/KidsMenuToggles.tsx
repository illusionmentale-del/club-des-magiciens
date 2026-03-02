"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { List, Save } from "lucide-react";
import { saveKidsMenuSettings } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

interface KidsMenuTogglesProps {
    initialSettings: Record<string, string>;
}

export default function KidsMenuToggles({ initialSettings }: KidsMenuTogglesProps) {
    const [loading, setLoading] = useState(false);

    // Convert string settings to booleans
    const [toggles, setToggles] = useState({
        enable_kids_program: initialSettings.enable_kids_program !== "false",
        enable_kids_masterclass: initialSettings.enable_kids_masterclass !== "false",
        enable_kids_account: initialSettings.enable_kids_account !== "false",
        enable_kids_shop: initialSettings.enable_kids_shop !== "false",
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
            await saveKidsMenuSettings(toggles);
            alert("Réglages des menus enregistrés avec succès !");
        } catch (error) {
            console.error("Error saving menu settings:", error);
            alert("Erreur lors de l'enregistrement des réglages.");
        } finally {
            setLoading(false);
        }
    };

    const menus = [
        { key: 'enable_kids_program' as const, label: 'La Formation', desc: 'Accéder aux cours et textes' },
        { key: 'enable_kids_masterclass' as const, label: 'Les Masterclass', desc: 'Perfectionnement en vidéo' },
        { key: 'enable_kids_account' as const, label: 'Mes Informations', desc: 'Progression et profil' },
        { key: 'enable_kids_shop' as const, label: 'La Boutique', desc: 'Produits et articles' },
    ];

    return (
        <Card className="bg-brand-card border-white/5 shadow-2xl overflow-hidden mt-12">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                        <List className="text-brand-purple" />
                        Visibilité du Menu (Kids)
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
                <p className="text-sm text-brand-text-muted mb-6">
                    Activez ou désactivez les éléments du menu latéral de l'espace Kids.
                    Si désactivé, le lien disparait et toute tentative d'accès via l'URL redirigera vers l'accueil (`/kids`).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {menus.map((menu) => (
                        <div key={menu.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 gap-4">
                            <div>
                                <p className="font-bold text-white uppercase tracking-widest text-xs mb-1">{menu.label}</p>
                                <p className="text-[10px] text-brand-text-muted">{menu.desc}</p>
                            </div>
                            <button
                                onClick={() => handleToggle(menu.key)}
                                className={`relative w-12 h-6 rounded-full p-1 transition-colors flex-shrink-0 ${toggles[menu.key] ? 'bg-brand-purple' : 'bg-white/10'}`}
                            >
                                <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${toggles[menu.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-brand-purple text-white hover:bg-brand-purple/80"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Enregistrement..." : "Enregistrer les menus"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
