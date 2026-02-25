"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Video, Save, Eye } from "lucide-react";
import { saveKidsHomeSettings } from "@/app/admin/actions";
import CoverImageUpload from "@/components/admin/CoverImageUpload";

interface LibraryItem {
    id: string;
    title: string;
    thumbnail_url?: string;
}

interface KidsMasterclassConfigProps {
    initialSettings: Record<string, any>;
    libraryItems: LibraryItem[];
}

export default function KidsMasterclassConfig({ initialSettings, libraryItems }: KidsMasterclassConfigProps) {
    const [activeTab, setActiveTab] = useState("hero");
    const [loading, setLoading] = useState(false);

    // Page Title & Description State
    const [pageConfig, setPageConfig] = useState(
        initialSettings.kid_masterclass_page_config ? JSON.parse(initialSettings.kid_masterclass_page_config) : {
            title: "La Formation",
            description: "Retrouve ici ton parcours d'apprentissage de la magie."
        }
    );

    // Featured Masterclass State
    const [featuredConfig, setFeaturedConfig] = useState(
        initialSettings.kid_masterclass_featured_config ? JSON.parse(initialSettings.kid_masterclass_featured_config) : {
            id: "",
            image: "",
            title: "",
            description: ""
        }
    );

    const handleSave = async () => {
        setLoading(true);
        try {
            await saveKidsHomeSettings({
                // We reuse the existing action, just passing our specific keys
                // Note: The action `saveKidsHomeSettings` might need to be updated to accept flexible keys,
                // or we create a new action `saveGeneralSettings`. For now, if saveKidsHomeSettings 
                // is hardcoded, we will need a new action. Let's assume we'll create `saveSettings` action.
                kid_masterclass_page_config: JSON.stringify(pageConfig),
                kid_masterclass_featured_config: JSON.stringify(featuredConfig)
            });
            alert("Configuration enregistrée avec succès !");
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1 space-y-2">
                {[
                    { id: "hero", label: "Page & Contenu à la Une", icon: Sparkles },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === tab.id
                            ? "bg-brand-purple text-white shadow-lg shadow-brand-purple/20"
                            : "text-brand-text-muted hover:bg-white/5"
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}

                <Separator className="my-6 bg-white/5" />

                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-brand-gold text-black hover:bg-brand-gold/80"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                <Card className="bg-brand-card border-white/5 shadow-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                        <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 text-white">
                            <Sparkles className="text-brand-purple" /> Contenu à la Une
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">

                        {activeTab === "hero" && (
                            <div className="space-y-10">

                                {/* Section 1: Page Info */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">En-tête de la page</h3>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-brand-text-muted">Titre de la page</label>
                                        <input
                                            type="text"
                                            value={pageConfig.title}
                                            onChange={(e) => setPageConfig({ ...pageConfig, title: e.target.value })}
                                            className="w-full bg-brand-bg border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-purple/50"
                                            placeholder="Ex: Les Masterclass"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-brand-text-muted">Phrase d'accroche</label>
                                        <textarea
                                            value={pageConfig.description}
                                            onChange={(e) => setPageConfig({ ...pageConfig, description: e.target.value })}
                                            className="w-full h-24 bg-brand-bg border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple/50 transition-all"
                                            placeholder="Entrez la description pour la page..."
                                        />
                                    </div>
                                </div>

                                <Separator className="bg-white/10" />

                                {/* Section 2: Featured Masterclass */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Masterclass à la Une</h3>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-brand-text-muted">Sélection de la vidéo</label>
                                        <p className="text-[10px] text-brand-text-muted -mt-2 mb-2">Choisissez la formation ou masterclass à mettre en valeur en haut de la page.</p>
                                        <select
                                            value={featuredConfig.id}
                                            onChange={(e) => setFeaturedConfig({ ...featuredConfig, id: e.target.value })}
                                            className="w-full bg-brand-bg border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-purple/50 appearance-none"
                                        >
                                            <option value="">-- Ne rien mettre à la une --</option>
                                            {libraryItems.map(item => (
                                                <option key={item.id} value={item.id}>{item.title}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {featuredConfig.id && (
                                        <>
                                            <div className="space-y-4">
                                                <label className="text-xs font-black uppercase tracking-widest text-brand-text-muted">Titre promotionnel</label>
                                                <input
                                                    type="text"
                                                    value={featuredConfig.title}
                                                    onChange={(e) => setFeaturedConfig({ ...featuredConfig, title: e.target.value })}
                                                    className="w-full bg-brand-bg border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-purple/50"
                                                    placeholder="Ex: Nouvelle Masterclass !"
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-xs font-black uppercase tracking-widest text-brand-text-muted">Description (Optionnel)</label>
                                                <textarea
                                                    value={featuredConfig.description}
                                                    onChange={(e) => setFeaturedConfig({ ...featuredConfig, description: e.target.value })}
                                                    className="w-full h-24 bg-brand-bg border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-purple/50"
                                                    placeholder="Quelques lignes pour donner envie..."
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <CoverImageUpload
                                                    currentImageUrl={featuredConfig.image}
                                                    onUpload={(url: string) => setFeaturedConfig({ ...featuredConfig, image: url })}
                                                    label="Image de couverture (Optionnel)"
                                                />
                                                <p className="text-[10px] text-brand-text-muted">
                                                    Laissez vide pour utiliser l'image par défaut de la vidéo.
                                                </p>
                                            </div>
                                        </>
                                    )}
                                </div>

                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
