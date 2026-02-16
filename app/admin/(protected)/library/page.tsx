import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, Search, Filter, Video, FileText, LayoutGrid } from "lucide-react";
import Image from "next/image";

export default async function AdminLibraryPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const supabase = await createClient();
    const resolvedParams = await searchParams;
    const audienceFilter = typeof resolvedParams.audience === 'string' ? resolvedParams.audience : 'all';

    let query = supabase
        .from("library_items")
        .select("*")
        .order("created_at", { ascending: false });

    if (audienceFilter !== 'all') {
        query = query.eq('audience', audienceFilter);
    }

    const { data: items } = await query;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-brand-text uppercase tracking-tight">Médiathèque</h1>
                    <p className="text-brand-text-muted mt-2">Gérez les contenus du feed Kids et Adultes.</p>
                </div>
                <Link
                    href="/admin/library/new"
                    className="inline-flex items-center gap-2 bg-brand-blue hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)]"
                >
                    <Plus className="w-5 h-5" />
                    Nouveau Contenu
                </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 bg-brand-card border border-brand-border p-4 rounded-xl overflow-x-auto">
                <Filter className="w-5 h-5 text-brand-text-muted shrink-0" />
                <div className="h-6 w-[1px] bg-brand-border mx-2"></div>
                <Link
                    href="/admin/library"
                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${audienceFilter === 'all' ? 'bg-brand-surface text-brand-text border border-brand-border' : 'text-brand-text-muted hover:text-brand-text'}`}
                >
                    Tous
                </Link>
                <Link
                    href="/admin/library?audience=kids"
                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${audienceFilter === 'kids' ? 'bg-brand-surface text-brand-cyan border border-brand-cyan/30' : 'text-brand-text-muted hover:text-brand-cyan'}`}
                >
                    Kids
                </Link>
                <Link
                    href="/admin/library?audience=adults"
                    className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${audienceFilter === 'adults' ? 'bg-brand-surface text-brand-gold border border-brand-gold/30' : 'text-brand-text-muted hover:text-brand-gold'}`}
                >
                    Adultes
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items && items.length > 0 ? (
                    items.map((item) => (
                        <Link
                            key={item.id}
                            href={`/admin/library/${item.id}`}
                            className="group bg-brand-card border border-brand-border hover:border-brand-blue/50 rounded-2xl overflow-hidden transition-all hover:shadow-2xl hover:shadow-brand-blue/10 flex flex-col h-full"
                        >
                            <div className="aspect-video relative bg-brand-bg">
                                {item.thumbnail_url ? (
                                    <Image src={item.thumbnail_url} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-brand-text-muted">
                                        <LayoutGrid className="w-10 h-10 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded border border-brand-border text-[10px] uppercase font-bold text-brand-text tracking-widest">
                                    {item.type}
                                </div>
                                <div className={`absolute top-3 left-3 px-2 py-1 rounded border text-[10px] uppercase font-bold tracking-widest ${item.audience === 'kids'
                                        ? 'bg-brand-cyan/20 border-brand-cyan/50 text-brand-cyan'
                                        : 'bg-brand-gold/20 border-brand-gold/50 text-brand-gold'
                                    }`}>
                                    {item.audience}
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-brand-text mb-2 line-clamp-2 group-hover:text-brand-blue transition-colors">
                                    {item.title}
                                </h3>

                                {item.audience === 'kids' && (
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-2 py-0.5 rounded bg-brand-surface border border-brand-border text-xs text-brand-text-muted font-mono">
                                            Semaine {item.week_number}
                                        </span>
                                        {item.is_main && (
                                            <span className="px-2 py-0.5 rounded bg-brand-purple/20 border border-brand-purple/50 text-xs text-brand-purple font-bold uppercase">
                                                Principal
                                            </span>
                                        )}
                                    </div>
                                )}

                                {item.audience === 'adults' && item.subtitle && (
                                    <p className="text-sm text-brand-text-muted mb-4 line-clamp-1 italic">
                                        "{item.subtitle}"
                                    </p>
                                )}

                                <div className="mt-auto pt-4 border-t border-brand-border flex items-center justify-between text-xs text-brand-text-muted font-mono">
                                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                    <div className="flex items-center gap-2">
                                        {item.video_url && <Video className="w-3 h-3" />}
                                        {item.resource_url && <FileText className="w-3 h-3" />}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border border-dashed border-brand-border rounded-3xl bg-brand-card/30">
                        <p className="text-brand-text-muted mb-4 uppercase tracking-widest">Aucun contenu trouvé</p>
                        <Link
                            href="/admin/library/new"
                            className="text-brand-blue hover:text-brand-text border-b border-brand-blue hover:border-brand-text transition-colors pb-0.5 uppercase tracking-wider font-bold text-sm"
                        >
                            Créer le premier item
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
