"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Save, Eye } from "lucide-react";
import { saveAdultHomeSettings } from "@/app/admin/actions";
import CoverImageUpload from "@/components/admin/CoverImageUpload";

interface AdultHomeConfigProps {
    initialSettings: Record<string, any>;
}

export default function AdultHomeConfig({ initialSettings }: AdultHomeConfigProps) {
    const [loading, setLoading] = useState(false);

    // Featured Hero State
    const [featuredConfig, setFeaturedConfig] = useState(
        initialSettings.adult_home_featured_config
            ? JSON.parse(initialSettings.adult_home_featured_config)
            : { title: "", description: "", image: "", link: "", buttonText: "Découvrir", tag: "Nouveau" }
    );

    const handleSave = async () => {
        setLoading(true);
        try {
            await saveAdultHomeSettings({
                featured_config: featuredConfig
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
            {/* Sidebar Actions */}
            <div className="lg:col-span-1 space-y-4">
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full bg-magic-gold text-black hover:bg-yellow-400 font-bold"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>

                <p className="text-xs text-brand-text-muted mt-4">
                    Ces réglages modifient l'encart principal de la page d'accueil de l'espace Adultes (`/dashboard`).
                </p>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                <Card className="bg-black border-white/5 shadow-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                        <CardTitle className="text-xl font-serif font-bold tracking-tight flex items-center gap-3 text-white">
                            <Sparkles className="text-magic-gold w-5 h-5" />
                            L'Annonce à la Une
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Titre de l'annonce</label>
                                    <input
                                        type="text"
                                        value={featuredConfig.title}
                                        onChange={(e) => setFeaturedConfig({ ...featuredConfig, title: e.target.value })}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-gold/50"
                                        placeholder="Ex: La Masterclass Ultime"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Badge (Tag)</label>
                                    <input
                                        type="text"
                                        value={featuredConfig.tag}
                                        onChange={(e) => setFeaturedConfig({ ...featuredConfig, tag: e.target.value })}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-gold/50"
                                        placeholder="Ex: Nouveau, Exclusif..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Texte de description</label>
                                <textarea
                                    value={featuredConfig.description}
                                    onChange={(e) => setFeaturedConfig({ ...featuredConfig, description: e.target.value })}
                                    className="w-full h-32 bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-gold/50"
                                    placeholder="Décrivez en quelques mots ce que les membres vont découvrir..."
                                />
                            </div>

                            <Separator className="my-6 bg-white/5" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">URL du lien</label>
                                    <input
                                        type="text"
                                        value={featuredConfig.link}
                                        onChange={(e) => setFeaturedConfig({ ...featuredConfig, link: e.target.value })}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-gold/50"
                                        placeholder="Ex: /watch/xxx ou https://..."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Texte du bouton</label>
                                    <input
                                        type="text"
                                        value={featuredConfig.buttonText}
                                        onChange={(e) => setFeaturedConfig({ ...featuredConfig, buttonText: e.target.value })}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-gold/50"
                                        placeholder="Ex: Découvrir, Visionner..."
                                    />
                                </div>
                            </div>

                            <Separator className="my-6 bg-white/5" />

                            <div className="space-y-3">
                                <CoverImageUpload
                                    currentImageUrl={featuredConfig.image}
                                    onUpload={(url: string) => setFeaturedConfig({ ...featuredConfig, image: url })}
                                    label="Image de couverture (format 16:9 recommandé)"
                                />
                                <p className="text-[10px] text-slate-500">
                                    Cette image apparaîtra dans la partie gauche de la bannière.
                                </p>
                            </div>

                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
