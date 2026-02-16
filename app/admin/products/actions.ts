"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData) {
    const supabase = await createClient();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string) * 100; // Convert to cents
    const stripe_price_id = formData.get("stripe_price_id") as string;
    const space = formData.get("space") as "kids" | "adults";
    const type = formData.get("type") as "subscription" | "pack" | "course" | "coaching";
    const image_url = formData.get("image_url") as string;
    const is_active = formData.get("is_active") === "on";

    const { error } = await supabase.from("products").insert({
        title,
        description,
        price, // Int in cents
        stripe_price_id,
        space,
        type,
        image_url,
        is_active,
        metadata: {} // TODO: Handle benefits/metadata if needed
    });

    if (error) {
        console.error("Error creating product:", error);
        throw new Error("Failed to create product");
    }

    revalidatePath("/admin/products");
    revalidatePath("/dashboard/catalog");
    revalidatePath("/pricing");
    redirect("/admin/products");
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
        console.error("Error deleting product:", error);
        throw new Error("Failed to delete product");
    }

    revalidatePath("/admin/products");
}

export async function toggleProductStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("products")
        .update({ is_active: !currentStatus })
        .eq("id", id);

    if (error) {
        console.error("Error updating product status:", error);
        throw new Error("Failed to update product status");
    }

    revalidatePath("/admin/products");
    revalidatePath("/dashboard/catalog");
    revalidatePath("/pricing");
}
