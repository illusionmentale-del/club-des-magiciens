import { createClient } from "@/lib/supabase/server";
import { getSecureBunnyIframeUrl } from "@/lib/bunny";
import { redirect, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, PlayCircle, Lock, CheckCircle, Trophy, Star, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import AdultComments from "@/components/adults/AdultComments";
import VideoPlayerControls from "@/components/VideoPlayerControls";
import KidsCommentsSection from "@/components/KidsComments";
import KidsValidateButton from "@/components/kids/KidsValidateButton";

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

    // 2. If no course, try Fetching Library Item (Kids or Adults)
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

    // 3. Early profile check for admin rights & draft protection
    const { data: profile } = await supabase
        .from("profiles")
        .select("role, created_at, has_kids_access, has_adults_access")
        .eq("id", user.id)
        .single();
    const isAdmin = profile?.role === 'admin' || (user.email?.includes('admin@') ?? false);

    // 4. Content Access Authorization Checks (SECURITY)
    if (!isAdmin) {
        // --- 4A: DRAFT / SCHEDULED PROTECTION ---
        if (course) {
            if (course.status === 'draft') notFound();
            if (course.status === 'scheduled' && course.published_at && new Date(course.published_at) > new Date()) notFound();
        }

        // Fetch User Purchases
        const { data: userPurchases } = await supabase
            .from("user_purchases")
            .select("library_item_id, course_id")
            .eq("user_id", user.id);

        // --- 4B: LIBRARY ITEM AUTHORIZATION ---
        if (libraryItem) {
            const isPurchased = userPurchases?.some(p => p.library_item_id === libraryItem.id);
            if (!isPurchased) {
                // If it's a stand-alone shippable item, it requires an explicit purchase
                if (libraryItem.sales_page_url) {
                    redirect(libraryItem.audience === 'adults' ? '/dashboard/shop' : '/kids/shop');
                }

                // It's a drip feed item. Verify platform subscription access
                if (libraryItem.audience === 'adults' && !profile?.has_adults_access) redirect('/tarifs/adults');
                // Kids platform also has a Trial concept which we check inside middleware, but here we require has_kids_access or active session
                
                // Verify Drip Schedule Unlock
                if (profile && profile.created_at) {
                    const diffDays = Math.ceil(Math.abs(new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24));
                    const currentWeek = Math.floor(diffDays / 7) + (libraryItem.audience === 'kids' ? 5 : 1);
                    
                    if (libraryItem.week_number && libraryItem.week_number > currentWeek) {
                        redirect(libraryItem.audience === 'kids' ? '/kids/program' : '/dashboard/library');
                    }
                }
            }
        } 
        
        // --- 4C: COURSE AUTHORIZATION ---
        else if (course) {
            const isPurchased = userPurchases?.some(p => p.course_id === course.id);
            if (!isPurchased) {
                 if (course.audience === 'adults' && !profile?.has_adults_access) redirect('/tarifs/adults');
                 // For now, if course is part of the core program, access is granted.
            }
        }
    }

    // --- CASE A: LIBRARY ITEM ---
    if (libraryItem) {
        const isKidsItem = libraryItem.audience === 'kids';
        // Check Validation Status
        const { data: progress } = await supabase
            .from("library_progress")
            .select("*")
            .eq("user_id", user.id)
            .eq("item_id", libraryItem.id)
            .single();
        const isValidated = !!progress;

        // Fetch Comments for this Library Item manually to avoid PGRST200 error
        const { data: rawComments } = await supabase
            .from("course_comments")
            .select("*")
            .eq("course_id", libraryItem.id)
            .eq("context", libraryItem.audience)
            .order("created_at", { ascending: true });

        let comments: any[] = [];
        if (rawComments && rawComments.length > 0) {
            const userIds = [...new Set(rawComments.map(c => c.user_id))];
            const { data: profiles } = await supabase
                .from("profiles")
                .select("id, full_name, role, email")
                .in("id", userIds);

            comments = rawComments.map(c => ({
                ...c,
                profiles: profiles?.find(p => p.id === c.user_id) || null
            }));
        }

        // (Admin check already done above)

        // Mark any pending notifications as read for this kid on this video
        if (!isAdmin) {
            await supabase
                .from("course_comments")
                .update({ kid_notified: true })
                .eq("course_id", libraryItem.id)
                .eq("target_user_id", user.id)
                .eq("kid_notified", false);
        }

        // Generate Secure Iframe URL if it's a Bunny video (GUID format)
        let secureLibraryIframeUrl = "";
        if (libraryItem.video_url && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(libraryItem.video_url)) {
            secureLibraryIframeUrl = await getSecureBunnyIframeUrl(
                isKidsItem ? process.env.BUNNY_KIDS_LIBRARY_ID || "" : process.env.BUNNY_ADULTS_LIBRARY_ID || "",
                libraryItem.video_url,
                isKidsItem
            );
        }

        return (
            <div className={cn(
                "min-h-screen text-white flex flex-col font-sans relative",
                isKidsItem ? "bg-magic-bg" : "bg-[#050507]"
            )}>
                {/* Ambient Background Lights if Adult */}
                {!isKidsItem && (
                    <>
                        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-magic-royal/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
                        <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
                    </>
                )}
                <header className="border-b border-white/10 bg-magic-card/50 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                        <Link href={isKidsItem ? "/kids/program" : "/dashboard"} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-bold uppercase tracking-wider text-xs">{isKidsItem ? "Retour à la Formation" : "Retour au QG"}</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                                isKidsItem ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-magic-royal/20 text-magic-royal border-magic-royal/30"
                            )}>
                                Semaine {libraryItem.week_number}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 space-y-8">
                    {/* Video Player */}
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group z-10">
                        {libraryItem.video_url ? (
                            <>
                                {/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(libraryItem.video_url) || libraryItem.video_url?.includes('mediadelivery.net') || libraryItem.video_url?.includes('bunny') ? (
                                    // Bunny Stream Player (IDs are GUIDs or urls)
                                    <iframe
                                        src={secureLibraryIframeUrl}
                                        className="absolute inset-0 w-full h-full pointer-events-auto"
                                        frameBorder="0"
                                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"
                                        allowFullScreen
                                    ></iframe>
                                ) : /^\d+$/.test(libraryItem.video_url) ? (
                                    // Vimeo Player (IDs are numbers)
                                    <iframe
                                        src={`https://player.vimeo.com/video/${libraryItem.video_url}?h=0&title=0&byline=0&portrait=0&playsinline=1&autopause=0`}
                                        className="absolute inset-0 w-full h-full pointer-events-auto"
                                        frameBorder="0"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    // YouTube Player
                                    <iframe
                                        src={`https://www.youtube-nocookie.com/embed/${libraryItem.video_url}?rel=0&modestbranding=1&playsinline=1`}
                                        className="absolute inset-0 w-full h-full pointer-events-auto"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </>
                        ) : libraryItem.thumbnail_url ? (
                            <Image
                                src={libraryItem.thumbnail_url}
                                alt={libraryItem.title}
                                fill
                                className="object-cover"
                            />
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
                            <div className="text-base md:text-lg text-gray-300 leading-relaxed md:leading-loose font-light whitespace-pre-wrap tracking-wide max-w-none">
                                {libraryItem.description}
                            </div>
                            
                            {/* Resource Download Button */}
                            {libraryItem.resource_url && (
                                <div className="pt-4">
                                    <a 
                                        href={libraryItem.resource_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={cn(
                                            "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg active:scale-95",
                                            isKidsItem 
                                                ? "bg-brand-purple hover:bg-brand-purple/80 text-white shadow-brand-purple/20" 
                                                : "bg-magic-card border border-white/10 hover:border-magic-royal hover:bg-white/5 text-magic-royal shadow-black/50"
                                        )}
                                    >
                                        <Download className="w-4 h-4" />
                                        Télécharger le PDF
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Validation Card */}
                        <div className="w-full md:w-72 shrink-0">
                            <div className="bg-magic-card border border-white/10 rounded-2xl p-6 sticky top-24 space-y-6 text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-700 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-blue-700/20">
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
                                ) : isKidsItem ? (
                                    <KidsValidateButton libraryItemId={libraryItem.id} />
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
                                        redirect(`/watch/${libraryItem.id}`);
                                    }}>
                                        <button className="w-full font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group bg-gradient-to-r from-magic-royal to-blue-700 text-black hover:from-blue-400 hover:to-blue-500 hover:shadow-magic-royal/30">
                                            <Star className="w-5 h-5 group-hover:rotate-12 transition-transform text-black" />
                                            JE VALIDE !
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    {isKidsItem ? (
                        <KidsCommentsSection
                            videoId={libraryItem.id}
                            comments={comments || []}
                            isAdmin={isAdmin}
                        />
                    ) : (
                        <AdultComments courseId={libraryItem.id} comments={comments} user={user} />
                    )}
                </div>
            </div>
        )
    }

    // --- CASE B: COURSE (ADULTS & KIDS BONUS) ---
    const isKidsCourse = course.audience === "kids";

    // Fetch videos for this course
    const { data: videos } = await supabase
        .from("videos")
        .select("*")
        .eq("course_id", course.id)
        .order("position", { ascending: true });

    // Fetch comments manually to avoid PGRST200
    const { data: rawComments } = await supabase
        .from("course_comments")
        .select("*")
        .eq("course_id", course.id)
        .eq("context", isKidsCourse ? "kids" : "adults")
        .order("created_at", { ascending: true });

    let comments: any[] = [];
    if (rawComments && rawComments.length > 0) {
        const userIds = [...new Set(rawComments.map(c => c.user_id))];
        const { data: profiles } = await supabase
            .from("profiles")
            .select("id, username, full_name, magic_level, avatar_url, avatar_url_kids")
            .in("id", userIds);

        comments = rawComments.map(c => ({
            ...c,
            profiles: profiles?.find(p => p.id === c.user_id) || null
        }));
    }

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

    // Determine Admin status for Case B Comments (Already done above)

    // Generate Secure Iframe URL for the current course video if it's a Bunny video
    let secureCourseIframeUrl = "";
    if (currentVideo && currentVideo.video_url && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentVideo.video_url)) {
        secureCourseIframeUrl = await getSecureBunnyIframeUrl(
            isKidsCourse ? process.env.BUNNY_KIDS_LIBRARY_ID || "" : process.env.BUNNY_ADULTS_LIBRARY_ID || "",
            currentVideo.video_url,
            isKidsCourse
        );
    }

    return (
        <div className={cn(
            "min-h-screen text-white flex flex-col relative font-sans",
            isKidsCourse ? "bg-[#050507] selection:bg-brand-purple/30" : "bg-[#050507] selection:bg-magic-royal/30"
        )}>
            {/* Ambient Background Lights */}
            {isKidsCourse ? (
                <>
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
                    <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
                </>
            ) : (
                <>
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-magic-royal/5 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
                    <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-blue-900/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
                </>
            )}

            {/* Header */}
            <header className="border-b border-white/10 bg-magic-card/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href={isKidsCourse ? "/kids/program" : "/dashboard/library"} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">{isKidsCourse ? "Retour au Programme" : "Retour à la Formation"}</span>
                    </Link>
                    <h1 className={cn(
                        "text-lg truncate max-w-md hidden md:block",
                        isKidsCourse ? "font-black uppercase text-brand-purple" : "font-serif text-magic-royal"
                    )}>
                        {course.title}
                    </h1>
                    <div className="w-8"></div> {/* Spacer for alignment */}
                </div>
            </header>

            <div className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Area (Player) */}
                <div className="lg:col-span-2 space-y-6 relative z-10">
                    <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 relative group">
                        {currentVideo ? (
                            <>
                                {/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentVideo.video_url) || currentVideo.video_url?.includes('mediadelivery.net') || currentVideo.video_url?.includes('bunny') ? (
                                    // Bunny Stream Player (IDs are GUIDs or full URLs handled securely)
                                    <iframe
                                        src={secureCourseIframeUrl}
                                        className="absolute inset-0 w-full h-full pointer-events-auto"
                                        frameBorder="0"
                                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen;"
                                        allowFullScreen
                                    ></iframe>
                                ) : /^\d+$/.test(currentVideo.video_url) ? (
                                    // Vimeo Player (IDs are numbers)
                                    <iframe
                                        src={`https://player.vimeo.com/video/${currentVideo.video_url}?h=0&title=0&byline=0&portrait=0&playsinline=1&autopause=0`}
                                        className="absolute inset-0 w-full h-full pointer-events-auto"
                                        frameBorder="0"
                                        allow="autoplay; fullscreen; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    // YouTube Player (IDs are alphanumeric, usually 11 chars)
                                    <iframe
                                        src={`https://www.youtube-nocookie.com/embed/${currentVideo.video_url}?rel=0&modestbranding=1&playsinline=1`}
                                        className="absolute inset-0 w-full h-full pointer-events-auto"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </>
                        ) : currentVideo?.thumbnail_url ? (
                            <Image
                                src={currentVideo.thumbnail_url}
                                alt={currentVideo.title}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                Select a video to start watching
                            </div>
                        )}
                    </div>

                    {currentVideo && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <h2 className={cn("text-3xl text-white", isKidsCourse ? "font-black" : "font-serif")}>{currentVideo.title}</h2>
                            </div>

                            <VideoPlayerControls
                                videoId={currentVideo.id}
                                courseId={course.id}
                                isCompleted={completedVideoIds.has(currentVideo.id)}
                                theme={isKidsCourse ? "kids" : "adults"}
                            />

                            <div className="text-base md:text-lg text-gray-300 leading-relaxed md:leading-loose font-light whitespace-pre-wrap tracking-wide max-w-none">
                                {currentVideo.description}
                            </div>

                            {/* Resource Download Button */}
                            {currentVideo.resource_url && (
                                <div className="pt-4">
                                    <a 
                                        href={currentVideo.resource_url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className={cn(
                                            "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-all shadow-lg active:scale-95",
                                            isKidsCourse 
                                                ? "bg-brand-purple hover:bg-brand-purple/80 text-white shadow-brand-purple/20" 
                                                : "bg-magic-card border border-white/10 hover:border-magic-royal hover:bg-white/5 text-magic-royal shadow-black/50"
                                        )}
                                    >
                                        <Download className="w-4 h-4" />
                                        Télécharger la Ressource
                                    </a>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Comments Section */}
                    {comments && isKidsCourse ? (
                        <KidsCommentsSection
                            videoId={course.id}
                            comments={comments || []}
                            isAdmin={isAdmin}
                        />
                    ) : (
                        comments && <AdultComments courseId={course.id} comments={comments} user={user} />
                    )}
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
                                    className={cn(
                                        "h-full transition-all duration-500",
                                        isKidsCourse ? "bg-brand-purple" : "bg-gradient-to-r from-magic-royal to-blue-700"
                                    )}
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
                                                ? (isKidsCourse ? "bg-brand-purple/20 border border-brand-purple/50" : "bg-magic-royal/10 border border-magic-royal/30")
                                                : "hover:bg-white/5 border border-transparent"
                                        )}
                                    >
                                        <div className="relative shrink-0">
                                            <div className={cn(
                                                "w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors shadow-lg",
                                                isCompleted
                                                    ? "bg-green-500 text-black border border-green-400"
                                                    : isActive
                                                        ? (isKidsCourse ? "bg-brand-purple text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] font-bold" : "bg-magic-royal text-black font-bold shadow-[0_0_15px_rgba(238,195,67,0.4)]")
                                                        : "bg-[#111] text-gray-500 border border-white/10 group-hover:border-white/30"
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
                                                "text-sm font-medium leading-tight line-clamp-2 transition-colors",
                                                isActive ? (isKidsCourse ? "text-white" : "text-magic-royal") : "text-gray-300 group-hover:text-white",
                                                isCompleted && !isActive && "text-gray-500"
                                            )}>
                                                {video.title}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1 font-light">
                                                {Math.floor(video.duration / 60)} min
                                            </p>
                                        </div>

                                        {isActive && !isCompleted && <PlayCircle className={cn(
                                            "w-4 h-4 shrink-0",
                                            isKidsCourse ? "text-brand-purple drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "text-magic-royal drop-shadow-[0_0_8px_rgba(238,195,67,0.5)]"
                                        )} />}
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
