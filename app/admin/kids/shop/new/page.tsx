import ShopItemForm from "@/components/admin/ShopItemForm";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = {
    title: 'Nouveau Produit | Admin Kids',
};

export default async function NewShopItemPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        redirect("/");
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <ShopItemForm />
        </div>
    );
}
