"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, PlaySquare } from "lucide-react";
import { createClient } from '@/lib/supabase/client';

export type SpaceType = 'kids' | 'adults' | 'all';

interface CourseSelectorProps {
    space: SpaceType;
    onSelect: (courseId: string | null) => void;
}

export function CourseSelector({ space, onSelect }: CourseSelectorProps) {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCourses() {
            try {
                const supabase = createClient();
                let query = supabase
                    .from('library_items')
                    .select('id, title, description, thumbnail_url, audience')
                    .eq('status', 'published')
                    .order('created_at', { ascending: false });

                if (space !== 'all') {
                    query = query.eq('audience', space);
                }

                const { data, error } = await query;

                if (error) throw error;
                if (data) setCourses(data);
            } catch (e) {
                console.error("Erreur chargement cours:", e);
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, [space]);

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (id: string) => {
        if (selectedId === id) {
            setSelectedId(null);
            onSelect(null);
        } else {
            setSelectedId(id);
            onSelect(id);
        }
    };

    if (loading) {
        return <div className="flex justify-center p-8 border border-white/5 rounded-2xl bg-black/20"><Loader2 className="w-6 h-6 animate-spin text-brand-royal" /></div>;
    }

    return (
        <div className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5 shadow-inner">
            <h3 className="font-bold text-sm text-brand-royal uppercase tracking-widest flex items-center gap-2">
                <PlaySquare className="w-4 h-4" /> Sélectionner un Cours / Masterclass
            </h3>

            <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input
                    type="text"
                    placeholder="Rechercher par titre..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-brand-royal/50"
                />
            </div>

            <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredCourses.map(course => (
                    <button
                        key={course.id}
                        type="button"
                        onClick={() => handleSelect(course.id)}
                        className={`flex items-center gap-4 p-3 rounded-xl border text-left transition-all ${selectedId === course.id
                                ? 'bg-brand-royal/10 border-brand-royal/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]'
                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }`}
                    >
                        {course.thumbnail_url ? (
                            <img src={course.thumbnail_url} alt="" className="w-16 h-12 object-cover rounded-lg shrink-0" />
                        ) : (
                            <div className="w-16 h-12 bg-black/50 rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                                <PlaySquare className="w-5 h-5 text-white/30" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-bold truncate ${selectedId === course.id ? 'text-brand-royal' : 'text-white'}`}>{course.title}</p>
                            <p className="text-xs text-brand-text-muted truncate mt-0.5">{course.description || "Aucune description."}</p>
                        </div>
                        {selectedId === course.id && (
                            <div className="w-6 h-6 rounded-full bg-brand-royal/20 flex items-center justify-center shrink-0">
                                <div className="w-2.5 h-2.5 rounded-full bg-brand-royal"></div>
                            </div>
                        )}
                    </button>
                ))}

                {filteredCourses.length === 0 && (
                    <p className="text-center text-sm text-white/50 py-4">Aucun résultat trouvé.</p>
                )}
            </div>
        </div>
    );
}
