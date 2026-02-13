import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlayCircle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import CommentsSection from "@/components/Comments";

interface WatchPageProps {
    params: Promise<{ courseId: string }>;
    searchParams: Promise<{ v?: string }>;
}

export default async function WatchPage(props: WatchPageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch course details
    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", params.courseId)
        .single();

    if (!course) {
        notFound();
    }

    // Fetch videos for this course
    const { data: videos } = await supabase
        .from("videos")
        .select("*")
        .eq("course_id", course.id)
        .order("position", { ascending: true });

    // Fetch comments
    const { data: comments } = await supabase
        .from("comments")
        .select(`
            *,
            profiles (username, magic_level)
        `)
        .eq("course_id", course.id)
        .order("created_at", { ascending: false });

    // Determine current video
    const currentVideoId = searchParams.v;
    const currentVideo = currentVideoId
        ? videos?.find(v => v.id === currentVideoId)
        : videos?.[0];

    return (
        <div className="min-h-screen bg-magic-bg text-white flex flex-col">
            {/* Header */}
            <header className="border-b border-white/10 bg-magic-card/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Retour au tableau de bord</span>
                    </Link>
                    <h1 className="text-lg font-serif text-magic-gold truncate max-w-md hidden md:block">
                        {course.title}
                    </h1>
                    <div className="w-8"></div> {/* Spacer for alignment */}
                </div>
            </header>

            <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Area (Player) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group">
                        {currentVideo ? (
                            <>
                                {/^\d+$/.test(currentVideo.video_url) ? (
                                    // Vimeo Player (IDs are numbers)
                                    <iframe
                                        src={`https://player.vimeo.com/video/${currentVideo.video_url}?h=0&title=0&byline=0&portrait=0`}
                                        className="absolute inset-0 w-full h-full"
                                        frameBorder="0"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    // YouTube Player (IDs are alphanumeric, usually 11 chars)
                                    <iframe
                                        src={`https://www.youtube-nocookie.com/embed/${currentVideo.video_url}?rel=0&modestbranding=1`}
                                        className="absolute inset-0 w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                Select a video to start watching
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-3xl font-serif text-white">{currentVideo?.title}</h2>
                        <div className="prose prose-invert max-w-none text-gray-400">
                            <p>{currentVideo?.description}</p>
                        </div>
                    </div>

                    {/* Comments Section */}
                    {comments && <CommentsSection courseId={course.id} comments={comments} userId={user.id} />}
                </div>

                {/* Sidebar (Playlist) */}
                <div className="space-y-6">
                    <div className="bg-magic-card border border-white/5 rounded-xl p-6 lg:sticky lg:top-24">
                        <h3 className="font-serif text-xl mb-4 text-white/90">Programme du cours</h3>
                        <div className="space-y-1">
                            {videos?.map((video, index) => {
                                const isActive = video.id === currentVideo?.id;
                                return (
                                    <Link
                                        key={video.id}
                                        href={`/watch/${course.id}?v=${video.id}`}
                                        className={cn(
                                            "flex items-start gap-3 p-3 rounded-lg transition-all group",
                                            isActive
                                                ? "bg-magic-purple/20 border border-magic-purple/50"
                                                : "hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <div className={cn(
                                            "mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0",
                                            isActive ? "bg-magic-purple text-white" : "bg-white/10 text-gray-400 group-hover:bg-white/20"
                                        )}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm font-medium leading-tight",
                                                isActive ? "text-white" : "text-gray-300"
                                            )}>
                                                {video.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {Math.floor(video.duration / 60)} min
                                            </p>
                                        </div>
                                        {isActive && <PlayCircle className="w-4 h-4 text-magic-purple shrink-0 self-center" />}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
