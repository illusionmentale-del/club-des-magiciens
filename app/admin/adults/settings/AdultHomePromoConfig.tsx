"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Store, Save } from "lucide-react";
import { saveAdultHomeSettings } from "@/app/admin/actions";

interface AdultHomePromoConfigProps {
    initialSettings: Record<string, any>;
}

export default function AdultHomePromoConfig({ initialSettings }: AdultHomePromoConfigProps) {
    const [loading, setLoading] = useState(false);

    const [promoConfig, setPromoConfig] = useState(
        initialSettings.adult_home_promo_config
            ? JSON.parse(initialSettings.adult_home_promo_config)
            : { title: "Étendez votre magie !", subtitle: "Accédez à des Masterclass exclusives et du matériel professionnel directement depuis la boutique de l'Atelier.", buttonText: "Visiter la Boutique", link: "/dashboard/catalog" }
    );

    const handleSave = async () => {
        setLoading(true);
        try {
            await saveAdultHomeSettings({
                promo_config: promoConfig // Will save as adult_home_promo_config
            });
            alert("Bloc Promo enregistré avec succès !");
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
                    Personnalisez le texte et le lien de l'encart promotionnel "Le Catalogue Premium" sur la page d'accueil Adulte.
                </p>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                <Card className="bg-black border-white/5 shadow-2xl overflow-hidden mt-8">
                    <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                        <CardTitle className="text-xl font-serif font-bold tracking-tight flex items-center gap-3 text-white">
                            <Store className="text-magic-gold w-5 h-5" />
                            Promo Boutique (Accueil)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Titre d'Accroche</label>
                                    <input
                                        type="text"
                                        value={promoConfig.title}
                                        onChange={(e) => setPromoConfig({ ...promoConfig, title: e.target.value })}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-gold/50"
                                        placeholder="Ex: Étendez votre magie !"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Sous-titre / Description</label>
                                    <textarea
                                        value={promoConfig.subtitle}
                                        onChange={(e) => setPromoConfig({ ...promoConfig, subtitle: e.target.value })}
                                        className="w-full h-24 bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-gold/50"
                                        placeholder="Ex: Profitez de nos offres exceptionnelles de folie pour le Black Friday..."
                                    />
                                </div>
                            </div>

                            <Separator className="my-6 bg-white/5" />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Texte du bouton</label>
                                    <input
                                        type="text"
                                        value={promoConfig.buttonText}
                                        onChange={(e) => setPromoConfig({ ...promoConfig, buttonText: e.target.value })}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-gold/50"
                                        placeholder="Ex: Voir les Offres"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">URL du bouton</label>
                                    <input
                                        type="text"
                                        value={promoConfig.link}
                                        onChange={(e) => setPromoConfig({ ...promoConfig, link: e.target.value })}
                                        className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-gold/50"
                                        placeholder="Ex: /dashboard/catalog"
                                    />
                                </div>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
