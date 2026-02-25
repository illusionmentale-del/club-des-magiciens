import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlayCircle, Lock, CheckCircle, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import CommentsSection from "@/components/Comments";
import VideoPlayerControls from "@/components/VideoPlayerControls";

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

    // 1. Try Fetching Course (Adults)
    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", params.courseId)
        .single();

    // 2. If no course, try Fetching Library Item (Kids)
    let libraryItem = null;
    if (!course) {
        const { data: item } = await supabase
            .from("library_items")
            .select("*")
            .eq("id", params.courseId)
            .single();
        libraryItem = item;
    }

    if (!course && !libraryItem) {
        notFound();
    }

    // --- CASE A: LIBRARY ITEM (KIDS) ---
    if (libraryItem) {
        // Check Validation Status
        const { data: progress } = await supabase
            .from("library_progress")
            .select("*")
            .eq("user_id", user.id)
            .eq("item_id", libraryItem.id)
            .single();
        const isValidated = !!progress;

        return (
            <div className="min-h-screen bg-magic-bg text-white flex flex-col font-sans">
                <header className="border-b border-white/10 bg-magic-card/50 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                        <Link href="/kids" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-bold uppercase tracking-wider text-xs">Retour au Club</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-[10px] font-bold uppercase tracking-widest border border-purple-500/30">
                                Semaine {libraryItem.week_number}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8">
                    {/* Video Player */}
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
                        {libraryItem.video_url ? (
                            <>
                                {/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(libraryItem.video_url) ? (
                                    // Bunny Stream Player (IDs are GUIDs)
                                    <iframe
                                        src={`https://iframe.mediadelivery.net/embed/${process.env.BUNNY_KIDS_LIBRARY_ID}/${libraryItem.video_url}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`}
                                        className="absolute inset-0 w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                        allowFullScreen
                                    ></iframe>
                                ) : /^\d+$/.test(libraryItem.video_url) ? (
                                    // Vimeo Player (IDs are numbers)
                                    <iframe
                                        src={`https://player.vimeo.com/video/${libraryItem.video_url}?h=0&title=0&byline=0&portrait=0`}
                                        className="absolute inset-0 w-full h-full"
                                        frameBorder="0"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    // YouTube Player
                                    <iframe
                                        src={`https://www.youtube-nocookie.com/embed/${libraryItem.video_url}?rel=0&modestbranding=1`}
                                        className="absolute inset-0 w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                <p>Pas de vidéo pour cet atelier.</p>
                            </div>
                        )}
                    </div>

                    {/* Content & Validation */}
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="flex-1 space-y-4">
                            <h1 className="text-3xl md:text-4xl font-black text-white">{libraryItem.title}</h1>
                            <div className="prose prose-invert prose-p:text-gray-300 max-w-none">
                                <p>{libraryItem.description}</p>
                            </div>
                        </div>

                        {/* Validation Card */}
                        <div className="w-full md:w-72 shrink-0">
                            <div className="bg-magic-card border border-white/10 rounded-2xl p-6 sticky top-24 space-y-6 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-orange-500/20">
                                    <Trophy className="w-8 h-8 text-black" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white uppercase tracking-tight mb-1">Mission Magique</h3>
                                    <p className="text-xs text-gray-400">Valide cet atelier pour gagner de l'XP et débloquer des badges !</p>
                                </div>

                                {isValidated ? (
                                    <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex flex-col items-center gap-2 animate-in zoom-in duration-300">
                                        <CheckCircle className="w-8 h-8 text-green-500" />
                                        <span className="font-bold text-green-400 uppercase tracking-widest text-sm">Atelier Validé !</span>
                                    </div>
                                ) : (
                                    <form action={async () => {
                                        "use server";
                                        const supabase = await createClient();
                                        const { data: { user } } = await supabase.auth.getUser();
                                        if (!user) return;
                                        await supabase.from("library_progress").insert({
                                            user_id: user.id,
                                            item_id: libraryItem.id
                                        });
                                        // TODO: Check for badges logic here if needed, or DB Trigger
                                        redirect(`/watch/${libraryItem.id}`);
                                    }}>
                                        <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-purple-500/30 active:scale-95 flex items-center justify-center gap-2 group">
                                            <Star className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                            JE VALIDE !
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // --- CASE B: COURSE (ADULTS) - EXISTING LOGIC ---

    // Fetch videos for this course
    const { data: videos } = await supabase
        .from("videos")
        .select("*")
        .eq("course_id", course.id)
        .order("position", { ascending: true });

    // Fetch comments
    const { data: comments } = await supabase
        .from("course_comments")
        .select(`
            *,
            profiles (username, magic_level, avatar_url, avatar_url_kids)
        `)
        .eq("course_id", course.id)
        .order("created_at", { ascending: false });

    // Fetch progress
    const { data: progressData } = await supabase
        .from("user_progress")
        .select("video_id, is_completed")
        .eq("user_id", user.id)
        .eq("course_id", course.id);

    const completedVideoIds = new Set(progressData?.map(p => p.video_id) || []);
    const progressPercentage = videos && videos.length > 0
        ? Math.round((completedVideoIds.size / videos.length) * 100)
        : 0;

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
                                {/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentVideo.video_url) ? (
                                    // Bunny Stream Player (IDs are GUIDs)
                                    <iframe
                                        src={`https://iframe.mediadelivery.net/embed/${process.env.BUNNY_ADULTS_LIBRARY_ID}/${currentVideo.video_url}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`}
                                        className="absolute inset-0 w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                                        allowFullScreen
                                    ></iframe>
                                ) : /^\d+$/.test(currentVideo.video_url) ? (
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

                    {currentVideo && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <h2 className="text-3xl font-serif text-white">{currentVideo.title}</h2>
                            </div>

                            <VideoPlayerControls
                                videoId={currentVideo.id}
                                courseId={course.id}
                                isCompleted={completedVideoIds.has(currentVideo.id)}
                            />

                            <div className="prose prose-invert max-w-none text-gray-400">
                                <p>{currentVideo.description}</p>
                            </div>
                        </div>
                    )}

                    {/* Comments Section */}
                    {comments && <CommentsSection courseId={course.id} comments={comments} user={user} />}
                </div>

                {/* Sidebar (Playlist) */}
                <div className="space-y-6">
                    <div className="bg-magic-card border border-white/5 rounded-xl p-6 lg:sticky lg:top-24">
                        <div className="mb-6">
                            <h3 className="font-serif text-xl mb-2 text-white/90">Programme du cours</h3>
                            {/* Progress Bar */}
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                                <span>Progression</span>
                                <span>{progressPercentage}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-magic-purple transition-all duration-500"
                                    style={{ width: `${progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-2 customized-scrollbar">
                            {videos?.map((video, index) => {
                                const isActive = video.id === currentVideo?.id;
                                const isCompleted = completedVideoIds.has(video.id);

                                return (
                                    <Link
                                        key={video.id}
                                        href={`/watch/${course.id}?v=${video.id}`}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg transition-all group relative",
                                            isActive
                                                ? "bg-magic-purple/20 border border-magic-purple/50"
                                                : "hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <div className="relative shrink-0">
                                            <div className={cn(
                                                "w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors",
                                                isCompleted
                                                    ? "bg-green-500 text-white"
                                                    : isActive
                                                        ? "bg-magic-purple text-white"
                                                        : "bg-white/10 text-gray-400 group-hover:bg-white/20"
                                            )}>
                                                {isCompleted ? (
                                                    <CheckCircle className="w-3.5 h-3.5" />
                                                ) : (
                                                    index + 1
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm font-medium leading-tight line-clamp-2",
                                                isActive ? "text-white" : "text-gray-300",
                                                isCompleted && !isActive && "text-gray-400"
                                            )}>
                                                {video.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {Math.floor(video.duration / 60)} min
                                            </p>
                                        </div>

                                        {isActive && !isCompleted && <PlayCircle className="w-4 h-4 text-magic-purple shrink-0" />}
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
