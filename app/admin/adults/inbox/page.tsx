import { createClient } from "@/lib/supabase/server";
import { MessageCircle, Search, Calendar, Video, Clock, CheckCircle } from "lucide-react";
import InboxReplyForm from "@/components/admin/InboxReplyForm";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminAdultsInbox({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const supabase = await createClient();

    const resolvedParams = await searchParams;
    const currentTab = resolvedParams?.tab === 'read' ? 'read' : 'unread';

    // 1. Fetch unread or read adult questions
    const { data: rawComments, error: commentsError } = await supabase
        .from("course_comments")
        .select("id, content, course_id, created_at, user_id, is_read")
        .eq("is_read", currentTab === 'read')
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
                        <MessageCircle className="w-8 h-8 text-white" />
                        Inbox Adultes
                    </h1>
                    <p className="text-gray-400 mt-2">Gérez les questions et commentaires des étudiants premium.</p>
                </div>
                <div className="bg-[#1c1c1e] border border-white/5 px-6 py-3 rounded-[24px] flex items-center gap-3 shadow-md">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="font-bold text-white tracking-widest uppercase">{currentTab === 'unread' ? comments.length : 'Archives'} Messages</span>
                </div>
            </header>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <Link href="/admin/kids/inbox" className="px-4 py-2 border border-white/10 text-gray-400 hover:text-white rounded-lg transition-colors text-sm uppercase font-bold tracking-wider">
                    &larr; Basculer vers Inbox Kids
                </Link>

                {/* Toggle Tabs */}
                <div className="flex items-center gap-2 p-1 bg-black/40 rounded-xl w-fit border border-white/5 shadow-inner">
                    <Link
                        href="/admin/adults/inbox?tab=unread"
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all",
                            currentTab === 'unread'
                                ? "bg-[#f5f5f7] text-[#1c1c1e] shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <Clock className="w-4 h-4" />
                        À Traiter
                    </Link>
                    <Link
                        href="/admin/adults/inbox?tab=read"
                        className={cn(
                            "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-widest transition-all",
                            currentTab === 'read'
                                ? "bg-[#f5f5f7] text-[#1c1c1e] shadow-lg"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                        )}
                    >
                        <CheckCircle className="w-4 h-4" />
                        Traitées
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {comments.length === 0 ? (
                    <div className="bg-[#1c1c1e] border border-white/5 rounded-[32px] p-12 text-center text-gray-500 flex flex-col items-center">
                        <MessageCircle className="w-16 h-16 text-white/5 mb-4" />
                        <p className="text-xl font-medium text-white mb-2">Inbox Vide</p>
                        <p>Aucun nouveau message d'adulte pour le moment. Beau travail !</p>
                    </div>
                ) : (
                    comments.map((comment) => {
                        const profile = Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles;
                        const course = sourceCourses.find(c => c.id === comment.course_id);

                        return (
                            <div key={comment.id} className="bg-[#1c1c1e] border border-white/5 rounded-[24px] p-6 relative overflow-hidden group hover:border-white/10 transition-colors">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#f5f5f7]"></div>

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
                                                        <a href={`/watch/${course.id}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors truncate max-w-[200px]" title={course.title}>
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
                                    <div className="lg:w-96 shrink-0 bg-black/30 rounded-xl p-4 border border-white/5 flex flex-col justify-end space-y-4">
                                        {currentTab === 'read' ? (
                                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-2 flex items-center justify-center gap-2 text-green-400 text-xs font-bold uppercase tracking-widest mb-2">
                                                <CheckCircle className="w-4 h-4" />
                                                Message déjà traité
                                            </div>
                                        ) : (
                                            <h4 className="font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">Réponse Administrateur</h4>
                                        )}
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
