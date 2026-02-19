"use client";

import { useState, useEffect } from "react";
import { Eye, Monitor, Smartphone, RotateCcw, X, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAdmin } from "@/app/admin/AdminContext";

export default function GlobalPreview() {
    const { isPreviewOpen: isOpen, setIsPreviewOpen: setIsOpen } = useAdmin();
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('mobile');
    const [previewKey, setPreviewKey] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Safety timeout to hide loader if onLoad doesn't fire or takes too long
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => setIsLoading(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, previewKey]);

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                variant="outline"
                className="bg-brand-purple/10 border-brand-purple/20 text-brand-purple hover:bg-brand-purple hover:text-white transition-all font-bold uppercase tracking-widest text-[10px] h-8"
            >
                <Eye className="w-3.5 h-3.5 mr-2" />
                Aperçu Direct
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            {/* Header of Preview */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-brand-bg/50">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-brand-purple/20 rounded-lg flex items-center justify-center border border-brand-purple/30">
                            <Eye className="w-4 h-4 text-brand-purple" />
                        </div>
                        <span className="font-black uppercase tracking-tighter text-white">Aperçu Espace Kids</span>
                    </div>

                    <Separator orientation="vertical" className="h-6 bg-white/10 mx-2" />

                    <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg border border-white/5">
                        <button
                            onClick={() => setPreviewMode('desktop')}
                            className={`p-1.5 rounded-md transition-all ${previewMode === 'desktop' ? 'bg-brand-purple text-white' : 'text-brand-text-muted hover:text-white'}`}
                            title="Mode Ordinateur"
                        >
                            <Monitor className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setPreviewMode('mobile')}
                            className={`p-1.5 rounded-md transition-all ${previewMode === 'mobile' ? 'bg-brand-purple text-white' : 'text-brand-text-muted hover:text-white'}`}
                            title="Mode Mobile"
                        >
                            <Smartphone className="w-4 h-4" />
                        </button>
                        <Separator orientation="vertical" className="h-4 bg-white/10 mx-1" />
                        <button
                            onClick={() => {
                                setPreviewKey(prev => prev + 1);
                                setIsLoading(true);
                            }}
                            className="p-1.5 rounded-md text-brand-text-muted hover:text-white transition-all"
                            title="Actualiser l'aperçu"
                        >
                            <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin text-brand-purple' : ''}`} />
                        </button>
                    </div>

                    <Button
                        onClick={() => window.open("/kids?preview=true", "_blank")}
                        variant="outline"
                        className="h-9 border-white/10 hover:bg-white/5 text-xs text-brand-text-muted hover:text-white"
                    >
                        <ExternalLink className="w-3.5 h-3.5 mr-2" />
                        Ouvrir dans un nouvel onglet
                    </Button>
                </div>

                <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-brand-text-muted hover:text-red-400 transition-all border border-white/5"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative">
                {previewMode === 'mobile' ? (
                    /* High-Fidelity iPhone Simulator */
                    <div className="relative mx-auto h-[680px] w-[330px] transition-transform duration-500 scale-90 md:scale-100">
                        {/* External Frame / Case */}
                        <div className="absolute inset-0 bg-[#1a1a1c] rounded-[3.5rem] shadow-[0_0_0_2px_#333,0_0_0_6px_#111,0_20px_50px_rgba(0,0,0,0.8)] border-2 border-white/5 overflow-hidden">
                            {/* Inner Screen Container */}
                            <div className="absolute inset-2 bg-brand-bg rounded-[2.8rem] overflow-hidden border border-black shadow-inner">
                                <iframe
                                    key={`mobile-${previewKey}`}
                                    src={`/kids?preview=true&view=mobile&k=${previewKey}`}
                                    className="w-full h-full border-none"
                                    onLoad={() => setIsLoading(false)}
                                />
                                {isLoading && (
                                    <div className="absolute inset-0 bg-brand-bg flex flex-col items-center justify-center p-8 text-center">
                                        <RotateCcw className="w-10 h-10 text-brand-purple animate-spin mb-4" />
                                        <p className="text-sm font-bold text-white mb-2">Chargement de la magie...</p>
                                        <p className="text-xs text-brand-text-muted">Si cela prend trop de temps, vérifie ta connexion ou utilise le bouton d'ouverture externe.</p>
                                    </div>
                                )}
                            </div>

                            {/* Dynamic Island / Notch */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[100px] h-[24px] bg-black rounded-full z-20 flex items-center justify-center border border-white/5">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40 mr-2 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
                                <div className="w-12 h-1 bg-white/10 rounded-full mr-2"></div>
                            </div>

                            {/* Side Buttons - Left (Volume) */}
                            <div className="absolute top-32 -left-[8px] w-[3px] h-12 bg-[#222] rounded-l-md border-y border-white/5"></div>
                            <div className="absolute top-48 -left-[8px] w-[3px] h-12 bg-[#222] rounded-l-md border-y border-white/5"></div>

                            {/* Side Buttons - Right (Power) */}
                            <div className="absolute top-40 -right-[8px] w-[3px] h-20 bg-[#222] rounded-r-md border-y border-white/5"></div>
                        </div>
                    </div>
                ) : (
                    /* Desktop Simulator */
                    <div className="w-full h-full border border-white/10 rounded-2xl overflow-hidden bg-brand-bg shadow-2xl flex flex-col">
                        <div className="bg-white/5 border-b border-white/5 p-3 flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="bg-black/20 rounded-lg px-4 py-1 text-xs text-brand-text-muted font-mono flex-1 border border-white/5 max-w-md mx-auto truncate">
                                https://clubdesmagiciens.fr/kids
                            </div>
                        </div>
                        <iframe
                            key={`desktop-${previewKey}`}
                            src={`/kids?preview=true&view=desktop&k=${previewKey}`}
                            className="flex-1 w-full border-none"
                            onLoad={() => setIsLoading(false)}
                        />
                        {isLoading && (
                            <div className="absolute inset-0 bg-brand-bg flex flex-col items-center justify-center p-12 text-center">
                                <RotateCcw className="w-12 h-12 text-brand-purple animate-spin mb-6" />
                                <p className="text-lg font-bold text-white mb-3">Invocation du Club...</p>
                                <p className="text-sm text-brand-text-muted max-w-sm">Préparation de l'interface magique pour ordinateur.</p>
                            </div>
                        )}
                    </div>
                )}

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-brand-purple/20 border border-brand-purple/30 rounded-full backdrop-blur-md z-[60]">
                    <Info className="w-4 h-4 text-brand-purple" />
                    <p className="text-[10px] font-medium text-white/80">
                        L'aperçu utilise tes réglages actuels. Si l'écran reste noir ou affiche une erreur, utilise le bouton d'ouverture externe.
                    </p>
                </div>
            </div>
        </div>
    );
}
