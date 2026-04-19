import { getAdultVideos, getBunnyThumbnailUrl } from '@/lib/bunny';
import AdultVideoCard from '@/components/adults/AdultVideoCard';
import { Video, Sparkles, FolderOpen, Play, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'Les Ateliers | Club des Magiciens',
    description: 'Regarde les replays de tes cours de magie et bien plus encore !',
};

// Next.js Revalidation settings (can be removed if using `next: { revalidate: 60 }` in the fetch directly, but good practice for ISR)
export const revalidate = 60;

export default async function AdultMasterclassPage() {
    const supabase = await createClient();

    // Verify adult access
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
        const { data: profile } = await supabase.from("profiles").select("has_adults_access, role").eq("id", user.id).single();
        if (profile && !profile.has_adults_access && profile.role !== 'admin') {
            // Unauth edge case silently returning null or we can handle redirecting
        }
    }

    // Fetch settings
    const { data: settings } = await supabase
        .from("settings")
        .select("*")
        .in("key", ["adult_masterclass_page_config", "adult_masterclass_featured_config"]);

    const settingsMap = settings?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>) || {};

    const pageConfig = settingsMap.adult_masterclass_page_config
        ? JSON.parse(settingsMap.adult_masterclass_page_config)
        : { title: "Les Ateliers", description: "Des ateliers pour approfondir la magie !" };

    const featuredConfig = settingsMap.adult_masterclass_featured_config
        ? JSON.parse(settingsMap.adult_masterclass_featured_config)
        : null;

    // Fetch featured video details if one is selected
    let featuredVideo = null;
    if (featuredConfig?.id) {
        const { data: featuredData } = await supabase
            .from("library_items")
            .select("*")
            .eq("id", featuredConfig.id)
            .single();

        if (featuredData) {
            featuredVideo = featuredData;
        }
    }

    // Fetch 'Ateliers' from our own database instead of raw Bunny Stream
    const { data: videos } = await supabase
        .from('library_items')
        .select('*')
        .eq('audience', 'adults')
        .eq('type', 'atelier')
        .order('published_at', { ascending: false });

    const sortedVideos = videos || [];

    return (
        <div className="min-h-screen bg-[#050507] text-white p-4 md:p-8 pb-32 font-sans relative selection:bg-magic-royal/30">
            {/* Ambient Background Lights (Homogenized with Home) */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-magic-royal/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* Header (Homogenized with Home) */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-magic-royal mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse text-magic-royal" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le QG de la Magie</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Les <span className="text-transparent bg-clip-text bg-gradient-to-r from-magic-royal to-blue-500">Ateliers</span>
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">
                            {pageConfig.description || "Des ateliers sur des thèmes précis pour approfondir ta magie !"}
                        </p>
                    </div>
                </header>

                {/* Featured Masterclass Section */}
                {featuredVideo && (
                    <div className="mb-12">
                        <h2 className="text-sm font-bold text-magic-royal uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/5 pb-2">
                            <Sparkles className="w-4 h-4" /> À LA UNE
                        </h2>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-magic-royal to-blue-500 rounded-3xl opacity-0 blur-lg group-hover:opacity-40 transition duration-1000 pointer-events-none"></div>
                            <div className="relative rounded-3xl overflow-hidden border border-magic-royal/20 bg-magic-card flex flex-col md:flex-row shadow-[0_10px_40px_rgba(0,0,0,0.5)]">

                                {/* Featured Image */}
                                <div className="w-full md:w-1/2 md:aspect-auto aspect-video relative">
                                    {featuredConfig.image || featuredVideo.thumbnail_url ? (
                                        <Image
                                            src={featuredConfig.image || featuredVideo.thumbnail_url}
                                            alt={featuredVideo.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-white/5 flex items-center justify-center">
                                            <Video className="w-12 h-12 text-white/20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-magic-card via-transparent to-transparent md:bg-gradient-to-r" />

                                    <Link href={`/watch/${featuredVideo.video_url || featuredVideo.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                        <div className="w-20 h-20 bg-magic-royal/90 text-black rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(238,195,67,0.6)] transform scale-50 group-hover:scale-100 transition-all duration-300">
                                            <Play className="w-8 h-8 ml-2" />
                                        </div>
                                    </Link>
                                </div>

                                {/* Featured Content Info */}
                                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                                    {featuredConfig.title && (
                                        <h3 className="text-xl md:text-3xl font-black text-white mb-4 leading-tight">
                                            {featuredConfig.title}
                                        </h3>
                                    )}
                                    <p className="text-slate-400 text-sm md:text-base leading-relaxed mb-8">
                                        {featuredConfig.description || featuredVideo.description || "Découvrez cet atelier exclusif !"}
                                    </p>

                                    <Link
                                        href={`/watch/${featuredVideo.video_url || featuredVideo.id}`}
                                        className="inline-flex items-center gap-2 bg-magic-royal text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-blue-400 transition-colors self-start shadow-[0_0_20px_rgba(238,195,67,0.3)]"
                                    >
                                        <Play className="w-4 h-4" />
                                        Visionner
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Video Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-magic-royal" />
                            Les Vidéos
                        </h2>
                    </div>

                    {sortedVideos.length === 0 ? (
                        <div className="relative group/box">
                            <div className="absolute -inset-1 bg-gradient-to-r from-magic-royal to-blue-500 rounded-3xl opacity-0 blur-lg group-hover/box:opacity-30 transition duration-1000 pointer-events-none"></div>
                            <div className="relative bg-[#111] border border-white/5 p-12 rounded-3xl text-center flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                                <div className="w-20 h-20 bg-black/50 border border-white/10 rounded-full flex items-center justify-center mb-6 text-slate-500 opacity-50">
                                    <FolderOpen className="w-10 h-10" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Aucune vidéo pour le moment</h3>
                                <p className="text-slate-400 max-w-md mx-auto text-sm">
                                    L'espace Ateliers est en cours de préparation... Les premières vidéos arriveront très bientôt !
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sortedVideos.map((video) => {
                                const videoIdForLink = video.video_url || video.id;
                                return (
                                    <AdultVideoCard
                                        key={video.id}
                                        id={videoIdForLink}
                                        title={video.title}
                                        thumbnailUrl={video.thumbnail_url || ''}
                                        date={video.published_at || video.created_at}
                                        durationSeconds={0}
                                        href={`/watch/${videoIdForLink}`}
                                    />
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
