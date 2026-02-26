import { createClient } from "@/lib/supabase/server";
import { MessageCircle, Search, Calendar, Video } from "lucide-react";
import InboxReplyForm from "@/components/admin/InboxReplyForm";
import Link from "next/link";

export default async function AdminAdultsInbox() {
    const supabase = await createClient();

    // 1. Fetch unread adult questions
    const { data: rawComments, error: commentsError } = await supabase
        .from("course_comments")
        .select("id, content, course_id, created_at, user_id")
        .eq("is_read", false)
        .eq("context", "adults")
        .order("created_at", { ascending: false });

    if (commentsError) {
        console.error("Error fetching admin inbox comments:", commentsError);
    }

    let typedComments: any[] = [];

    if (rawComments && rawComments.length > 0) {
        const userIds = [...new Set(rawComments.map(c => c.user_id))];
        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name, username, role, email")
            .in("id", userIds);

        typedComments = rawComments.map(c => ({
            ...c,
            profiles: profiles?.find(p => p.id === c.user_id) || null
        }));
    }

    // Filter out Jérémy's own test replies just in case they slipped as unread
    const comments = typedComments.filter(c => {
        const p = Array.isArray(c.profiles) ? c.profiles[0] : c.profiles;
        return p?.role !== 'admin' && !p?.email?.includes('admin@');
    });

    // 2. Fetch video contexts (courses) to know where the question was asked
    const courseIds = [...new Set(comments.map(c => c.course_id))];

    let sourceCourses: any[] = [];
    if (courseIds.length > 0) {
        const { data: coursesData } = await supabase
            .from("courses")
            .select("id, title")
            .in("id", courseIds);

        sourceCourses = coursesData || [];
    }

    return (
        <div className="p-4 md:p-8 space-y-8 bg-[#050507] min-h-screen text-white">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <MessageCircle className="w-8 h-8 text-magic-gold" />
                        Inbox Adultes
                    </h1>
                    <p className="text-gray-400 mt-2">Gérez les questions et commentaires des étudiants premium.</p>
                </div>
                <div className="bg-magic-card border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-[0_0_30px_rgba(238,195,67,0.1)]">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="font-bold text-white tracking-widest uppercase">{comments.length} Messages Non-lus</span>
                </div>
            </header>

            <div className="flex gap-4 mb-4">
                <Link href="/admin/kids/inbox" className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white rounded-lg transition-colors text-sm uppercase font-bold tracking-wider">
                    &larr; Basculer vers Inbox Kids
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {comments.length === 0 ? (
                    <div className="bg-magic-card border border-white/10 rounded-3xl p-12 text-center text-gray-500 flex flex-col items-center">
                        <MessageCircle className="w-16 h-16 text-white/5 mb-4" />
                        <p className="text-xl font-medium text-white mb-2">Inbox Vide</p>
                        <p>Aucun nouveau message d'adulte pour le moment. Beau travail !</p>
                    </div>
                ) : (
                    comments.map((comment) => {
                        const profile = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
                        const course = sourceCourses.find(c => c.id === comment.course_id);

                        return (
                            <div key={comment.id} className="bg-magic-card border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-magic-gold/30 transition-colors">
                                <div className="absolute top-0 left-0 w-1 h-full bg-magic-gold"></div>

                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Left: Comment Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                                    {profile?.full_name || profile?.username || "Élève Inconnu"}
                                                    <span className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                                                        {profile?.email}
                                                    </span>
                                                </h3>
                                                <div className="flex items-center gap-4 text-xs text-gray-400 mt-2 font-mono uppercase">
                                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(comment.created_at).toLocaleString('fr-FR')}</span>
                                                    {course && (
                                                        <a href={`/watch/${course.id}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-magic-gold transition-colors truncate max-w-[200px]" title={course.title}>
                                                            <Video className="w-3 h-3" /> {course.title}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-gray-200">
                                            "{comment.content}"
                                        </div>
                                    </div>

                                    {/* Right: Reply Area */}
                                    <div className="lg:w-96 shrink-0 bg-black/30 rounded-xl p-4 border border-white/5">
                                        <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">Réponse Administrateur</h4>
                                        <InboxReplyForm
                                            commentId={comment.id}
                                            targetUserId={profile?.id}
                                            courseId={comment.course_id}
                                            context="adults"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
