import LibraryItemForm from "@/components/admin/LibraryItemForm";

export default function NewLibraryItemPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-brand-text uppercase tracking-tight">Ajouter un contenu</h1>
                <p className="text-brand-text-muted mt-2">Créez une nouvelle entrée pour le feed Kids ou Adultes.</p>
            </div>
            <LibraryItemForm />
        </div>
    );
}
