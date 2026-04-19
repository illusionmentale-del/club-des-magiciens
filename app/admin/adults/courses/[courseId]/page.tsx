import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Settings } from "lucide-react";
import CourseContentManager from "./CourseContentManager";

interface CourseManagerProps {
    params: Promise<{ courseId: string }>;
}

export default async function AdminCourseManager(props: CourseManagerProps) {
    const params = await props.params;
    const supabase = await createClient();

    // Fetch Course
    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", params.courseId)
        .single();

    if (!course) {
        notFound();
    }

    // Fetch Videos
    const { data: videos } = await supabase
        .from("videos")
        .select("*")
        .eq("course_id", course.id)
        .order("position", { ascending: true });

    return (
        <div className="space-y-8 selection:bg-brand-royal/30">
            {/* Header */}
            <div>
                <Link href="/admin/adults/settings/masterclass" className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-brand-royal transition-colors mb-6">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour au constructeur du Hub
                </Link>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-brand-royal/10 rounded-2xl flex items-center justify-center border border-brand-royal/30 shadow-lg shadow-brand-royal/10">
                            <BookOpen className="w-8 h-8 text-brand-royal" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
                                {course.title}
                            </h1>
                            <p className="text-brand-text-muted text-xs uppercase tracking-widest font-bold mt-1">Gestionnaire de Contenu</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Meta Info */}
            <div className="bg-black/20 p-6 rounded-2xl border border-white/5 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                    <Settings className="w-4 h-4 text-brand-text-muted" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-brand-text-muted">Informations Système</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-white/5 p-4 rounded-xl">
                    <div>
                        <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">ID Formation</span>
                        <code className="text-xs text-brand-royal">{course.id}</code>
                    </div>
                    <div>
                        <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Audience</span>
                        <span className="text-white capitalize">{course.audience}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Statut BDD</span>
                        <span className="text-white capitalize">{course.status}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] uppercase text-gray-500 font-bold mb-1">Nb de vidéos actuelles</span>
                        <span className="text-white font-bold">{videos?.length || 0}</span>
                    </div>
                </div>
            </div>

            {/* The Video Manager UI */}
            <CourseContentManager courseId={course.id} initialVideos={videos || []} />
            
        </div>
    );
}
