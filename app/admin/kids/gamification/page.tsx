"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Plus, Trash2, Trophy, Loader2, Save } from "lucide-react";
import Image from "next/image";
import { 
    createBadgeAdmin, deleteBadgeAdmin, 
    createLevelAdmin, deleteLevelAdmin, 
    createSkinAdmin, deleteSkinAdmin, 
    createQuestAdmin, deleteQuestAdmin 
} from "./actions";

type Badge = {
    id: string;
    name: string;
    description: string;
    image_url: string;
    condition_type: 'count' | 'specific_item' | 'manual';
    condition_value: string;
};

export default function AdminGamificationPage() {
    const supabase = createClient();
    const [badges, setBadges] = useState<Badge[]>([]);
    const [quests, setQuests] = useState<any[]>([]);
    const [levels, setLevels] = useState<any[]>([]);
    const [skins, setSkins] = useState<any[]>([]);
    const [libraryItems, setLibraryItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [showQuestForm, setShowQuestForm] = useState(false);
    const [showLevelForm, setShowLevelForm] = useState(false);
    const [showSkinForm, setShowSkinForm] = useState(false);
    const [activeTab, setActiveTab] = useState<'badges' | 'quests' | 'levels' | 'skins'>('quests');

    const [newLevel, setNewLevel] = useState({ name: "", xp_threshold: 0 });
    const [newSkin, setNewSkin] = useState({ name: "", image_url: "", price_xp: 0, is_default: false, target_audience: "kids" });

    // New Badge State
    const [newBadge, setNewBadge] = useState<Partial<Badge>>({
        name: "",
        description: "",
        image_url: "",
        condition_type: "manual",
        condition_value: ""
    });

    const fetchBadges = async () => {
        const { data, error } = await supabase.from("badges").select("*").order("created_at", { ascending: false });
        if (error) console.error("Error fetching badges:", error);
        else setBadges(data || []);
    };

    const fetchQuests = async () => {
        const { data, error } = await supabase.from("gamification_quests").select(`
            *,
            library_items(title)
        `).order("created_at", { ascending: false });
        if (error) console.error("Error fetching quests:", error);
        else setQuests(data || []);
    };

    const fetchLevels = async () => {
        const { data } = await supabase.from("gamification_levels").select("*").order("xp_threshold", { ascending: true });
        setLevels(data || []);
    };

    const fetchLibraryItems = async () => {
        const { data } = await supabase.from("library_items").select("id, title").eq("audience", "kids");
        setLibraryItems(data || []);
    };

    const fetchSkins = async () => {
        const { data } = await supabase.from("avatar_skins").select("*").order("price_xp", { ascending: true });
        setSkins(data || []);
    };

    const fetchAll = async () => {
        setLoading(true);
        await Promise.all([fetchBadges(), fetchQuests(), fetchLevels(), fetchLibraryItems(), fetchSkins()]);
        setLoading(false);
    }

    useEffect(() => {
        fetchAll();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer ce badge ?")) return;
        try {
            await deleteBadgeAdmin(id);
            fetchBadges();
        } catch (error: any) {
            alert("Erreur lors de la suppression: " + error.message);
        }
    };

    const handleCreateLevel = async () => {
        if (!newLevel.name) return;
        try {
            await createLevelAdmin(newLevel);
            setShowLevelForm(false);
            setNewLevel({ name: "", xp_threshold: 0 });
            fetchLevels();
        } catch (error: any) {
            alert("Erreur: " + error.message);
        }
    };

    const handleDeleteLevel = async (id: string) => {
        if (!confirm("Supprimer ce niveau ?")) return;
        try {
            await deleteLevelAdmin(id);
            fetchLevels();
        } catch (error: any) {
            alert("Erreur: " + error.message);
        }
    };

    const handleCreateSkin = async () => {
        if (!newSkin.name || !newSkin.image_url) return alert("Nom et image requis");
        try {
            await createSkinAdmin(newSkin);
            setShowSkinForm(false);
            setNewSkin({ name: "", image_url: "", price_xp: 0, is_default: false, target_audience: "kids" });
            fetchSkins();
        } catch (error: any) {
            alert("Erreur: " + error.message);
        }
    };

    const handleDeleteSkin = async (id: string) => {
        if (!confirm("Attention: si des enfants utilisent ce skin, ils le perdront. Continuer ?")) return;
        try {
            await deleteSkinAdmin(id);
            fetchSkins();
        } catch (error: any) {
            alert("Erreur: " + error.message);
        }
    };

    const handleCreate = async () => {
        if (!newBadge.name) return alert("Nom requis");
        try {
            await createBadgeAdmin(newBadge);
            setShowForm(false);
            setNewBadge({ name: "", description: "", image_url: "", condition_type: "manual", condition_value: "" });
            fetchBadges();
        } catch (error: any) {
            console.error(error);
            alert("Erreur lors de la création: " + error.message);
        }
    };

    const [newQuest, setNewQuest] = useState<any>({
        title: "",
        description: "",
        trigger_type: "videos_watched",
        trigger_value: 0,
        reward_type: "badge", // 'badge', 'avatar', 'video'
        reward_xp: 0,
        reward_item_id: "",
        icon_url: "",
        target_audience: "kids"
    });

    const handleCreateQuest = async () => {
        if (!newQuest.title) return alert("Nom requis");

        const payload = {
            title: newQuest.title,
            description: newQuest.description,
            trigger_type: newQuest.trigger_type,
            trigger_value: parseInt(newQuest.trigger_value),
            reward_type: newQuest.reward_type,
            reward_xp: parseInt(newQuest.reward_xp) || 0,
            reward_item_id: newQuest.reward_item_id || null,
            icon_url: newQuest.icon_url || null,
            target_audience: newQuest.target_audience
        };

        try {
            await createQuestAdmin(payload);
            setShowQuestForm(false);
            setNewQuest({ title: "", description: "", trigger_type: "videos_watched", trigger_value: 0, reward_type: "badge", reward_xp: 0, reward_item_id: "", icon_url: "", target_audience: "kids" });
            fetchQuests();
        } catch (error: any) {
            console.error(error);
            alert("Erreur lors de la création de la quête: " + error.message);
        }
    };

    const handleDeleteQuest = async (id: string) => {
        if (!confirm("Supprimer cette quête ?")) return;
        try {
            await deleteQuestAdmin(id);
            fetchQuests();
        } catch (error: any) {
            alert("Erreur: " + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-magic-bg text-white p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            <span className="text-cyan-400"><Trophy /></span> Gamification
                        </h1>
                        <p className="text-gray-400">Gestion des Missions et Récompenses</p>
                    </div>
                    {activeTab === 'badges' && (
                        <button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)] hover:shadow-[0_0_25px_rgba(147,51,234,0.6)]">
                            <Plus className="w-5 h-5" /> Nouveau Badge
                        </button>
                    )}
                    {activeTab === 'quests' && (
                        <button onClick={() => setShowQuestForm(!showQuestForm)} className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(22,163,74,0.4)] hover:shadow-[0_0_25px_rgba(22,163,74,0.6)]">
                            <Plus className="w-5 h-5" /> Nouveau Succès
                        </button>
                    )}
                    {activeTab === 'levels' && (
                        <button onClick={() => setShowLevelForm(!showLevelForm)} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]">
                            <Plus className="w-5 h-5" /> Nouveau Niveau
                        </button>
                    )}
                    {activeTab === 'skins' && (
                        <button onClick={() => setShowSkinForm(!showSkinForm)} className="bg-brand-purple hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]">
                            <Plus className="w-5 h-5" /> Nouvel Avatar
                        </button>
                    )}
                </header>

                <div className="flex gap-4 border-b border-white/10 mb-8 pb-4">
                    <button
                        className={`font-bold pb-4 -mb-4 px-4 ${activeTab === 'quests' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500 hover:text-white'}`}
                        onClick={() => setActiveTab('quests')}
                    >
                        Les Succès (Quêtes)
                    </button>
                    <button
                        className={`font-bold pb-4 -mb-4 px-4 ${activeTab === 'levels' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500 hover:text-white'}`}
                        onClick={() => setActiveTab('levels')}
                    >
                        Niveaux (Grades)
                    </button>
                    <button
                        className={`font-bold pb-4 -mb-4 px-4 ${activeTab === 'skins' ? 'text-brand-purple border-b-2 border-brand-purple' : 'text-gray-500 hover:text-white'}`}
                        onClick={() => setActiveTab('skins')}
                    >
                        Avatars (Skins)
                    </button>
                    {/* <button
                        className={`font-bold pb-4 -mb-4 px-4 ${activeTab === 'badges' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-500 hover:text-white'}`}
                        onClick={() => setActiveTab('badges')}
                    >
                        Badges (Ancien système)
                    </button> */}
                </div>

                {activeTab === 'quests' && (
                    <>
                        {showQuestForm && (
                            <div className="bg-[#100b1a] border border-green-500/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] rounded-3xl p-8 mb-8 animate-in slide-in-from-top-4">
                                <h2 className="font-bold text-lg mb-4 text-green-300">Créer un Succès</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        placeholder="Nom du Succès (Ex: L'Élève Modèle)"
                                        className="bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-green-500"
                                        value={newQuest.title}
                                        onChange={e => setNewQuest({ ...newQuest, title: e.target.value })}
                                    />
                                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            placeholder="URL icône (Optionnel)"
                                            className="bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-green-500"
                                            value={newQuest.icon_url}
                                            onChange={e => setNewQuest({ ...newQuest, icon_url: e.target.value })}
                                        />
                                        <select
                                            className="bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-green-500"
                                            value={newQuest.target_audience}
                                            onChange={e => setNewQuest({ ...newQuest, target_audience: e.target.value })}
                                        >
                                            <option value="kids">Enfants uniquement</option>
                                            <option value="adults">Adultes uniquement</option>
                                            <option value="all">Pour tous</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 flex gap-2">
                                        <select
                                            className="w-1/2 bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-green-500"
                                            value={newQuest.trigger_type}
                                            onChange={e => setNewQuest({ ...newQuest, trigger_type: e.target.value })}
                                        >
                                            <option value="videos_watched">Vidéos Validées</option>
                                            <option value="subscription_months">Mois d'Abonnement</option>
                                            <option value="shop_purchases">Achats Boutique</option>
                                            <option value="lifetime_xp">Total XP Atteint</option>
                                        </select>
                                        <input
                                            type="number"
                                            placeholder="Valeur requise (Ex: 5)"
                                            className="w-1/2 bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-green-500 text-center"
                                            value={newQuest.trigger_value || ""}
                                            onChange={e => setNewQuest({ ...newQuest, trigger_value: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <textarea
                                            placeholder="Description (Ex: Complète 5 vidéos pour obtenir cette récompense)"
                                            className="w-full bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-green-500"
                                            value={newQuest.description}
                                            onChange={e => setNewQuest({ ...newQuest, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="md:col-span-2 bg-white/5 p-4 rounded-[16px] border border-white/5">
                                        <div className="text-sm font-bold text-gray-300 mb-3">Récompense à la clef</div>
                                        
                                        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                                            <select
                                                className="bg-black/40 border border-brand-purple/50 rounded-[12px] p-2 text-white outline-none"
                                                value={newQuest.reward_type}
                                                onChange={e => setNewQuest({ ...newQuest, reward_type: e.target.value, reward_item_id: "", reward_xp: 0 })}
                                            >
                                                <option value="badge">Badge + Poussières d'Étoile</option>
                                                <option value="avatar">Avatar Légendaire</option>
                                                <option value="video">Vidéo Secrète</option>
                                            </select>

                                            {newQuest.reward_type === 'badge' && (
                                                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                                                    <span className="text-cyan-400 font-bold">⭐</span>
                                                    <input
                                                        type="number"
                                                        placeholder="0"
                                                        className="w-24 bg-black/40 border border-yellow-500/50 rounded-[12px] p-2 text-white outline-none text-center font-black"
                                                        value={newQuest.reward_xp || ""}
                                                        onChange={e => setNewQuest({ ...newQuest, reward_xp: e.target.value })}
                                                    />
                                                    <span className="text-cyan-400 font-bold">XP Bonus</span>
                                                </div>
                                            )}

                                            {newQuest.reward_type === 'video' && (
                                                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                                                    <span className="text-blue-400 font-bold">🎬</span>
                                                    <select
                                                        className="bg-black/40 border border-blue-500/50 rounded-[12px] p-2 text-white outline-none"
                                                        value={newQuest.reward_item_id || ""}
                                                        onChange={e => setNewQuest({ ...newQuest, reward_item_id: e.target.value })}
                                                    >
                                                        <option value="" disabled>Sélectionner la vidéo</option>
                                                        {libraryItems.map((item: any) => (
                                                            <option key={item.id} value={item.id}>{item.title}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            {newQuest.reward_type === 'avatar' && (
                                                <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                                                    <span className="text-brand-purple font-bold">🎭</span>
                                                    <select
                                                        className="bg-black/40 border border-brand-purple/50 rounded-[12px] p-2 text-white outline-none"
                                                        value={newQuest.reward_item_id || ""}
                                                        onChange={e => setNewQuest({ ...newQuest, reward_item_id: e.target.value })}
                                                    >
                                                        <option value="" disabled>Sélectionner l'avatar</option>
                                                        {skins.map((skin: any) => (
                                                            <option key={skin.id} value={skin.id}>{skin.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setShowQuestForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Annuler</button>
                                    <button onClick={handleCreateQuest} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-[12px] font-bold flex items-center gap-2">
                                        <Save className="w-4 h-4" /> Activer la Quête
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4">
                            {loading ? <div className="text-center py-8">Chargement...</div> : quests.map(quest => (
                                <div key={quest.id} className="bg-[#100b1a] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-white/5 rounded-2xl p-5 flex items-center gap-6 hover:border-green-500/50 transition-all relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                                    {quest.icon_url && (
                                        <div className="w-14 h-14 flex-shrink-0 bg-black/50 rounded-[16px] flex items-center justify-center p-2 relative overflow-hidden border border-white/10">
                                            <Image src={quest.icon_url} alt="" fill className="object-contain p-2" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <h3 className="font-bold text-white text-lg">{quest.title} <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 ml-2 uppercase tracking-widest">{quest.target_audience}</span></h3>
                                        <p className="text-sm text-gray-400 mb-3">{quest.description}</p>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs uppercase font-bold bg-white/10 px-2.5 py-1 rounded-[8px] text-gray-300 flex items-center gap-1">
                                                🎯 {quest.trigger_type === 'videos_watched' ? 'Vidéos vues' : quest.trigger_type === 'subscription_months' ? "Mois d'abonnement" : quest.trigger_type === 'shop_purchases' ? "Achats Boutique" : 'Total XP'} : <span className="text-green-400">{quest.trigger_value}</span>
                                            </span>
                                            {quest.reward_xp > 0 && (
                                                <span className="text-xs uppercase font-bold bg-yellow-500/10 px-2.5 py-1 rounded-[8px] text-cyan-400 flex items-center gap-1">
                                                    ⭐ +{quest.reward_xp} XP
                                                </span>
                                            )}
                                            {quest.reward_item_id && (
                                                <span className="text-xs uppercase font-bold bg-purple-500/10 px-2.5 py-1 rounded-[8px] text-purple-400 flex items-center gap-1">
                                                    🎁 Débloque : {quest.library_items?.title}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDeleteQuest(quest.id)} className="p-3 text-gray-600 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                            {!loading && quests.length === 0 && <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-[16px]">Aucune quête configurée.</div>}
                        </div>
                    </>
                )}

                {activeTab === 'levels' && (
                    <>
                        {showLevelForm && (
                            <div className="bg-[#100b1a] border border-blue-500/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] rounded-3xl p-8 mb-8 animate-in slide-in-from-top-4">
                                <h2 className="font-bold text-lg mb-4 text-blue-300">Créer un Niveau</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        placeholder="Nom du Niveau (Ex: Sorcier Suprême)"
                                        className="bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-blue-500"
                                        value={newLevel.name}
                                        onChange={e => setNewLevel({ ...newLevel, name: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="XP Requis (Ex: 300)"
                                        className="bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-blue-500"
                                        value={newLevel.xp_threshold || ""}
                                        onChange={e => setNewLevel({ ...newLevel, xp_threshold: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setShowLevelForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Annuler</button>
                                    <button onClick={handleCreateLevel} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-[12px] font-bold flex items-center gap-2">
                                        <Save className="w-4 h-4" /> Sauvegarder
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] rounded-3xl md:p-8">
                           <div className="grid grid-cols-1 gap-2 max-w-xl mx-auto">
                               {levels.map((lvl, index) => (
                                   <div key={lvl.id} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-[16px]">
                                       <div className="flex items-center gap-4">
                                           <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-black flex items-center justify-center">
                                                {index + 1}
                                           </div>
                                           <h3 className="font-bold text-white text-lg">{lvl.name}</h3>
                                       </div>
                                       <div className="flex items-center gap-4">
                                           <span className="text-cyan-400 font-bold bg-yellow-500/10 px-3 py-1 rounded-[12px]">⭐ {lvl.xp_threshold} XP</span>
                                           <button onClick={() => handleDeleteLevel(lvl.id)} className="text-gray-500 hover:text-red-400 p-2">
                                               <Trash2 className="w-4 h-4" />
                                           </button>
                                       </div>
                                   </div>
                               ))}
                               {levels.length === 0 && <p className="text-center text-gray-500 py-10">Aucun niveau défini.</p>}
                           </div>
                        </div>
                    </>
                )}

                {activeTab === 'skins' && (
                    <>
                        {showSkinForm && (
                            <div className="bg-[#100b1a] border border-brand-purple/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] rounded-3xl p-8 mb-8 animate-in slide-in-from-top-4">
                                <h2 className="font-bold text-lg mb-4 text-pink-300">Ajouter un Avatar (Skin)</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        placeholder="Nom du Skin (Ex: Le Petit Ninja)"
                                        className="bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-brand-purple"
                                        value={newSkin.name}
                                        onChange={e => setNewSkin({ ...newSkin, name: e.target.value })}
                                    />
                                    <input
                                        placeholder="URL de l'image (https://...)"
                                        className="bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-brand-purple"
                                        value={newSkin.image_url}
                                        onChange={e => setNewSkin({ ...newSkin, image_url: e.target.value })}
                                    />
                                    <select
                                        className="bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-brand-purple md:col-span-2"
                                        value={newSkin.target_audience}
                                        onChange={e => setNewSkin({ ...newSkin, target_audience: e.target.value })}
                                    >
                                        <option value="kids">Enfants uniquement</option>
                                        <option value="adults">Adultes uniquement (Noir, Or, Bleu Roi)</option>
                                        <option value="all">Pour tous</option>
                                    </select>
                                    <div className="flex items-center gap-2 bg-white/5 p-3 rounded-[12px] border border-white/5">
                                        <span className="text-cyan-400 font-bold">⭐ Prix en Éclats :</span>
                                        <input
                                            type="number"
                                            placeholder="Prix (0 pour gratuit)"
                                            className="w-24 bg-black/40 border border-yellow-500/50 rounded-[12px] p-2 text-white outline-none"
                                            value={newSkin.price_xp || ""}
                                            onChange={e => setNewSkin({ ...newSkin, price_xp: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <label className="flex items-center gap-3 bg-white/5 p-3 rounded-[12px] border border-white/5 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-5 h-5 accent-brand-purple"
                                            checked={newSkin.is_default}
                                            onChange={e => setNewSkin({ ...newSkin, is_default: e.target.checked })}
                                        />
                                        <span className="text-sm font-bold text-white">Skin par défaut (Débloqué pour tous)</span>
                                    </label>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setShowSkinForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Annuler</button>
                                    <button onClick={handleCreateSkin} className="bg-indigo-600 hover:bg-brand-purple text-white px-6 py-2 rounded-[12px] font-bold flex items-center gap-2">
                                        <Save className="w-4 h-4" /> Mettre en vente
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {skins.map((skin) => (
                                <div key={skin.id} className="bg-[#100b1a] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] border border-white/5 rounded-3xl p-4 flex flex-col items-center text-center relative hover:border-brand-purple/50 transition-all">
                                    <button onClick={() => handleDeleteSkin(skin.id)} className="absolute top-2 right-2 p-2 bg-black/50 rounded-full text-gray-400 hover:text-red-400 transition-colors z-10">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    
                                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 mb-3 bg-black/50 relative">
                                        {skin.image_url ? (
                                           <Image src={skin.image_url} alt={skin.name} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">No img</div>
                                        )}
                                    </div>
                                    
                                    <h3 className="font-bold text-white text-lg">{skin.name}</h3>
                                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">{skin.target_audience}</span>
                                    
                                    <div className="mt-2 text-sm font-bold">
                                        {skin.is_default ? (
                                            <span className="text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">Gratuit de base</span>
                                        ) : skin.price_xp === 0 ? (
                                            <span className="text-brand-purple bg-brand-purple/10 px-3 py-1 rounded-full border border-brand-purple/20">Gratuit/Cadeau</span>
                                        ) : (
                                            <span className="text-cyan-400 bg-yellow-500/10 px-3 py-1 rounded-full flex items-center justify-center gap-1 border border-yellow-500/20">
                                                ⭐ {skin.price_xp} Éclats
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {skins.length === 0 && <div className="col-span-3 text-center text-gray-500 py-10">Aucun avatar enregistré.</div>}
                        </div>
                    </>
                )}

                {activeTab === 'badges' && (
                    <>
                    {showForm && (
                        <div className="bg-[#100b1a] border border-purple-500/30 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] rounded-3xl p-8 mb-8 animate-in slide-in-from-top-4">
                        <h2 className="font-bold text-lg mb-4 text-purple-300">Créer un Badge</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <input
                                placeholder="Nom du Badge (Ex: Premiers Pas)"
                                className="bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-purple-500"
                                value={newBadge.name}
                                onChange={e => setNewBadge({ ...newBadge, name: e.target.value })}
                            />
                            <input
                                placeholder="URL Image (icône)"
                                className="bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-purple-500"
                                value={newBadge.image_url}
                                onChange={e => setNewBadge({ ...newBadge, image_url: e.target.value })}
                            />
                            <div className="col-span-2">
                                <textarea
                                    placeholder="Description (Ex: Tu as validé ton premier tour !)"
                                    className="w-full bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-purple-500"
                                    value={newBadge.description}
                                    onChange={e => setNewBadge({ ...newBadge, description: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 mb-1 block">Condition</label>
                                <select
                                    className="w-full bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-purple-500"
                                    value={newBadge.condition_type}
                                    onChange={e => setNewBadge({ ...newBadge, condition_type: e.target.value as any })}
                                >
                                    <option value="manual">Manuelle (Admin uniquement)</option>
                                    <option value="count">Nombre d'Ateliers (Compteur)</option>
                                    <option value="specific_item">Atelier Spécifique (ID)</option>
                                </select>
                            </div>
                            {newBadge.condition_type !== 'manual' && (
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Valeur (Nombre ou ID)</label>
                                    <input
                                        placeholder={newBadge.condition_type === 'count' ? "Ex: 5" : "Ex: UUID-DE-L-ATELIER"}
                                        className="w-full bg-black/40 border border-white/10 rounded-[12px] p-3 text-white outline-none focus:border-purple-500"
                                        value={newBadge.condition_value}
                                        onChange={e => setNewBadge({ ...newBadge, condition_value: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleCreate}
                                className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-[12px] font-bold flex items-center gap-2"
                            >
                                <Save className="w-4 h-4" /> Enregistrer
                            </button>
                        </div>
                    </div>
                )}

                {/* List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <div className="text-center py-8 text-gray-500 col-span-2">Chargement...</div>
                    ) : badges.map(badge => (
                        <div key={badge.id} className="bg-[#100b1a] border border-white/5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5)] rounded-2xl p-4 flex items-center gap-4 hover:border-purple-500/30 transition-all">
                            <div className="w-16 h-16 bg-black/50 rounded-[12px] flex items-center justify-center relative overflow-hidden">
                                {badge.image_url ? (
                                    <Image src={badge.image_url} alt={badge.name} fill className="object-contain p-2" />
                                ) : (
                                    <Trophy className="w-8 h-8 text-gray-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-white">{badge.name}</h3>
                                <p className="text-xs text-gray-400 mb-1">{badge.description}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] uppercase font-bold bg-white/10 px-2 py-0.5 rounded text-gray-300">
                                        {badge.condition_type === 'manual' ? 'Manuel' :
                                            badge.condition_type === 'count' ? `Au bout de ${badge.condition_value} ateliers` :
                                                'Sur atelier spécifique'}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(badge.id)}
                                className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {!loading && badges.length === 0 && (
                        <div className="col-span-2 text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-[16px]">
                            Aucun badge configuré.
                        </div>
                    )}
                </div>
                    </>
                )}
            </div>
        </div>
    );
}
