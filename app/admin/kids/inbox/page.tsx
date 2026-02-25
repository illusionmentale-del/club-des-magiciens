import { createClient } from "@/lib/supabase/server";
import { MessageCircle, Search, Calendar, Video } from "lucide-react";
import InboxReplyForm from "@/components/admin/InboxReplyForm";

export default async function AdminKidsInbox() {
    const supabase = await createClient();

    // 1. Fetch unread questions
    // Since the foreign key relationship might be missing in the schema cache,
    // we fetch comments first, then manually join profiles.
    const { data: rawComments, error: commentsError } = await supabase
        .from("course_comments")
        .select("id, content, course_id, created_at, user_id")
        .eq("is_read", false)
        .order("created_at", { ascending: false });

    if (commentsError) {
        console.error("Error fetching admin inbox comments:", commentsError);
    }

    let typedComments: any[] = [];

    if (rawComments && rawComments.length > 0) {
        const userIds = [...new Set(rawComments.map(c => c.user_id))];
        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, full_name, role, email")
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

    // 2. Fetch video contexts (library_items) to know where the question was asked
    // We get all unique course_ids
    const courseIds = [...new Set(comments.map(c => c.course_id))];

    let libraryItems: any[] = [];
    if (courseIds.length > 0) {
        // Here we assume course_id in Kids space is either the library_item.id or library_item.video_url
        // Based on page.tsx, the kids video page uses `params.videoId` which is libraryItem.video_url (Bunny GUID)
        const courseIdsString = `(${courseIds.join(',')})`;

        const { data: items } = await supabase
            .from("library_items")
            .select("id, title, video_url")
            // Check if courseId matches either the Bunny GUID (video_url) or the UUID (id)
            .or(`id.in.${courseIdsString},video_url.in.${courseIdsString}`);

        libraryItems = items || [];
    }

    const getVideoTitle = (courseId: string) => {
        const item = libraryItems.find(i => i.video_url === courseId || i.id === courseId);
        return item ? item.title : 'Vidéo Inconnue';
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                        <MessageCircle className="w-8 h-8 text-brand-purple" />
                        Boîte de Réception
                    </h1>
                    <p className="text-brand-text-muted mt-2">
                        Questions en attente des apprentis magiciens ({comments.length})
                    </p>
                </div>
            </div>

            {comments.length === 0 ? (
                <div className="bg-brand-card/50 border border-white/5 rounded-3xl p-16 text-center shadow-lg">
                    <div className="w-20 h-20 bg-brand-purple/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <span className="text-4xl">🕊️</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Tout est calme !</h3>
                    <p className="text-brand-text-muted">Aucune question en attente de réponse. Bon travail !</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="bg-brand-card/80 border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                {/* Left Side: Question Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-xl shadow-inner border border-white/5">
                                                🕵️‍♂️
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">
                                                    {comment.profiles?.full_name || 'Apprenti(e)'}
                                                </h4>
                                                <span className="text-xs text-brand-text-muted block">{comment.profiles?.email}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs font-bold text-gray-500 bg-black/30 px-2 py-1 rounded-md flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs font-bold text-brand-cyan bg-brand-cyan/10 px-2 py-1 rounded-md flex items-center gap-1 line-clamp-1 max-w-[200px]">
                                                <Video className="w-3 h-3 shrink-0" />
                                                {getVideoTitle(comment.course_id)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-white/5 border border-white/5 rounded-xl p-4 text-gray-200 leading-relaxed text-sm">
                                        <p className="font-medium text-brand-purple/80 text-xs uppercase tracking-widest mb-2 font-mono">"Un Petit Magicien a demandé :"</p>
                                        {comment.content}
                                    </div>
                                </div>

                                {/* Right Side: Interaction / Reply */}
                                <div className="w-full md:w-[500px] shrink-0">
                                    <InboxReplyForm
                                        commentId={comment.id}
                                        courseId={comment.course_id}
                                        kidPseudo={comment.profiles?.full_name || 'cet apprenti'}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
