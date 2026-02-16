import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react"; // Ideally import deleteCourse action

export default async function CoursesIndexPage(props: { searchParams: Promise<{ audience?: string }> }) {
    const searchParams = await props.searchParams;
    const filterAudience = searchParams.audience || 'all';

    const supabase = await createClient();

    // Fetch courses based on filter (or all)
    let query = supabase.from("courses").select("*").order("created_at", { ascending: false });

    // If filter is specific, apply it. BUT user wants to see everything easily.
    // Let's just fetch all and filter in UI or use tabs. Or rely on query param.
    if (filterAudience !== 'all') {
        query = query.eq('audience', filterAudience);
    }

    const { data: courses } = await query;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border pb-8">
                <div>
                    <Link href="/admin" className="text-brand-text-muted hover:text-white flex items-center gap-2 mb-2">
                        <ArrowLeft className="w-4 h-4" />
                        Retour Dashboard
                    </Link>
                    <h1 className="text-3xl font-serif text-brand-text">Gestion des Formations</h1>
                    <p className="text-brand-text-muted">Créez et modifiez vos cours pour Adultes et Enfants.</p>
                </div>
                <Link href="/admin/adults/courses/new" className="bg-brand-purple hover:bg-brand-purple/90 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-brand-purple/20">
                    <Plus className="w-5 h-5" />
                    Nouveau Cours
                </Link>
            </header>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                <Link href="/admin/adults/courses?audience=all" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterAudience === 'all' ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    Tout
                </Link>
                <Link href="/admin/adults/courses?audience=adults" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterAudience === 'adults' ? 'bg-magic-purple text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    Adultes
                </Link>
                <Link href="/admin/adults/courses?audience=kids" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterAudience === 'kids' ? 'bg-white text-purple-600' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    Kids
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses?.map((course) => (
                    <Link key={course.id} href={`/admin/adults/courses/${course.id}`} className="group bg-brand-card border border-brand-border rounded-xl overflow-hidden hover:border-brand-purple/50 transition-all hover:shadow-lg hover:-translate-y-1 block relative">
                        {/* Audience Badge */}
                        <div className="absolute top-3 right-3 z-10">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase shadow-sm ${course.audience === 'kids' ? 'bg-white text-purple-600' : 'bg-brand-purple text-white'}`}>
                                {course.audience === 'kids' ? '👶 Kids' : course.audience === 'all' ? '🌍 Tous' : '👨‍👩‍👧 Adultes'}
                            </span>
                        </div>

                        <div className="p-6">
                            <h3 className="text-xl font-bold text-brand-text mb-2 line-clamp-1">{course.title}</h3>
                            <p className="text-brand-text-muted text-sm line-clamp-2 mb-4 h-10">{course.description}</p>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-brand-border text-xs text-brand-text-muted">
                                <span>Gérer le contenu →</span>
                                <Edit className="w-4 h-4 group-hover:text-brand-purple transition-colors" />
                            </div>
                        </div>
                    </Link>
                ))}

                {(!courses || courses.length === 0) && (
                    <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-xl text-gray-500">
                        Aucun cours trouvé pour ce filtre.
                    </div>
                )}
            </div>
        </div>
    );
}
