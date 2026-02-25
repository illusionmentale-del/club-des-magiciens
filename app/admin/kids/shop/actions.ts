"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateShopItem(itemId: string, data: { sales_page_url: string | null; price_label: string | null }) {
    const supabase = await createClient();

    // Verify admin access
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Unauthorized");

    // Process empty strings to null
    const urlValue = data.sales_page_url?.trim() === "" ? null : data.sales_page_url;
    const priceValue = data.price_label?.trim() === "" ? null : data.price_label;

    const { error } = await supabase
        .from('library_items')
        .update({
            sales_page_url: urlValue,
            price_label: priceValue
        })
        .eq('id', itemId);

    if (error) {
        throw new Error(error.message);
    }

    revalidatePath("/admin/kids/shop");
    revalidatePath("/kids/shop");

    return { success: true };
}
