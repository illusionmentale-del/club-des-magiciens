"use server";

import { createClient } from "@/lib/supabase/server";

export async function fetchLegalPages() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('legal_pages')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error("Error fetching legal pages:", error);
        return [];
    }
    return data;
}

export async function updateLegalPage(id: string, content: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('legal_pages')
        .update({ content })
        .eq('id', id);

    if (error) {
        console.error("Error updating legal page:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}
