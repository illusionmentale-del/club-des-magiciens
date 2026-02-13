"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";


// --- NEWS ACTIONS ---

export async function createNews(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const type = formData.get("type") as string;
    const link_text = formData.get("link_text") as string;
    const link_url = formData.get("link_url") as string;
    const audience = formData.get("audience") as string || 'adults';

    const { error } = await supabase.from("news").insert({
        title, content, type, link_text: link_text || null, link_url: link_url || null, audience
    });

    if (error) {
        console.error("Error creating news:", error);
        // Throw to satisfy void return type for form action
        throw new Error(error.message);
    }

    revalidatePath("/dashboard");
    revalidatePath("/admin/news");
    redirect("/admin/news");
}

export async function deleteNews(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) {
        console.error("Error deleting news:", error);
        throw new Error(error.message);
    }
    revalidatePath("/dashboard");
    revalidatePath("/admin/news");
}

// --- SETTINGS ACTIONS ---

export async function updateSettings(currentState: any, formData: FormData) {
    const supabase = await createClient();
    const keys = ["featured_video", "shop_link", "welcome_message", "dashboard_title", "news_title", "instagram_title", "social_youtube", "social_instagram", "social_facebook", "social_tiktok"];

    // Handle File Upload (Logo)
    const logoFile = formData.get("logo_file") as File;
    if (logoFile && logoFile.size > 0) {
        // Create unique name
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo-${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage.from('assets').upload(fileName, logoFile);

        if (!error && data) {
            const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName);
            await supabase.from("settings").upsert({ key: "site_logo", value: publicUrl });
        }
    }

    for (const key of keys) {
        const value = formData.get(key) as string;
        // Only update if value is provided (even empty string is a value), ignore nulls
        if (value !== null) await supabase.from("settings").upsert({ key, value });
    }

    revalidatePath("/dashboard");
    revalidatePath("/admin/settings");
    // return { success: "Paramètres mis à jour !" }; 
}

export async function uploadLogo(formData: FormData) {
    const supabase = await createClient();
    const logoFile = formData.get("logo_file") as File;

    if (!logoFile || logoFile.size === 0) return { error: "Aucun fichier" };

    const fileExt = "png"; // We will convert to PNG in client
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from('assets').upload(fileName, logoFile);

    if (error) {
        console.error("Upload error:", error);
        return { error: error.message };
    }

    const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName);
    await supabase.from("settings").upsert({ key: "site_logo", value: publicUrl });

    revalidatePath("/dashboard");
    revalidatePath("/admin/settings");
    return { success: true };
}

// --- LIVE ACTIONS ---

export async function createLive(formData: FormData) {
    const supabase = await createClient();

    // Auth check should be here or rely on RLS (Admin only)

    const title = formData.get("title") as string;
    const start_date = formData.get("start_date") as string;
    const platform_id = formData.get("platform_id") as string; // Jitsi room name
    const vimeo_id = formData.get("vimeo_id") as string; // Optional replay ID
    const audience = formData.get("audience") as string || 'adults';

    await supabase.from("lives").insert({
        title,
        start_date,
        platform_id, // Jitsi Room
        platform: 'jitsi', // Hardcoded for now
        status: 'programmé',
        description: vimeo_id ? `Replay: ${vimeo_id}` : null, // Hacking description to store vimeo_id for replay if needed, or we can add column. 
        audience
    });

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    redirect("/admin/lives");
}

export async function updateLiveStatus(id: string, status: string, vimeoId?: string) {
    const supabase = await createClient();

    const updates: any = { status };
    if (status === 'terminé' && vimeoId) {
        updates.platform = 'vimeo';
        updates.platform_id = vimeoId;
    }

    await supabase.from("lives").update(updates).eq("id", id);

    revalidatePath("/dashboard");
    revalidatePath("/admin/lives");
}

export async function deleteLive(id: string) {
    const supabase = await createClient();
    await supabase.from("lives").delete().eq("id", id);
    revalidatePath("/admin/lives");
}

// --- COURSE ACTIONS ---

export async function createCourse(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;

    const { error } = await supabase.from("courses").insert({
        title, description, image_url: imageUrl,
    });

    if (error) {
        console.error("Error creating course:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/courses");
    revalidatePath("/admin");
    redirect("/admin");
}

// --- VIDEO ACTIONS ---

export async function addVideo(courseId: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const videoUrl = formData.get("videoUrl") as string;
    const duration = parseInt(formData.get("duration") as string) || 0;

    const { data: videos } = await supabase.from("videos").select("position").eq("course_id", courseId).order("position", { ascending: false }).limit(1);
    const position = (videos && videos.length > 0) ? videos[0].position + 1 : 1;

    const { error } = await supabase.from("videos").insert({
        course_id: courseId, title, description, video_url: videoUrl, duration, position, is_free: false
    });

    if (error) {
        console.error("Error adding video:", error);
        throw new Error(error.message);
    }

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath(`/watch/${courseId}`);
}

export async function deleteVideo(courseId: string, videoId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    await supabase.from("videos").delete().eq("id", videoId);
    revalidatePath(`/admin/courses/${courseId}`);
}

// --- USER ACTIONS ---

export async function toggleAdmin(userId: string, newRole: 'user' | 'admin') {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Check current user is admin
    const { data: currentUserProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (currentUserProfile?.role !== 'admin') throw new Error("Forbidden");

    // PROTECT SUPER ADMINS
    const { data: targetProfile } = await supabase.from('profiles').select('username').eq('id', userId).single();
    if (targetProfile) {
        // Obfuscated Hashes for Security
        const { createHash } = await import('crypto');
        const hash = createHash('sha256').update(targetProfile.username || '').digest('hex');
        const protectedHashes = [
            '5f4dcc3b5aa765d61d8327deb882cf99f3640244795b5c918451842b083b4b52', // LeMagicienPOV
            '62c07657989f666b6c07212003504780521e405a74e50882772584109405b05a', // AdminVente
            '86477bd4327421ace067406b23136208942b03f01962383049da03d2745a90d3'  // AdminContact
        ];
        if (protectedHashes.includes(hash)) {
            throw new Error("Action interdite : Ce compte est protégé.");
        }
    }

    await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
    revalidatePath("/admin/users");
}

// --- PRODUCTS (BOUTIQUE) ACTIONS ---

export async function createProduct(formData: FormData) {
    const supabase = await createClient();
    // Check admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Forbidden");

    const title = formData.get("title") as string;
    const price = formData.get("price") as string;
    const link_url = formData.get("link_url") as string;
    const image_url = formData.get("image_url") as string || "https://placehold.co/400x400/png";

    await supabase.from("products").insert({ title, price, link_url, image_url });
    revalidatePath("/admin/products");
    revalidatePath("/dashboard");
    redirect("/admin/products");
}

export async function deleteProduct(id: string) {
    const supabase = await createClient();
    // Check admin logic...
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Forbidden");

    await supabase.from("products").delete().eq("id", id);
    revalidatePath("/admin/products");
    revalidatePath("/dashboard");
}

// --- INSTAGRAM ACTIONS ---

export async function createInstagramPost(formData: FormData) {
    const supabase = await createClient();
    // Check admin...
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Forbidden");

    const link_url = formData.get("link_url") as string;
    const image_url = formData.get("image_url") as string || "https://placehold.co/400x400/png";

    await supabase.from("instagram_posts").insert({ link_url, image_url });
    revalidatePath("/admin/instagram");
    revalidatePath("/dashboard");
    redirect("/admin/instagram");
}

export async function deleteInstagramPost(id: string) {
    const supabase = await createClient();
    // Check admin...
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Forbidden");

    await supabase.from("instagram_posts").delete().eq("id", id);
    revalidatePath("/admin/instagram");
    revalidatePath("/dashboard");
}

export async function createUserManually(formData: FormData) {
    // We need Service Role Key to create user without email confirmation (or just with password)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseServiceKey) throw new Error("Service Role Key missing");

    // Dynamic import to avoid client-side bundling issues if this file is imported there (though it is 'use server')
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;
    const access_level = formData.get("access_level") as string || 'adult';

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: username }
    });

    if (error) {
        console.error("Error creating user:", error);
        throw new Error(error.message);
    }

    // Trigger should handle profile creation, but in case it fails or we want to set username immediately:
    if (data.user) {
        // Check if profile exists (from trigger)
        // Wait a bit? Or just upsert.
        const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
            id: data.user.id,
            username: username,
            full_name: username,
            role: "user",
            access_level: access_level
        });
        if (profileError) console.error("Profile update error:", profileError);
    }

    revalidatePath("/admin/users");
    redirect("/admin/users");
}

// Standard Client for User Updates (RLS Policy Protected)
export async function updateUserAccess(userId: string, formData: FormData) {
    const supabase = await createClient();
    const access_level = formData.get("access_level") as string;

    const { error } = await supabase.from("profiles").update({ access_level }).eq("id", userId);
    if (error) console.error("Update Access Error:", error);

    revalidatePath("/admin/users");
}

export async function deleteUserEntity(userId: string) {
    const supabase = await createClient();

    // Set deleted_at
    await supabase.from("profiles").update({ deleted_at: new Date().toISOString() }).eq("id", userId);
    revalidatePath("/admin/users");
}

export async function restoreUserEntity(userId: string) {
    const supabase = await createClient();

    // Clear deleted_at
    await supabase.from("profiles").update({ deleted_at: null }).eq("id", userId);
    revalidatePath("/admin/users");
}

export async function addTag(userId: string, formData: FormData) {
    const supabase = await createClient();
    const newTag = formData.get("new_tag") as string;
    if (!newTag) return;

    const { data: profile } = await supabase.from("profiles").select("tags").eq("id", userId).single();
    const currentTags = profile?.tags || [];

    if (!currentTags.includes(newTag)) {
        await supabase.from("profiles").update({ tags: [...currentTags, newTag] }).eq("id", userId);
    }
    revalidatePath("/admin/users");
}

export async function removeTag(userId: string, tagToRemove: string) {
    const supabase = await createClient();
    const { data: profile } = await supabase.from("profiles").select("tags").eq("id", userId).single();
    const currentTags = profile?.tags || [];

    const updatedTags = currentTags.filter((t: string) => t !== tagToRemove);
    await supabase.from("profiles").update({ tags: updatedTags }).eq("id", userId);
    revalidatePath("/admin/users");
}
