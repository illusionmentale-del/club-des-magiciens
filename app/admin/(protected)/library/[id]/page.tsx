import LibraryItemForm from "@/components/admin/LibraryItemForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditLibraryItemPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const resolvedParams = await params;

    // Cast to any to bypass strict type checking during build if types aren't fully generated yet
    const { data: item } = await supabase
        .from("library_items")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

    if (!item) {
        notFound();
    }

    // Adapt item to form structure if needed (e.g. casting enums)
    const formattedItem = {
        ...item,
        audience: item.audience as 'kids' | 'adults',
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-text uppercase tracking-tight">Modifier le contenu</h1>
                <p className="text-brand-text-muted mt-2">Édition de : <span className="text-brand-text font-bold">{item.title}</span></p>
            </div>
            <LibraryItemForm initialData={formattedItem} />
        </div>
    );
}
