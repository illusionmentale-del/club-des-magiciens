"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Megaphone, Trophy, ShoppingBag, Eye, Save } from "lucide-react";
import { saveKidsHomeSettings } from "@/app/admin/actions";

interface LibraryItem {
    id: string;
    title: string;
    thumbnail_url?: string;
}

interface KidsHomeConfigProps {
    initialSettings: Record<string, any>;
    libraryItems: LibraryItem[];
}

export default function KidsHomeConfig({ initialSettings, libraryItems }: KidsHomeConfigProps) {
    const [activeTab, setActiveTab] = useState("welcome");
    const [loading, setLoading] = useState(false);

    // Welcome Message State
    const [welcomeActive, setWelcomeActive] = useState(initialSettings.kid_home_welcome_active === "true");
    const [weeklyMessages, setWeeklyMessages] = useState<Record<string, string>>(
        initialSettings.kid_home_weekly_messages ? JSON.parse(initialSettings.kid_home_weekly_messages) : {}
    );
    const [currentWeek, setCurrentWeek] = useState(1);

    // Featured Workshop State
    const [featuredConfig, setFeaturedConfig] = useState(
        initialSettings.kid_home_featured_config ? JSON.parse(initialSettings.kid_home_featured_config) : { id: "", image: "", text: "" }
    );

    // News Curation State
    const [newsConfig, setNewsConfig] = useState<string[]>(
        initialSettings.kid_home_news_config ? JSON.parse(initialSettings.kid_home_news_config) : []
    );

    // Shop State
    const [shopConfig, setShopConfig] = useState(
        initialSettings.kid_home_shop_config ? JSON.parse(initialSettings.kid_home_shop_config) : { items: [] }
    );

    const handleSave = async () => {
        setLoading(true);
        try {
            await saveKidsHomeSettings({
                welcome_active: welcomeActive.toString(),
                weekly_messages: weeklyMessages,
                featured_config: featuredConfig,
                news_config: newsConfig,
                shop_config: shopConfig
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
                    { id: "welcome", label: "Message d'accueil", icon: Megaphone },
                    { id: "featured", label: "Atelier Vedette", icon: Sparkles },
                    { id: "news", label: "Nouveautés", icon: Trophy },
                    { id: "shop", label: "Boutique Home", icon: ShoppingBag },
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

                <Button
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5 mt-4"
                    onClick={() => window.open("/kids", "_blank")}
                >
                    <Eye className="w-4 h-4 mr-2" />
                    Aperçu Direct
                </Button>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                <Card className="bg-brand-card border-white/5 shadow-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                        <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 text-white">
                            {activeTab === "welcome" && <><Megaphone className="text-brand-purple" /> Message de Bienvenue</>}
                            {activeTab === "featured" && <><Sparkles className="text-brand-purple" /> Atelier en Vedette</>}
                            {activeTab === "news" && <><Trophy className="text-brand-purple" /> Nouveautés de la Semaine</>}
                            {activeTab === "shop" && <><ShoppingBag className="text-brand-purple" /> Promotion Boutique</>}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">

                        {/* TAB: WELCOME */}
                        {activeTab === "welcome" && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div>
                                        <p className="font-bold text-white uppercase tracking-widest text-[10px] mb-1">Status global</p>
                                        <p className="text-sm text-brand-text-muted">Activer l'affichage du message d'accueil sur la Home.</p>
                                    </div>
                                    <button
                                        onClick={() => setWelcomeActive(!welcomeActive)}
                                        className={`w-12 h-6 rounded-full p-1 transition-colors ${welcomeActive ? 'bg-brand-purple' : 'bg-white/10'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${welcomeActive ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-black uppercase tracking-widest text-brand-text-muted">Configuration par semaine (1-52)</label>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))} className="p-1 hover:text-white">←</button>
                                            <span className="bg-brand-purple/20 text-brand-purple px-3 py-1 rounded-lg font-bold">Semaine {currentWeek}</span>
                                            <button onClick={() => setCurrentWeek(Math.min(52, currentWeek + 1))} className="p-1 hover:text-white">→</button>
                                        </div>
                                    </div>
                                    <textarea
                                        value={weeklyMessages[currentWeek] || ""}
                                        onChange={(e) => setWeeklyMessages({ ...weeklyMessages, [currentWeek]: e.target.value })}
                                        className="w-full h-32 bg-brand-bg border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple/50 transition-all"
                                        placeholder={`Entrez le message pour la semaine ${currentWeek}...`}
                                    />
                                    <p className="text-[10px] text-brand-text-muted italic">
                                        Note: Si vide, le système utilisera le message par défaut.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* TAB: FEATURED */}
                        {activeTab === "featured" && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-brand-text-muted">Sélection de l'atelier</label>
                                    <select
                                        value={featuredConfig.id}
                                        onChange={(e) => setFeaturedConfig({ ...featuredConfig, id: e.target.value })}
                                        className="w-full bg-brand-bg border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-purple/50 appearance-none"
                                    >
                                        <option value="">-- Choisir un atelier --</option>
                                        {libraryItems.map(item => (
                                            <option key={item.id} value={item.id}>{item.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-brand-text-muted">Accroche personnalisée (Optionnel)</label>
                                    <input
                                        type="text"
                                        value={featuredConfig.text}
                                        onChange={(e) => setFeaturedConfig({ ...featuredConfig, text: e.target.value })}
                                        className="w-full bg-brand-bg border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-purple/50"
                                        placeholder="Ex: Le secret le mieux gardé de la semaine..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black uppercase tracking-widest text-brand-text-muted">URL Image personnalisée (Override)</label>
                                    <input
                                        type="text"
                                        value={featuredConfig.image}
                                        onChange={(e) => setFeaturedConfig({ ...featuredConfig, image: e.target.value })}
                                        className="w-full bg-brand-bg border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-purple/50"
                                        placeholder="https://..."
                                    />
                                    <p className="text-[10px] text-brand-text-muted">
                                        Laissez vide pour utiliser la miniature par défaut de l'atelier.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* TAB: NEWS */}
                        {activeTab === "news" && (
                            <div className="space-y-6">
                                <p className="text-sm text-brand-text-muted mb-4">
                                    Cochez les ateliers que vous souhaitez faire apparaître dans la section "Nouveautés" de la Home.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {libraryItems.map(item => {
                                        const isSelected = newsConfig.includes(item.id);
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => {
                                                    if (isSelected) setNewsConfig(newsConfig.filter(id => id !== item.id));
                                                    else setNewsConfig([...newsConfig, item.id]);
                                                }}
                                                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${isSelected ? 'bg-brand-purple/10 border-brand-purple/50' : 'bg-white/5 border-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-brand-purple border-brand-purple' : 'bg-transparent border-white/20'
                                                    }`}>
                                                    {isSelected && <span className="text-[10px] font-bold text-white">✓</span>}
                                                </div>
                                                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-brand-text-muted'}`}>{item.title}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* TAB: SHOP */}
                        {activeTab === "shop" && (
                            <div className="space-y-6">
                                <div className="p-6 bg-brand-gold/5 rounded-2xl border border-brand-gold/10 flex items-center gap-4 text-brand-gold">
                                    <ShoppingBag className="w-8 h-8" />
                                    <div>
                                        <p className="font-black uppercase tracking-widest text-[10px]">Information</p>
                                        <p className="text-sm">Le bloc Boutique est toujours visible sur la Home "Le Club". Cette section vous permet de choisir les produits à mettre en avant spécifiquement.</p>
                                    </div>
                                </div>

                                <div className="text-center py-12 text-brand-text-muted border-2 border-dashed border-white/5 rounded-2xl">
                                    <ShoppingBag className="w-8 h-8 mx-auto mb-4 opacity-20" />
                                    Configuration avancée des produits à venir...
                                </div>
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
