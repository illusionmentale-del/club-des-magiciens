import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { FileText, Calendar } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const supabase = await createClient();
    const { data: page } = await supabase
        .from('legal_pages')
        .select('title')
        .eq('slug', params.slug)
        .single();

    return {
        title: page ? `${page.title} - Club des Magiciens` : "Document Légal",
    };
}

export default async function LegalPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient();

    // Fetch the correct dynamic page
    const { data: page, error } = await supabase
        .from('legal_pages')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (error || !page) {
        notFound();
    }

    // Format the date if we want to show "Dernière mise à jour"
    const lastUpdate = new Date(page.updated_at).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <article className="bg-brand-card border border-white/5 rounded-2xl p-6 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Background glowing effects for the legal box */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-brand-purple/5 blur-[100px] rounded-full pointer-events-none" />

            <header className="border-b border-white/10 pb-8 mb-8 relative z-10 text-center">
                <FileText className="w-12 h-12 text-brand-purple mx-auto mb-4" />
                <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight">
                    {page.title}
                </h1>
                <div className="flex items-center justify-center gap-2 text-brand-text-muted text-sm font-medium">
                    <Calendar className="w-4 h-4" />
                    Dernière mise à jour : {lastUpdate}
                </div>
            </header>

            {/* The actual legal content dynamically imported */}
            <div
                className="prose prose-invert prose-brand max-w-none relative z-10
                           prose-headings:text-white prose-headings:font-bold
                           prose-p:text-brand-text prose-p:leading-relaxed
                           prose-a:text-brand-gold prose-a:no-underline hover:prose-a:underline
                           prose-li:text-brand-text
                           prose-hr:border-white/10"
                dangerouslySetInnerHTML={{ __html: page.content }}
            />
        </article>
    );
}
