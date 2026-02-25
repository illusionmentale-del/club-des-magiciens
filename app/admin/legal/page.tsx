"use client";

import { useState, useEffect } from "react";
import { BookOpen, AlertCircle, Save, FileText, CheckCircle2 } from "lucide-react";
import { fetchLegalPages, updateLegalPage } from "./actions";

interface LegalPage {
    id: string;
    slug: string;
    title: string;
    content: string;
}

export default function LegalPagesAdmin() {
    const [pages, setPages] = useState<LegalPage[]>([]);
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [content, setContent] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadPages();
    }, []);

    const loadPages = async () => {
        setIsLoading(true);
        const data = await fetchLegalPages();
        if (data && data.length > 0) {
            setPages(data);
            setSelectedPageId(data[0].id);
            setContent(data[0].content || "");
        }
        setIsLoading(false);
    };

    const handleSelectPage = (id: string) => {
        const page = pages.find((p: LegalPage) => p.id === id);
        if (page) {
            setSelectedPageId(id);
            setContent(page.content || "");
            setSaveStatus("idle");
        }
    };

    const handleSave = async () => {
        if (!selectedPageId) return;
        setIsSaving(true);
        setSaveStatus("idle");

        const result = await updateLegalPage(selectedPageId, content);

        if (result.success) {
            setSaveStatus("success");
            // Mettre à jour la variable locale
            setPages(pages.map((p: LegalPage) => p.id === selectedPageId ? { ...p, content: content } : p));
            setTimeout(() => setSaveStatus("idle"), 3000);
        } else {
            setSaveStatus("error");
        }
        setIsSaving(false);
    };

    const selectedPage = pages.find((p: LegalPage) => p.id === selectedPageId);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-purple"></div>
        </div>;
    }

    if (pages.length === 0) {
        return (
            <div className="bg-brand-card border border-white/5 rounded-2xl p-8 text-center max-w-2xl mx-auto mt-12">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Base de données non initialisée</h2>
                <p className="text-brand-text-muted mb-4">
                    La table des pages légales n'a pas encore été créée dans Supabase. Veuillez vous référer aux instructions pour exécuter le script SQL.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-brand-purple" />
                        Textes Légaux
                    </h1>
                    <p className="text-brand-text-muted mt-2">
                        Gérez ici le contenu de vos mentions légales, politique de confidentialité, etc.
                        Ces textes sont obligatoires en France.
                    </p>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto">
                    {pages.map((page) => (
                        <button
                            key={page.id}
                            onClick={() => handleSelectPage(page.id)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-all ${selectedPageId === page.id
                                ? "bg-brand-purple text-white shadow-lg"
                                : "text-brand-text-muted hover:text-white hover:bg-white/5"
                                }`}
                        >
                            {page.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Éditeur */}
                <div className="flex flex-col gap-4 bg-brand-card border border-white/5 rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="font-bold text-white flex items-center gap-2">
                            <FileText className="w-4 h-4 text-brand-purple" />
                            Éditeur HTML
                        </h2>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl transition-all ${saveStatus === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                'bg-brand-purple text-white hover:bg-brand-purple/90 shadow-lg shadow-brand-purple/30'
                                }`}
                        >
                            {isSaving ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : saveStatus === 'success' ? (
                                <CheckCircle2 className="w-4 h-4" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            {isSaving ? "Enregistrement..." : saveStatus === 'success' ? "Enregistré !" : "Mettre à jour"}
                        </button>
                    </div>

                    <p className="text-xs text-brand-text-muted mb-2">
                        Le texte est interprété en HTML. Vous pouvez utiliser les balises classiques : <code className="bg-black/30 px-1 py-0.5 rounded text-brand-purple">&lt;h2&gt;</code>, <code className="bg-black/30 px-1 py-0.5 rounded text-brand-purple">&lt;p&gt;</code>, <code className="bg-black/30 px-1 py-0.5 rounded text-brand-purple">&lt;strong&gt;</code>... ou coller directement un texte brut.
                    </p>

                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-[500px] bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-gray-300 font-mono focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none resize-y"
                        placeholder="Insérez le texte HTML de vos mentions légales ici..."
                    />
                </div>

                {/* Aperçu en direct */}
                <div className="flex flex-col bg-white rounded-2xl p-8 shadow-xl border border-gray-200 overflow-hidden text-gray-900">
                    <div className="border-b border-gray-200 pb-4 mb-6">
                        <span className="text-[10px] font-black uppercase tracking-widest text-brand-purple mb-1 block">Aperçu en direct</span>
                        <h2 className="text-2xl font-black">{selectedPage?.title}</h2>
                    </div>

                    {/* Conteneur stylisé pour que l'HTML s'affiche proprement */}
                    <div
                        className="prose prose-sm md:prose-base max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-a:text-brand-purple overflow-y-auto h-[450px]"
                        dangerouslySetInnerHTML={{ __html: content || "<p class='text-gray-400 italic'>L'aperçu apparaîtra ici...</p>" }}
                    />
                </div>
            </div>
        </div>
    );
}
