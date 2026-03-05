"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Save, Eye, GraduationCap, Store, Trophy, SaveAll, ExternalLink, X, Search, PlusCircle } from "lucide-react";
import { saveAdultHomeSettings } from "@/app/admin/actions";
import CoverImageUpload from "@/components/admin/CoverImageUpload";
import Image from "next/image";

interface Course {
    id: string;
    title: string;
    thumbnail_url?: string;
}

interface AdultHomeConfigProps {
    initialSettings: Record<string, any>;
    availableCourses: Course[];
}

export default function AdultHomeConfig({ initialSettings, availableCourses }: AdultHomeConfigProps) {
    const [activeTab, setActiveTab] = useState("featured");
    const [loading, setLoading] = useState(false);

    // Featured Hero State
    const [featuredConfig, setFeaturedConfig] = useState(
        initialSettings.adult_home_featured_config
            ? JSON.parse(initialSettings.adult_home_featured_config)
            : { title: "", description: "", image: "", link: "", buttonText: "Découvrir", tag: "Nouveau" }
    );

    // Main Programs State
    let parsedPrograms = [];
    try {
        if (initialSettings.adult_home_main_programs) {
            parsedPrograms = JSON.parse(initialSettings.adult_home_main_programs);
            if (!Array.isArray(parsedPrograms)) parsedPrograms = [];
        }
    } catch (e) {
        console.error("Failed to parse initial main programs", e);
    }
    const [mainPrograms, setMainPrograms] = useState<string[]>(parsedPrograms);
    const [programSearch, setProgramSearch] = useState("");

    // News State
    const [newsConfig, setNewsConfig] = useState<Array<{ id: string, type: string, data?: any }>>(() => {
        try {
            const parsed = initialSettings.adult_home_news_courses ? JSON.parse(initialSettings.adult_home_news_courses) : [];
            // Migration: If the stored data is an array of strings (old format), convert them to objects
            if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                return parsed.map((id: string) => ({ id, type: 'course' }));
            }
            return parsed;
        } catch (e) {
            return [];
        }
    });

    const [newCustomNewsItem, setNewCustomNewsItem] = useState({
        type: 'custom_link',
        title: '',
        url: '',
        image: ''
    });

    // Promo Shop State
    const [promoConfig, setPromoConfig] = useState(
        initialSettings.adult_home_promo_config
            ? JSON.parse(initialSettings.adult_home_promo_config)
            : { title: "Étendez votre magie !", subtitle: "Accédez à des Masterclass exclusives et du matériel professionnel directement depuis la boutique de l'Atelier.", buttonText: "Visiter la Boutique", link: "/dashboard/catalog" }
    );

    const handleSave = async () => {
        setLoading(true);
        try {
            await saveAdultHomeSettings({
                featured_config: featuredConfig,
                main_programs: mainPrograms,
                news_courses: newsConfig,
                promo_config: promoConfig
            });
            alert("Configuration de l'accueil enregistrée avec succès !");
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    // Helper for main programs
    const toggleProgramSelection = (courseId: string) => {
        if (mainPrograms.includes(courseId)) {
            setMainPrograms(prev => prev.filter(id => id !== courseId));
        } else {
            setMainPrograms(prev => [...prev, courseId]);
        }
    };
    const filteredPrograms = availableCourses.filter(c => c.title.toLowerCase().includes(programSearch.toLowerCase()));
    const selectedPrograms = mainPrograms.map(id => availableCourses.find(c => c.id === id)).filter(c => c !== undefined) as Course[];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1 space-y-2">
                {[
                    { id: "featured", label: "L'Annonce à la Une", icon: Sparkles },
                    { id: "programs", label: "Programmes Principaux", icon: GraduationCap },
                    { id: "news", label: "Nouveautés", icon: Trophy },
                    { id: "promo", label: "Promo Boutique", icon: Store },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === tab.id
                            ? "bg-magic-royal text-black shadow-lg shadow-magic-royal/20"
                            : "text-slate-400 hover:bg-white/5"
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
                    className="w-full bg-magic-royal text-black hover:bg-blue-400 font-bold"
                >
                    <SaveAll className="w-4 h-4 mr-2" />
                    {loading ? "Enregistrement..." : "Tout Enregistrer"}
                </Button>
            </div>

            {/* Content Area */}
            <div className="lg:col-span-3">
                <Card className="bg-black border-white/5 shadow-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                        <CardTitle className="text-xl font-serif font-bold tracking-tight flex items-center gap-3 text-white">
                            {activeTab === "featured" && <><Sparkles className="text-magic-royal" /> L'Annonce à la Une</>}
                            {activeTab === "programs" && <><GraduationCap className="text-magic-royal" /> Programmes Principaux</>}
                            {activeTab === "news" && <><Trophy className="text-magic-royal" /> Nouveautés de la Semaine</>}
                            {activeTab === "promo" && <><Store className="text-magic-royal" /> Promo Boutique (Accueil)</>}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">

                        {/* TAB: FEATURED (L'Annonce à la Une) */}
                        {activeTab === "featured" && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Titre de l'annonce</label>
                                        <input
                                            type="text"
                                            value={featuredConfig.title}
                                            onChange={(e) => setFeaturedConfig({ ...featuredConfig, title: e.target.value })}
                                            className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-royal/50"
                                            placeholder="Ex: La Masterclass Ultime"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Badge (Tag)</label>
                                        <input
                                            type="text"
                                            value={featuredConfig.tag}
                                            onChange={(e) => setFeaturedConfig({ ...featuredConfig, tag: e.target.value })}
                                            className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-royal/50"
                                            placeholder="Ex: Nouveau, Exclusif..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Texte de description</label>
                                    <textarea
                                        value={featuredConfig.description}
                                        onChange={(e) => setFeaturedConfig({ ...featuredConfig, description: e.target.value })}
                                        className="w-full h-32 bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-royal/50"
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
                                            className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-royal/50"
                                            placeholder="Ex: /watch/xxx ou https://..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Texte du bouton</label>
                                        <input
                                            type="text"
                                            value={featuredConfig.buttonText}
                                            onChange={(e) => setFeaturedConfig({ ...featuredConfig, buttonText: e.target.value })}
                                            className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-royal/50"
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
                        )}

                        {/* TAB: MAIN PROGRAMS */}
                        {activeTab === "programs" && (
                            <div className="space-y-6">
                                <p className="text-sm text-slate-400 font-light">
                                    Sélectionnez ici les formations qui doivent apparaître dans la section <strong>"La Formation Continue"</strong> tout en haut de la page <em>Ma Formation</em> de l'adulte.
                                </p>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Selected Programs */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-magic-royal flex items-center gap-2">
                                            Sélectionnés ({selectedPrograms.length})
                                        </h3>
                                        <div className="bg-[#111] border border-white/10 rounded-xl p-4 min-h-[300px] flex flex-col gap-3">
                                            {selectedPrograms.length === 0 ? (
                                                <div className="text-slate-500 text-sm font-light text-center m-auto p-4 border border-dashed border-white/5 rounded-lg w-full">
                                                    Aucun programme sélectionné. <br />Ajoutez-en depuis la liste.
                                                </div>
                                            ) : (
                                                selectedPrograms.map(course => (
                                                    <div key={course.id} className="flex items-center gap-4 bg-black/50 border border-magic-royal/30 rounded-lg p-3">
                                                        <div className="w-16 h-10 bg-black rounded overflow-hidden relative shrink-0">
                                                            {course.thumbnail_url && <Image src={course.thumbnail_url} alt="" fill className="object-cover" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-white truncate">{course.title}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => toggleProgramSelection(course.id)}
                                                            className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    {/* Available courses */}
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                                            Catalogue
                                        </h3>
                                        <div className="relative mb-4">
                                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                                            <input
                                                type="text"
                                                placeholder="Rechercher..."
                                                value={programSearch}
                                                onChange={e => setProgramSearch(e.target.value)}
                                                className="w-full bg-[#111] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-magic-royal/50"
                                            />
                                        </div>
                                        <div className="bg-[#111] border border-white/10 rounded-xl p-2 h-[300px] overflow-y-auto space-y-1 custom-scrollbar">
                                            {filteredPrograms.length === 0 ? (
                                                <p className="text-center text-slate-500 text-xs py-8">Aucun résultat</p>
                                            ) : (
                                                filteredPrograms.map(course => {
                                                    const isSelected = mainPrograms.includes(course.id);
                                                    if (isSelected) return null;
                                                    return (
                                                        <div key={course.id} className="flex items-center gap-3 hover:bg-white/5 rounded-lg p-2 transition-colors cursor-pointer" onClick={() => toggleProgramSelection(course.id)}>
                                                            <div className="w-12 h-8 bg-black rounded overflow-hidden relative shrink-0">
                                                                {course.thumbnail_url && <Image src={course.thumbnail_url} alt="" fill className="object-cover" />}
                                                            </div>
                                                            <p className="text-xs font-medium text-slate-300 flex-1 truncate">{course.title}</p>
                                                            <button className="text-magic-royal hover:text-blue-400 p-1">
                                                                <PlusCircle className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )
                                                })
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: NEWS */}
                        {activeTab === "news" && (
                            <div className="space-y-6">
                                <p className="text-sm text-slate-400 mb-4 font-light">
                                    Cochez les éléments que vous souhaitez faire apparaître dans la section "Nouveautés" de la Home.
                                </p>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-widest bg-white/5 p-2 rounded-lg border border-white/10">
                                        Vidéos du Catalogue
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {availableCourses.map(course => {
                                            const isSelected = newsConfig.some(n => n.id === course.id && n.type === 'course');
                                            return (
                                                <div
                                                    key={course.id}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setNewsConfig(newsConfig.filter(n => !(n.id === course.id && n.type === 'course')));
                                                        } else {
                                                            setNewsConfig([...newsConfig, { id: course.id, type: 'course' }]);
                                                        }
                                                    }}
                                                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${isSelected ? 'bg-magic-royal/10 border-magic-royal/50' : 'bg-[#111] border-white/10 hover:border-white/20'
                                                        }`}
                                                >
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-magic-royal border-magic-royal' : 'bg-transparent border-white/20'
                                                        }`}>
                                                        {isSelected && <span className="text-[10px] font-bold text-black">✓</span>}
                                                    </div>
                                                    <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-slate-400'}`}>{course.title}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                <Separator className="my-6 bg-white/5" />

                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-black uppercase tracking-widest bg-magic-royal p-2 rounded-lg border border-magic-royal shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                                        Contenu Personnalisé
                                    </h3>

                                    <div className="p-6 border border-white/10 bg-[#111] rounded-xl space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Type</label>
                                                <select
                                                    value={newCustomNewsItem.type}
                                                    onChange={(e) => setNewCustomNewsItem({ ...newCustomNewsItem, type: e.target.value })}
                                                    className="w-full bg-black border border-white/10 rounded-lg p-2 text-white text-sm focus:border-magic-royal/50 outline-none"
                                                >
                                                    <option value="custom_link">Lien Externe</option>
                                                    <option value="tip">Conseil / Astuce</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Titre</label>
                                                <input
                                                    type="text"
                                                    value={newCustomNewsItem.title}
                                                    onChange={(e) => setNewCustomNewsItem({ ...newCustomNewsItem, title: e.target.value })}
                                                    className="w-full bg-black border border-white/10 rounded-lg p-2 text-white text-sm focus:border-magic-royal/50 outline-none"
                                                    placeholder="Titre de l'élément..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Lien (URL) / Contenu</label>
                                            <input
                                                type="text"
                                                value={newCustomNewsItem.url}
                                                onChange={(e) => setNewCustomNewsItem({ ...newCustomNewsItem, url: e.target.value })}
                                                className="w-full bg-black border border-white/10 rounded-lg p-2 text-white text-sm focus:border-magic-royal/50 outline-none"
                                                placeholder={newCustomNewsItem.type === 'tip' ? "Texte du conseil..." : "https://..."}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <CoverImageUpload
                                                currentImageUrl={newCustomNewsItem.image}
                                                onUpload={(url) => setNewCustomNewsItem({ ...newCustomNewsItem, image: url })}
                                                label="Image (Optionnel)"
                                            />
                                        </div>

                                        <Button
                                            onClick={() => {
                                                if (!newCustomNewsItem.title) return;
                                                const id = `custom_${Date.now()}`;
                                                const newItem = {
                                                    id: id,
                                                    type: newCustomNewsItem.type,
                                                    data: {
                                                        title: newCustomNewsItem.title,
                                                        url: newCustomNewsItem.url,
                                                        image: newCustomNewsItem.image
                                                    }
                                                };
                                                setNewsConfig([...newsConfig, newItem]);
                                                setNewCustomNewsItem({ type: 'custom_link', title: '', url: '', image: '' });
                                            }}
                                            className="w-full bg-magic-royal/20 text-magic-royal border border-magic-royal/50 hover:bg-magic-royal hover:text-black"
                                        >
                                            <PlusCircle className="w-4 h-4 mr-2" />
                                            Ajouter à la liste
                                        </Button>
                                    </div>

                                    {/* List of Custom Items */}
                                    <div className="space-y-2">
                                        {newsConfig.filter(n => ['custom_link', 'tip', 'product'].includes(n.type)).map((item, index) => (
                                            <div key={item.id || index} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    {item.data?.image ? (
                                                        <img src={item.data.image} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-black border border-white/10 flex items-center justify-center">
                                                            {item.type === 'tip' && <Trophy className="w-4 h-4 text-slate-400" />}
                                                            {item.type === 'custom_link' && <ExternalLink className="w-4 h-4 text-slate-400" />}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{item.data?.title || "Sans titre"}</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-1.5 py-0.5 rounded text-slate-400">
                                                                {item.type === 'custom_link' ? 'LIEN' : 'CONSEIL'}
                                                            </span>
                                                            <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{item.data?.url}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setNewsConfig(newsConfig.filter(n => n.id !== item.id))}
                                                    className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB: PROMO */}
                        {activeTab === "promo" && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Titre d'Accroche</label>
                                        <input
                                            type="text"
                                            value={promoConfig.title}
                                            onChange={(e) => setPromoConfig({ ...promoConfig, title: e.target.value })}
                                            className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-royal/50"
                                            placeholder="Ex: Étendez votre magie !"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Sous-titre / Description</label>
                                        <textarea
                                            value={promoConfig.subtitle}
                                            onChange={(e) => setPromoConfig({ ...promoConfig, subtitle: e.target.value })}
                                            className="w-full h-24 bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-royal/50"
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
                                            className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-royal/50"
                                            placeholder="Ex: Découvrir"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Lien du bouton</label>
                                        <input
                                            type="text"
                                            value={promoConfig.link}
                                            onChange={(e) => setPromoConfig({ ...promoConfig, link: e.target.value })}
                                            className="w-full bg-[#111] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-magic-royal/50"
                                            placeholder="Ex: /dashboard/catalog"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
