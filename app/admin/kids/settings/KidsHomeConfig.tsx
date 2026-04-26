"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Megaphone, Trophy, ShoppingBag, Eye, Save, ExternalLink, X, Video } from "lucide-react";
import { saveKidsHomeSettings } from "@/app/admin/actions";
import CoverImageUpload from "@/components/admin/CoverImageUpload";
import { useAdmin } from "@/app/admin/AdminContext";

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
    const { setIsPreviewOpen } = useAdmin();
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
    // Format: Array<{ id: string, type: 'course' | 'product' | 'tip' | 'illusion' | 'custom_link', data?: any }>
    const [newsConfig, setNewsConfig] = useState<Array<{ id: string, type: string, data?: any }>>(() => {
        try {
            const parsed = initialSettings.kid_home_news_config ? JSON.parse(initialSettings.kid_home_news_config) : [];
            // Migration: If the stored data is an array of strings (old format), convert them to objects
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                return parsed.map((id: string) => ({ id, type: 'course' }));
            }
            return parsed;
        } catch (e) {
            return [];
        }
    });

    // Shop State
    const [shopConfig, setShopConfig] = useState(
        initialSettings.kid_home_shop_config ? JSON.parse(initialSettings.kid_home_shop_config) : { items: [] }
    );

    // Custom Item State
    const [newCustomItem, setNewCustomItem] = useState({
        type: 'custom_link', // custom_link, tip, product
        title: '',
        url: '',
        image: ''
    });

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
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[16px] font-bold uppercase tracking-widest text-xs transition-all ${activeTab === tab.id
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
                    className="w-full bg-brand-purple text-black hover:bg-brand-purple/80"
                >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>

                <Button
                    variant="outline"
                    className="w-full border-white/10 text-white hover:bg-white/5 mt-4"
                    onClick={() => setIsPreviewOpen(true)}
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
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">

                        {/* TAB: WELCOME */}
                        {activeTab === "welcome" && (
                            <div className="space-y-8">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-[16px] border border-white/5">
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
                                            <span className="bg-brand-purple/20 text-brand-purple px-3 py-1 rounded-[12px] font-bold">Semaine {currentWeek}</span>
                                            <button onClick={() => setCurrentWeek(Math.min(52, currentWeek + 1))} className="p-1 hover:text-white">→</button>
                                        </div>
                                    </div>
                                    <textarea
                                        value={weeklyMessages[currentWeek] || ""}
                                        onChange={(e) => setWeeklyMessages({ ...weeklyMessages, [currentWeek]: e.target.value })}
                                        className="w-full h-32 bg-brand-bg border border-white/10 rounded-[16px] p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-purple/50 transition-all"
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
                                        className="w-full bg-brand-bg border border-white/10 rounded-[16px] p-4 text-white focus:outline-none focus:border-brand-purple/50 appearance-none"
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
                                        className="w-full bg-brand-bg border border-white/10 rounded-[16px] p-4 text-white focus:outline-none focus:border-brand-purple/50"
                                        placeholder="Ex: Le secret le mieux gardé de la semaine..."
                                    />
                                </div>

                                <div className="space-y-4">
                                    <CoverImageUpload
                                        currentImageUrl={featuredConfig.image}
                                        onUpload={(url: string) => setFeaturedConfig({ ...featuredConfig, image: url })}
                                        label="Image de couverture (Override)"
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
                                    Cochez les éléments que vous souhaitez faire apparaître dans la section "Nouveautés" de la Home.
                                </p>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest bg-brand-purple/10 p-2 rounded-[12px] border border-brand-purple/20">
                                        Ateliers du Club
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {libraryItems.map(item => {
                                            const isSelected = newsConfig.some(n => n.id === item.id && n.type === 'course');
                                            return (
                                                <div
                                                    key={item.id}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setNewsConfig(newsConfig.filter(n => !(n.id === item.id && n.type === 'course')));
                                                        } else {
                                                            setNewsConfig([...newsConfig, { id: item.id, type: 'course' }]);
                                                        }
                                                    }}
                                                    className={`p-4 rounded-[16px] border transition-all cursor-pointer flex items-center gap-3 ${isSelected ? 'bg-brand-purple/10 border-brand-purple/50' : 'bg-white/5 border-white/10 hover:border-white/20'
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

                                <Separator className="my-6 bg-white/5" />

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-black uppercase tracking-widest bg-brand-purple p-2 rounded-[12px] border border-brand-purple shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                                        Contenu Personnalisé
                                    </h3>

                                    <div className="p-6 border border-white/10 bg-white/5 rounded-[16px] space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">Type</label>
                                                <select
                                                    value={newCustomItem.type}
                                                    onChange={(e) => setNewCustomItem({ ...newCustomItem, type: e.target.value })}
                                                    className="w-full bg-brand-bg border border-white/10 rounded-[12px] p-2 text-white text-sm focus:border-brand-purple/50 outline-none"
                                                >
                                                    <option value="custom_link">Lien Externe</option>
                                                    <option value="tip">Conseil / Astuce</option>
                                                    <option value="product">Produit Boutique</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">Titre</label>
                                                <input
                                                    type="text"
                                                    value={newCustomItem.title}
                                                    onChange={(e) => setNewCustomItem({ ...newCustomItem, title: e.target.value })}
                                                    className="w-full bg-brand-bg border border-white/10 rounded-[12px] p-2 text-white text-sm focus:border-brand-purple/50 outline-none"
                                                    placeholder="Titre de l'élément..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-brand-text-muted">Lien (URL) / Contenu</label>
                                            <input
                                                type="text"
                                                value={newCustomItem.url}
                                                onChange={(e) => setNewCustomItem({ ...newCustomItem, url: e.target.value })}
                                                className="w-full bg-brand-bg border border-white/10 rounded-[12px] p-2 text-white text-sm focus:border-brand-purple/50 outline-none"
                                                placeholder={newCustomItem.type === 'tip' ? "Texte du conseil..." : "https://..."}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <CoverImageUpload
                                                currentImageUrl={newCustomItem.image}
                                                onUpload={(url) => setNewCustomItem({ ...newCustomItem, image: url })}
                                                label="Image (Optionnel)"
                                            />
                                        </div>

                                        <Button
                                            onClick={() => {
                                                if (!newCustomItem.title) return;
                                                const id = `custom_${Date.now()}`;
                                                const newItem = {
                                                    id: id,
                                                    type: newCustomItem.type,
                                                    data: {
                                                        title: newCustomItem.title,
                                                        url: newCustomItem.url,
                                                        image: newCustomItem.image
                                                    }
                                                };
                                                setNewsConfig([...newsConfig, newItem as any]);
                                                setNewCustomItem({ type: 'custom_link', title: '', url: '', image: '' });
                                            }}
                                            className="w-full bg-brand-purple/20 text-brand-purple border border-brand-purple/50 hover:bg-brand-purple hover:text-white"
                                        >
                                            + Ajouter du contenu
                                        </Button>
                                    </div>

                                    {/* List of ALL Selected Items (Unified) */}
                                    {newsConfig.length > 0 && (
                                        <div className="mt-8">
                                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center justify-between">
                                                <span>Sélection Actuelle ({newsConfig.length})</span>
                                            </h3>
                                            <div className="space-y-2">
                                                {newsConfig.map((item, idx) => {
                                                    const isCourse = item.type === 'course';
                                                    const course = isCourse ? libraryItems.find(c => c.id === item.id) : null;
                                                    const title = isCourse ? (course?.title || 'Cours introuvable') : item.data?.title;

                                                    return (
                                                        <div key={item.id || idx} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-[12px]">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs text-brand-text-muted uppercase tracking-widest w-6 shrink-0">#{idx + 1}</span>

                                                                {isCourse ? (
                                                                    <div className="flex items-center gap-3">
                                                                        {course?.thumbnail_url ? (
                                                                            <img src={course.thumbnail_url} className="w-10 h-10 rounded-[12px] object-cover border border-white/10 shrink-0" alt="" />
                                                                        ) : (
                                                                            <div className="w-10 h-10 rounded-[12px] bg-black border border-white/10 flex items-center justify-center shrink-0">
                                                                                <Video className="w-4 h-4 text-slate-400" />
                                                                            </div>
                                                                        )}
                                                                        <div className="flex flex-col">
                                                                            <p className="text-sm font-bold text-white max-w-[200px] sm:max-w-none truncate">{title}</p>
                                                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-purple/20 px-1.5 py-0.5 rounded text-brand-purple w-fit">
                                                                                Catalogue Vidéo
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-3">
                                                                        {item.data?.image ? (
                                                                            <img src={item.data.image} className="w-10 h-10 rounded-[12px] object-cover border border-white/10 shrink-0" alt="" />
                                                                        ) : (
                                                                            <div className="w-10 h-10 rounded-[12px] bg-black border border-white/10 flex items-center justify-center shrink-0">
                                                                                {item.type === 'tip' && <Trophy className="w-4 h-4 text-slate-400" />}
                                                                                {item.type === 'custom_link' && <ExternalLink className="w-4 h-4 text-slate-400" />}
                                                                                {item.type === 'product' && <ShoppingBag className="w-4 h-4 text-slate-400" />}
                                                                            </div>
                                                                        )}
                                                                        <div className="flex flex-col">
                                                                            <p className="text-sm font-bold text-white max-w-[200px] sm:max-w-none truncate">{title}</p>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-1.5 py-0.5 rounded text-slate-400">
                                                                                    {item.type === 'custom_link' ? 'LIEN' : item.type === 'product' ? 'BOUTIQUE' : 'CONSEIL'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <button
                                                                onClick={() => setNewsConfig(newsConfig.filter((_, i) => i !== idx))}
                                                                className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-[12px] transition-colors shrink-0"
                                                                title="Supprimer"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
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
