"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Video, Save, Eye } from "lucide-react";
import { saveAdultHomeSettings } from "@/app/admin/actions";
import CoverImageUpload from "@/components/admin/CoverImageUpload";

interface LibraryItem {
    id: string;
    title: string;
    thumbnail_url?: string;
}

interface CourseItem {
    id: string;
    title: string;
}

interface HubCard {
    id: string;
    title: string;
    description: string;
    level: string;
    color: string;
    buttonText: string;
    courseId: string;
}

interface AdultMasterclassConfigProps {
    initialSettings: Record<string, any>;
    libraryItems: LibraryItem[];
    courses: CourseItem[];
}

export default function AdultMasterclassConfig({ initialSettings, libraryItems, courses }: AdultMasterclassConfigProps) {
    const [activeTab, setActiveTab] = useState("hero");
    const [loading, setLoading] = useState(false);

    // Page Title & Description State
    const [pageConfig, setPageConfig] = useState(
        initialSettings.adult_masterclass_page_config ? JSON.parse(initialSettings.adult_masterclass_page_config) : {
            title: "La Formation",
            description: "Retrouve ici ton parcours d'apprentissage de la magie."
        }
    );

    // Featured Masterclass State
    const [featuredConfig, setFeaturedConfig] = useState(
        initialSettings.adult_masterclass_featured_config ? JSON.parse(initialSettings.adult_masterclass_featured_config) : {
            id: "",
            image: "",
            title: "",
            description: ""
        }
    );

    // Hub Cards State
    const defaultCards: HubCard[] = [
        {
            id: "card-1",
            title: "Formation Débutant",
            description: "Les bases fondamentales de la prestidigitation.",
            level: "Pour bien démarrer",
            color: "from-blue-600 to-blue-400",
            buttonText: "Commencer",
            courseId: ""
        },
        {
            id: "card-2",
            title: "Formation Intermédiaire",
            description: "Techniques avancées et perfectionnement.",
            level: "Pour aller plus loin",
            color: "from-magic-royal to-amber-500",
            buttonText: "Découvrir",
            courseId: ""
        },
        {
            id: "card-3",
            title: "Formation Professionnelle",
            description: "Le secret des professionnels : construction de spectacle.",
            level: "L'Excellence",
            color: "from-purple-600 to-pink-500",
            buttonText: "Découvrir",
            courseId: ""
        }
    ];

    const [hubCards, setHubCards] = useState<HubCard[]>(
        initialSettings.adult_masterclass_hub_cards 
            ? JSON.parse(initialSettings.adult_masterclass_hub_cards) 
            : defaultCards
    );

    const handleCreateCourse = async (cardIndex: number) => {
        const title = prompt("Nom de la nouvelle formation ?");
        if (!title) return;
        
        try {
            // Placeholder: we'll call an actual action here if needed, or simply redirect to a creation page
            // But since we want to create it quickly:
            // We can just rely on the existing "Save" mechanism, but to create a real Course in DB requires a Server Action.
            // For now, we will add a small alert.
            alert("Veuillez d'abord sauvegarder cette page, puis rendez-vous sur le tableau de bord pour créer un programme via la BDD manuel, ou on va utiliser la route dédiée !");
        } catch (e) {
            console.error(e);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            await saveAdultHomeSettings({
                adult_masterclass_page_config: JSON.stringify(pageConfig),
                adult_masterclass_featured_config: JSON.stringify(featuredConfig),
                adult_masterclass_hub_cards: JSON.stringify(hubCards)
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
                    { id: "hub", label: "Parcours (Cartes)", icon: Video },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${activeTab === tab.id
                            ? "bg-brand-royal text-black shadow-lg shadow-brand-royal/20"
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
                    className="w-full bg-brand-royal text-black hover:bg-brand-royal/80"
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
                            <Sparkles className="text-brand-royal" /> Contenu à la Une
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
                                            className="w-full bg-brand-bg border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-royal/50"
                                            placeholder="Ex: Les Masterclass"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-brand-text-muted">Phrase d'accroche</label>
                                        <textarea
                                            value={pageConfig.description}
                                            onChange={(e) => setPageConfig({ ...pageConfig, description: e.target.value })}
                                            className="w-full h-24 bg-brand-bg border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-royal/50 transition-all"
                                            placeholder="Entrez la description pour la page..."
                                        />
                                    </div>
                                </div>

                                <Separator className="bg-white/10" />

                                {/* Section 2: Featured Masterclass */}
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-white border-b border-white/10 pb-2">Atelier à la Une</h3>

                                    <div className="space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-brand-text-muted">Sélection de la vidéo</label>
                                        <p className="text-[10px] text-brand-text-muted -mt-2 mb-2">Choisissez la formation ou l'atelier à mettre en valeur en haut de la page.</p>
                                        <select
                                            value={featuredConfig.id}
                                            onChange={(e) => setFeaturedConfig({ ...featuredConfig, id: e.target.value })}
                                            className="w-full bg-brand-bg border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-royal/50 appearance-none"
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
                                                    className="w-full bg-brand-bg border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-royal/50"
                                                    placeholder="Ex: Nouvel Atelier !"
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

                        {activeTab === "hub" && (
                            <div className="space-y-10">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Cartes de Formation</h3>
                                        <p className="text-[10px] text-brand-text-muted mt-1 uppercase tracking-widest font-bold">Configurez les 3 grandes offres du portail</p>
                                    </div>
                                    <Button
                                        onClick={() => setHubCards([...hubCards, { id: `card-${Date.now()}`, title: "Nouvelle Option", description: "", level: "Nouveau", color: "from-gray-600 to-gray-400", buttonText: "Découvrir", courseId: "" }])}
                                        variant="outline"
                                        className="border-white/20 text-white hover:bg-white/10"
                                    >
                                        + Ajouter une carte
                                    </Button>
                                </div>

                                <div className="space-y-8">
                                    {hubCards.map((card, index) => (
                                        <div key={card.id} className="bg-black/20 border border-white/5 rounded-2xl p-6 relative">
                                            {/* Delete Card */}
                                            <button 
                                                onClick={() => setHubCards(hubCards.filter((_, i) => i !== index))}
                                                className="absolute top-4 right-4 text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                Supprimer
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">Titre</label>
                                                    <input
                                                        type="text"
                                                        value={card.title}
                                                        onChange={(e) => {
                                                            const newCards = [...hubCards];
                                                            newCards[index].title = e.target.value;
                                                            setHubCards(newCards);
                                                        }}
                                                        className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-royal/50"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">Badge / Niveau</label>
                                                    <input
                                                        type="text"
                                                        value={card.level}
                                                        onChange={(e) => {
                                                            const newCards = [...hubCards];
                                                            newCards[index].level = e.target.value;
                                                            setHubCards(newCards);
                                                        }}
                                                        className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-royal/50"
                                                    />
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">Description</label>
                                                    <textarea
                                                        value={card.description}
                                                        onChange={(e) => {
                                                            const newCards = [...hubCards];
                                                            newCards[index].description = e.target.value;
                                                            setHubCards(newCards);
                                                        }}
                                                        className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-royal/50"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">Dégradé de couleurs (Classes Tailwind)</label>
                                                    <input
                                                        type="text"
                                                        value={card.color}
                                                        onChange={(e) => {
                                                            const newCards = [...hubCards];
                                                            newCards[index].color = e.target.value;
                                                            setHubCards(newCards);
                                                        }}
                                                        className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-royal/50 text-xs font-mono"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-text-muted">Texte du bouton Action</label>
                                                    <input
                                                        type="text"
                                                        value={card.buttonText}
                                                        onChange={(e) => {
                                                            const newCards = [...hubCards];
                                                            newCards[index].buttonText = e.target.value;
                                                            setHubCards(newCards);
                                                        }}
                                                        className="w-full bg-brand-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-royal/50"
                                                    />
                                                </div>

                                                <div className="space-y-2 md:col-span-2 pt-4 border-t border-white/5">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-royal">Connexion au Contenu (Base de données)</label>
                                                    <p className="text-[10px] text-brand-text-muted -mt-1 leading-snug">
                                                        Sélectionnez la Formation dans la BDD pour ce bloc. S'il y a un lien, le visiteur sera redirigé vers ce parcours.
                                                    </p>
                                                    <div className="flex items-center gap-4">
                                                        <select
                                                            value={card.courseId}
                                                            onChange={(e) => {
                                                                const newCards = [...hubCards];
                                                                newCards[index].courseId = e.target.value;
                                                                setHubCards(newCards);
                                                            }}
                                                            className="flex-1 bg-brand-bg border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-brand-royal/50"
                                                        >
                                                            <option value="">-- Lier à aucune formation spécifique --</option>
                                                            {courses.map(course => (
                                                                <option key={course.id} value={course.id}>{course.title}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {/* BOUTON MAGIC: GO TO COURSE MANAGER */}
                                                    {card.courseId && (
                                                        <div className="mt-4 flex flex-col items-start gap-2">
                                                            <Button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    // Navigate to the Course Manager
                                                                    window.location.href = `/admin/adults/courses/${card.courseId}`;
                                                                }}
                                                                className="bg-brand-royal text-black hover:bg-yellow-500 font-bold"
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Gérer les vidéos de cette formation
                                                            </Button>
                                                            <p className="text-[10px] bg-red-500/10 text-red-400 p-2 rounded"><strong>Attention:</strong> N'oubliez pas d'enregistrer vos modifications ici avant de partir !</p>
                                                        </div>
                                                    )}
                                                    
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
