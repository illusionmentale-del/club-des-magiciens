import { getKidsVideos, getBunnyThumbnailUrl } from '@/lib/bunny';
import VideoCard from '@/components/VideoCard';
import { Video, Sparkles, FolderOpen, Play, Star, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import SearchInput from '@/components/kids/SearchInput';


export const metadata = {
    title: 'Les Ateliers | Club des Magiciens',
    description: 'Regarde les replays de tes cours de magie et bien plus encore !',
};

// Next.js Revalidation settings (can be removed if using `next: { revalidate: 60 }` in the fetch directly, but good practice for ISR)
export const revalidate = 60;

export default async function KidsVideosPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const sParams = await searchParams;
    const query = sParams.q?.toLowerCase() || "";
    const supabase = await createClient();

    // Fetch settings
    const { data: settings } = await supabase
        .from("settings")
        .select("*")
        .in("key", ["kid_masterclass_page_config", "kid_masterclass_featured_config"]);

    const settingsMap = settings?.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {} as Record<string, string>) || {};

    const pageConfig = settingsMap.kid_masterclass_page_config
        ? JSON.parse(settingsMap.kid_masterclass_page_config)
        : { title: "Les Ateliers", description: "Des ateliers sur des thèmes précis pour approfondir ta magie !" };

    const featuredConfig = settingsMap.kid_masterclass_featured_config
        ? JSON.parse(settingsMap.kid_masterclass_featured_config)
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
        .eq('audience', 'kids')
        .eq('type', 'atelier')
        .order('published_at', { ascending: false });

    // Filter videos based on search query
    const sortedVideos = (videos || []).filter(item => {
        if (!query) return true;
        const matchesTitle = item.title?.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesTags = item.tags?.some((tag: string) => tag.toLowerCase().includes(query));
        return matchesTitle || matchesDesc || matchesTags;
    });

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text p-4 md:p-8 pb-32 font-sans relative selection:bg-brand-purple/30">
            {/* Ambient Background Lights (Homogenized with Home) */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/20 blur-[150px] rounded-full pointer-events-none mix-blend-screen"></div>
            <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-brand-blue/10 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>

            {/* Main Wrapper Container */}
            <div className="max-w-5xl mx-auto relative z-10 space-y-12">

                {/* Header (Homogenized with Home) */}
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-brand-gold mb-2">
                            <Star className="w-5 h-5 fill-current animate-pulse text-brand-gold" />
                            <span className="text-xs font-bold uppercase tracking-widest">Le Club des Petits Magiciens</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                            Les <span className="text-brand-purple">Ateliers</span>
                        </h1>
                        <p className="text-brand-text-muted mt-2 text-lg">
                            {pageConfig.description || "Des ateliers sur des thèmes précis pour approfondir ta magie !"}
                        </p>
                    </div>
                </header>



                {/* Search Bar */}
                <div className="w-full relative z-20">
                    <SearchInput />
                </div>

                {/* Featured Masterclass Section (Hidden when searching) */}
                {featuredVideo && !query && (
                    <div className="mb-12">
                        <h2 className="text-sm font-bold text-brand-purple uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" /> À LA UNE
                        </h2>
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-3xl opacity-0 blur-lg group-hover:opacity-40 transition duration-1000 pointer-events-none"></div>
                            <div className="relative rounded-3xl overflow-hidden border border-brand-purple/20 bg-brand-card flex flex-col md:flex-row shadow-[0_10px_40px_rgba(0,0,0,0.2)]">

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
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-card via-transparent to-transparent md:bg-gradient-to-r" />

                                    <Link href={`/kids/videos/${featuredVideo.video_url || featuredVideo.id}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-20 h-20 bg-brand-gold/90 text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.5)] transform scale-50 group-hover:scale-100 transition-all duration-300">
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
                                    <p className="text-brand-text-muted text-sm md:text-base leading-relaxed mb-8">
                                        {featuredConfig.description || featuredVideo.description || "Découvre cet atelier spécial !"}
                                    </p>

                                    <Link
                                        href={`/kids/videos/${featuredVideo.video_url || featuredVideo.id}`}
                                        className="inline-flex items-center gap-2 bg-brand-purple text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-brand-purple/80 transition-colors self-start shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                                    >
                                        <Play className="w-4 h-4" />
                                        Visionner
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Video Grid or Search List */}
                <div className="space-y-6">
                    {query ? (
                        <div className="space-y-4 pb-12">
                            <h2 className="text-sm font-bold text-brand-purple uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Search className="w-4 h-4" /> RÉSULTATS DE RECHERCHE
                            </h2>
                            {sortedVideos.length > 0 ? sortedVideos.map(video => {
                                const videoIdForLink = video.video_url || video.id;
                                return (
                                    <Link key={video.id} href={`/kids/videos/${videoIdForLink}`} className="flex flex-col sm:flex-row gap-4 bg-brand-card hover:bg-brand-card/80 p-4 rounded-2xl border border-brand-border hover:border-brand-purple/50 transition-all group shadow-sm hover:shadow-[0_10px_30px_rgba(168,85,247,0.1)]">
                                        <div className="w-full sm:w-64 md:w-56 aspect-video relative rounded-xl overflow-hidden bg-black shrink-0 border border-white/5">
                                            {video.thumbnail_url ? (
                                                <Image src={video.thumbnail_url} alt="" fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><Play className="w-8 h-8 text-white/20" /></div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-12 h-12 bg-brand-purple/90 rounded-full flex items-center justify-center shadow-lg border border-white/20 scale-90 group-hover:scale-100 transition-all duration-300">
                                                    <Play className="w-5 h-5 text-white ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center py-2 h-full">
                                            <h3 className="text-xl md:text-2xl font-black text-white mb-2 leading-tight group-hover:text-brand-purple transition-colors">{video.title}</h3>
                                            <p className="text-sm text-brand-text-muted line-clamp-2 md:line-clamp-3 mb-4">{video.description}</p>
                                            <div className="mt-auto flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span className="bg-brand-blue/10 text-brand-blue border border-brand-blue/20 text-[10px] font-bold px-2 py-1 rounded inline-flex items-center gap-1 uppercase tracking-wider">Atelier</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-brand-purple uppercase tracking-widest opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                    Visionner <Play className="w-3 h-3" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            }) : (
                                <div className="text-center py-16 text-brand-text-muted bg-brand-card/30 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <Search className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p className="text-lg font-bold text-white mb-2">Aucun résultat trouvé</p>
                                    <p className="text-sm opacity-60">Nous n'avons rien trouvé pour "{query}" dans les ateliers.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Sparkles className="w-6 h-6 text-brand-gold" />
                                    Les Vidéos
                                </h2>
                            </div>

                            {sortedVideos.length === 0 ? (
                                <div className="relative group/box">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-brand-purple to-brand-blue rounded-3xl opacity-0 blur-lg group-hover/box:opacity-30 transition duration-1000 pointer-events-none"></div>
                                    <div className="relative bg-brand-card border border-brand-border p-12 rounded-3xl text-center flex flex-col items-center justify-center shadow-[0_10px_40px_rgba(0,0,0,0.2)]">
                                        <div className="w-20 h-20 bg-brand-bg border border-brand-border rounded-full flex items-center justify-center mb-6 text-brand-text-muted opacity-50">
                                            <FolderOpen className="w-10 h-10" />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">Aucune vidéo pour le moment</h3>
                                        <p className="text-brand-text-muted max-w-md mx-auto text-sm">
                                            L'espace Ateliers est en cours de préparation... Les premières vidéos arriveront très bientôt !
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {sortedVideos.map((video) => {
                                        const videoIdForLink = video.video_url || video.id;
                                        return (
                                            <VideoCard
                                                key={video.id}
                                                id={videoIdForLink}
                                                title={video.title}
                                                thumbnailUrl={video.thumbnail_url || ''}
                                                date={video.published_at || video.created_at}
                                                durationSeconds={0}
                                                href={`/kids/videos/${videoIdForLink}`}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
