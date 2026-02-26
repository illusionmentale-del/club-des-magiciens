"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Save, X, Search, PlusCircle } from "lucide-react";
import { saveAdultHomeSettings } from "@/app/admin/actions";
import Image from "next/image";

interface Course {
    id: string;
    title: string;
    thumbnail_url?: string;
}

interface AdultMainProgramsConfigProps {
    initialSettings: Record<string, any>;
    availableCourses: Course[];
}

export default function AdultMainProgramsConfig({ initialSettings, availableCourses }: AdultMainProgramsConfigProps) {
    const [loading, setLoading] = useState(false);

    // Attempt to parse existing configuration or default to empty array
    let parsedInitial = [];
    try {
        if (initialSettings.adult_home_main_programs) {
            parsedInitial = JSON.parse(initialSettings.adult_home_main_programs);
            if (!Array.isArray(parsedInitial)) parsedInitial = [];
        }
    } catch (e) {
        console.error("Failed to parse initial main programs", e);
    }

    const [selectedIds, setSelectedIds] = useState<string[]>(parsedInitial);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSave = async () => {
        setLoading(true);
        try {
            await saveAdultHomeSettings({
                main_programs: selectedIds // Will be saved as 'adult_home_main_programs'
            });
            alert("Programmes principaux enregistrés avec succès !");
        } catch (error) {
            console.error(error);
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setLoading(false);
        }
    };

    const toggleSelection = (courseId: string) => {
        if (selectedIds.includes(courseId)) {
            setSelectedIds(prev => prev.filter(id => id !== courseId));
        } else {
            /* Optional logic to limit number of main programs (e.g. max 4) 
               But let's keep it flexible for now. */
            setSelectedIds(prev => [...prev, courseId]);
        }
    };

    const filteredCourses = availableCourses.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedCourses = selectedIds
        .map(id => availableCourses.find(c => c.id === id))
        .filter(c => c !== undefined) as Course[];

    return (
        <Card className="bg-black border-white/5 shadow-2xl overflow-hidden mt-8">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="text-xl font-serif font-bold tracking-tight flex items-center gap-3 text-white">
                        <GraduationCap className="text-magic-gold w-5 h-5" />
                        Programmes Principaux (Hub "Mon Contenu")
                    </CardTitle>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-brand-primary text-black hover:bg-yellow-400 font-bold px-6 shrink-0"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-8">

                <p className="text-sm text-slate-400 mb-8 font-light max-w-3xl">
                    Sélectionnez ici les formations qui doivent apparaître dans la section <strong>"La Formation Continue"</strong> tout en haut de la page <em>Mon Contenu</em> de l'adulte. Quotidiennement, cela correspond souvent à l'abonnement du Club ou à de gros cursus (ex: Mentalisme Pro). Tout ce qui n'est pas sélectionné ici finira dans la grille "Mes Achats Isolés" en dessous.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* LEFT COLUMN: SELECTED PROGRAMS */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-magic-gold flex items-center gap-2">
                            Programmes Sélectionnés ({selectedCourses.length})
                        </h3>

                        <div className="bg-[#111] border border-white/10 rounded-xl p-4 min-h-[300px] flex flex-col gap-3">
                            {selectedCourses.length === 0 ? (
                                <div className="text-slate-500 text-sm font-light text-center m-auto p-4 border border-dashed border-white/5 rounded-lg w-full">
                                    Aucun programme sélectionné. <br />Veuillez en ajouter depuis la liste de droite.
                                </div>
                            ) : (
                                selectedCourses.map(course => (
                                    <div key={course.id} className="flex items-center gap-4 bg-black/50 border border-magic-gold/30 rounded-lg p-3 group">
                                        <div className="w-16 h-10 bg-black rounded overflow-hidden relative shrink-0">
                                            {course.thumbnail_url ? (
                                                <Image src={course.thumbnail_url} alt="" fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                                                    <span className="text-[8px] text-slate-600">No Img</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate">{course.title}</p>
                                        </div>
                                        <button
                                            onClick={() => toggleSelection(course.id)}
                                            className="w-8 h-8 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0"
                                            title="Retirer"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: AVAILABLE COURSES */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            Catalogue
                        </h3>

                        <div className="relative mb-4">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Rechercher une formation..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-magic-gold/50"
                            />
                        </div>

                        <div className="bg-[#111] border border-white/10 rounded-xl p-2 h-[300px] overflow-y-auto space-y-1 custom-scrollbar">
                            {filteredCourses.length === 0 ? (
                                <p className="text-center text-slate-500 text-xs py-8">Aucun résultat</p>
                            ) : (
                                filteredCourses.map(course => {
                                    const isSelected = selectedIds.includes(course.id);
                                    if (isSelected) return null; // Don't show already selected items

                                    return (
                                        <div key={course.id} className="flex items-center gap-3 hover:bg-white/5 rounded-lg p-2 transition-colors cursor-pointer" onClick={() => toggleSelection(course.id)}>
                                            <div className="w-12 h-8 bg-black rounded overflow-hidden relative shrink-0">
                                                {course.thumbnail_url ? (
                                                    <Image src={course.thumbnail_url} alt="" fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-[#1a1a1a]"></div>
                                                )}
                                            </div>
                                            <p className="text-xs font-medium text-slate-300 flex-1 truncate">{course.title}</p>
                                            <button className="text-magic-gold hover:text-yellow-400 p-1">
                                                <PlusCircle className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
