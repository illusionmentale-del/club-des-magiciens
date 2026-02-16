import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Play, Filter, Clock, Tag } from "lucide-react";

export default async function AdultFeedPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient();
    const resolvedParams = await searchParams;
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Fetch Tags
    const { data: tags } = await supabase
        .from("library_tags")
        .select("*")
        .order("name", { ascending: true });

    const themes = tags?.filter(t => t.type === 'theme') || [];
    const ambitions = tags?.filter(t => t.type === 'ambition') || [];

    // Build Query
    let query = supabase
        .from("library_items")
        .select(`
            *,
            library_item_tags (
                tag_id,
                library_tags (name, type, slug)
            )
        `)
        .eq("audience", "adults")
        .lte("published_at", new Date().toISOString())
        .order("published_at", { ascending: false });

    // Client-side filtering simulation (Supabase postgrest filtering on related tables is tricky for "item has tag X")
    // For MVP/V1 with low volume, fetching all active adults items and filtering in memory is acceptable.
    // Ideally: Use .contains or a specialized RPC.

    // For now, let's just fetch and filter JS-side to ensure accuracy without complex joins
    const { data: allItems } = await query;

    // Filter by tag if needed (URL param ?tag=slug)
    const activeTagSlug = typeof resolvedParams.tag === 'string' ? resolvedParams.tag : 'all';

    const filteredItems = allItems?.filter(item => {
        if (activeTagSlug === 'all') return true;
        // Check if any tag matches
        // @ts-ignore - Supabase type inference for joined tables can be tricky
        const itemTags = item.library_item_tags?.map(it => it.library_tags?.slug);
        return itemTags?.includes(activeTagSlug);
    }) || [];

    const featuredItem = filteredItems[0]; // First item as featured for now
    const gridItems = filteredItems.slice(1);

    return (
        <div className="min-h-screen bg-brand-bg text-brand-text font-sans pb-32">

            {/* Featured Section (Cinematic Hero) */}
            {featuredItem && (
                <div className="relative h-[60vh] w-full overflow-hidden flex items-end">
                    <div className="absolute inset-0">
                        {featuredItem.thumbnail_url && (
                            <Image
                                src={featuredItem.thumbnail_url}
                                alt={featuredItem.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/50 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-brand-bg/90 via-transparent to-transparent"></div>
                    </div>

                    <div className="relative z-10 p-8 md:p-16 max-w-4xl w-full">
                        {featuredItem.subtitle && (
                            <div className="text-brand-gold font-bold uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-brand-gold"></div>
                                {featuredItem.subtitle}
                            </div>
                        )}
                        <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tight leading-none mb-6">
                            {featuredItem.title}
                        </h1>
                        <p className="text-xl text-brand-text-muted font-light mb-8 max-w-2xl line-clamp-3">
                            {featuredItem.description}
                        </p>

                        <div className="flex items-center gap-4">
                            <button className="bg-brand-text text-brand-bg hover:bg-white px-8 py-4 rounded-xl font-black uppercase tracking-wider flex items-center gap-3 transition-colors">
                                <Play className="w-5 h-5 fill-current" />
                                Regarder
                            </button>
                            <button className="px-8 py-4 rounded-xl border border-brand-text/30 hover:bg-white/10 text-brand-text font-bold uppercase tracking-wider backdrop-blur-sm transition-colors">
                                Plus d'infos
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <div className="sticky top-0 z-50 bg-brand-bg/90 backdrop-blur-lg border-b border-brand-border py-4 px-8 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-3 min-w-max">
                    <Link
                        href="/dashboard/feed"
                        className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${activeTagSlug === 'all' ? 'bg-brand-text text-brand-bg border-brand-text' : 'bg-transparent text-brand-text-muted border-brand-border hover:border-brand-text hover:text-brand-text'}`}
                    >
                        Tout
                    </Link>
                    <div className="w-px h-6 bg-brand-border mx-2"></div>
                    {themes.map(theme => (
                        <Link
                            key={theme.id}
                            href={`/dashboard/feed?tag=${theme.slug}`}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${activeTagSlug === theme.slug ? 'bg-brand-text text-brand-bg border-brand-text' : 'bg-transparent text-brand-text-muted border-brand-border hover:border-brand-text hover:text-brand-text'}`}
                        >
                            {theme.name}
                        </Link>
                    ))}
                    <div className="w-px h-6 bg-brand-border mx-2"></div>
                    {ambitions.map(ambition => (
                        <Link
                            key={ambition.id}
                            href={`/dashboard/feed?tag=${ambition.slug}`}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${activeTagSlug === ambition.slug ? 'bg-brand-text text-brand-bg border-brand-text' : 'bg-transparent text-brand-text-muted border-brand-border hover:border-brand-text hover:text-brand-text'}`}
                        >
                            {ambition.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Content Grid */}
            <div className="p-8">
                <h2 className="text-xl font-bold text-brand-text mb-8 uppercase tracking-widest flex items-center gap-3">
                    <Clock className="w-5 h-5 text-brand-blue" />
                    Dernières Publications
                </h2>

                {gridItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {gridItems.map(item => (
                            <Link key={item.id} href={`/dashboard/feed/${item.id}`} className="group block">
                                <div className="aspect-video bg-brand-card relative rounded-xl overflow-hidden border border-brand-border group-hover:border-brand-blue/50 transition-all shadow-lg group-hover:shadow-brand-blue/10">
                                    {item.thumbnail_url && (
                                        <Image
                                            src={item.thumbnail_url}
                                            alt={item.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                            <Play className="w-5 h-5 text-black fill-current ml-0.5" />
                                        </div>
                                    </div>

                                    {/* Type Badge */}
                                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/80 border border-brand-border/50 rounded text-[9px] font-bold uppercase tracking-widest text-brand-text">
                                        {item.type}
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center gap-2 mb-2 text-[10px] text-brand-text-muted uppercase tracking-wider">
                                        <span>{new Date(item.published_at).toLocaleDateString()}</span>
                                        {item.subtitle && (
                                            <>
                                                <span>•</span>
                                                <span className="text-brand-gold">{item.subtitle}</span>
                                            </>
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-brand-text leading-tight group-hover:text-brand-blue transition-colors">
                                        {item.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center border border-dashed border-brand-border rounded-xl">
                        <p className="text-brand-text-muted">Aucun contenu ne correspond à cette recherche.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
