import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookOpen, Search, ShoppingBag } from "lucide-react";
import GrimoireCard from "@/components/GrimoireCard";

export default async function KidsCoursesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: rawCourses } = await supabase
        .from("courses")
        .select("*")
        .in('audience', ['kids', 'all'])
        .order("created_at", { ascending: false });

    const coursesWithStats = await Promise.all((rawCourses || []).map(async (course) => {
        const { count: likesCount } = await supabase.from("course_likes").select("*", { count: 'exact', head: true }).eq("course_id", course.id).eq("is_like", true);
        const { count: dislikesCount } = await supabase.from("course_likes").select("*", { count: 'exact', head: true }).eq("course_id", course.id).eq("is_like", false);
        const { data: myVote } = await supabase.from("course_likes").select("is_like").eq("course_id", course.id).eq("user_id", user.id).single();

        return {
            ...course,
            likes: likesCount || 0,
            dislikes: dislikesCount || 0,
            myVote: myVote?.is_like ?? null
        };
    }));

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans selection:bg-brand-purple/30 overflow-hidden relative">

            {/* Ambient Background Lights */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[50%] bg-brand-purple/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Header / Hero - Geometric & Premium */}
            <header className="mb-16 max-w-7xl mx-auto relative z-10 pt-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-1 bg-brand-purple"></div>
                            <span className="text-brand-purple text-xs font-bold tracking-[0.2em] uppercase">Accès Exclusif</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-brand-text uppercase tracking-tight leading-none mb-4">
                            Zone Bonus
                        </h1>
                        <div className="flex flex-col gap-4">
                            <p className="text-xl text-brand-text-muted font-light flex items-center gap-2">
                                <span className="text-brand-text font-bold">{coursesWithStats?.length || 0}</span> coffrets magiques disponibles.
                            </p>

                            {/* Explanatory Banner */}
                            <div className="bg-brand-purple/10 border border-brand-purple/20 rounded-xl p-4 flex items-start gap-3 max-w-xl">
                                <div className="p-2 bg-brand-purple/20 rounded-lg shrink-0">
                                    <ShoppingBag className="w-5 h-5 text-brand-purple" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-brand-text uppercase tracking-wide mb-1">Packs Spéciaux</h3>
                                    <p className="text-xs text-brand-text-muted leading-relaxed">
                                        Ici, tu peux débloquer des <strong>coffrets secrets complets</strong> pour aller encore plus loin !
                                        Ces bonus contiennent des tours inédits qui ne sont pas dans tes défis hebdomadaires.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Search Widget - Decorative for now */}
                        <div className="hidden md:flex items-center gap-3 px-4 py-3 bg-brand-card border border-brand-border rounded-full">
                            <Search className="w-4 h-4 text-brand-text-muted" />
                            <span className="text-xs text-brand-text-muted font-mono tracking-widest uppercase">Rechercher...</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto relative z-10">
                {(!coursesWithStats || coursesWithStats.length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-brand-border bg-brand-card/50 rounded-3xl">
                        <div className="w-32 h-32 bg-brand-card border border-brand-border rounded-full flex items-center justify-center mb-8 relative group">
                            <div className="absolute inset-0 bg-brand-purple/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                            <BookOpen className="w-12 h-12 text-brand-text-muted group-hover:text-brand-purple transition-colors" />
                        </div>
                        <h3 className="text-3xl font-bold text-brand-text mb-2 uppercase tracking-widest">Base Vide</h3>
                        <p className="text-brand-text-muted font-mono text-sm uppercase tracking-wider">Aucune donnée secrète trouvée pour le moment.</p>
                        <p className="text-brand-purple/50 text-[10px] mt-4 font-mono">// WAITING_FOR_INPUT //</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {coursesWithStats.map((course, index) => (
                            <GrimoireCard key={course.id} course={course} index={index} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
