"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { WelcomeKidEmail } from "@/components/emails/WelcomeKidEmail";

// const resend = new Resend(process.env.RESEND_API_KEY); // Moved inside function to avoid init error on import


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

export async function updateSettings(formData: FormData) {
    const supabase = await createClient();
    const context = formData.get("context") as string; // 'adult' | 'kid'
    const isKid = context === 'kid';
    const prefix = isKid ? 'kid_' : '';

    const keys = ["featured_video", "shop_link", "welcome_message", "dashboard_title", "news_title", "instagram_title", "social_youtube", "social_instagram", "social_facebook", "social_tiktok"];

    // Handle File Upload (Logo)
    const logoFile = formData.get("logo_file") as File;
    if (logoFile && logoFile.size > 0) {
        // Create unique name
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo-${isKid ? 'kid-' : ''}${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage.from('assets').upload(fileName, logoFile);

        if (!error && data) {
            const { data: { publicUrl } } = supabase.storage.from('assets').getPublicUrl(fileName);
            // Save with correct key
            await supabase.from("settings").upsert({ key: `${prefix}site_logo`, value: publicUrl });
        }
    }

    for (const key of keys) {
        const value = formData.get(key) as string;
        // Only update if value is provided (even empty string is a value), ignore nulls
        // Note: We save with the prefix
        if (value !== null) await supabase.from("settings").upsert({ key: `${prefix}${key}`, value });
    }

    revalidatePath("/dashboard");
    revalidatePath("/kids"); // Revalidate kids path too
    revalidatePath("/admin/settings");
    // return { success: "Paramètres mis à jour !" }; 
}

export async function saveKidsHomeSettings(config: Record<string, any>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Admin check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Forbidden");

    // We store all home configs as a single JSON object or multiple keys
    // If the key already starts with 'kid_', assume it's a full key.
    // Otherwise, for backwards compatibility with KidsHomeConfig, prepend 'kid_home_'
    const entries = Object.entries(config).map(([key, value]) => ({
        key: key.startsWith('kid_') ? key : `kid_home_${key}`,
        value: typeof value === 'string' ? value : JSON.stringify(value)
    }));

    const { error } = await supabase.from("settings").upsert(entries, { onConflict: 'key' });

    if (error) {
        console.error("Error saving kids home settings:", error);
        throw new Error(error.message);
    }

    revalidatePath("/kids");
    revalidatePath("/admin/kids/settings");
    revalidatePath("/", "layout"); // Force global refresh
    return { success: true };
}

export async function saveKidsMenuSettings(config: Record<string, boolean>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Admin check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Forbidden");

    const entries = Object.entries(config).map(([key, value]) => ({
        key,
        value: value ? 'true' : 'false'
    }));

    const { error } = await supabase.from("settings").upsert(entries, { onConflict: 'key' });

    if (error) {
        console.error("Error saving kids menu settings:", error);
        throw new Error(error.message);
    }

    revalidatePath("/kids", "layout");
    revalidatePath("/admin/kids/settings");
    return { success: true };
}

export async function saveAdultsMenuSettings(config: Record<string, boolean>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Admin check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Forbidden");

    const entries = Object.entries(config).map(([key, value]) => ({
        key,
        value: value ? 'true' : 'false'
    }));

    const { error } = await supabase.from("settings").upsert(entries, { onConflict: 'key' });

    if (error) {
        console.error("Error saving adults menu settings:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard", "layout");
    revalidatePath("/admin/adults/settings");
    return { success: true };
}

export async function saveAdultsHomeBlockSettings(config: Record<string, boolean>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Admin check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Forbidden");

    const entries = Object.entries(config).map(([key, value]) => ({
        key,
        value: value ? 'true' : 'false'
    }));

    const { error } = await supabase.from("settings").upsert(entries, { onConflict: 'key' });

    if (error) {
        console.error("Error saving adults home block settings:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard", "page");
    revalidatePath("/admin/adults/settings");
    return { success: true };
}

export async function saveAdultHomeSettings(config: Record<string, any>) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Admin check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Forbidden");

    // We store all adult home configs as a single JSON object or multiple keys
    const entries = Object.entries(config).map(([key, value]) => ({
        key: key.startsWith('adult_') ? key : `adult_home_${key}`,
        value: typeof value === 'string' ? value : JSON.stringify(value)
    }));

    const { error } = await supabase.from("settings").upsert(entries, { onConflict: 'key' });

    if (error) {
        console.error("Error saving adult home settings:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard");
    revalidatePath("/admin/adults/settings");
    revalidatePath("/", "layout"); // Force global refresh
    return { success: true };
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
    const platform = formData.get("platform") as string || 'jitsi';
    const audience = formData.get("audience_override") as string || formData.get("audience") as string || 'adults';
    const event_type = formData.get("event_type") as string || 'live';

    await supabase.from("lives").insert({
        title,
        start_date,
        platform_id,
        platform,
        status: 'programmé',
        audience,
        event_type
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

export async function updateLiveRoom(id: string, newPlatformId: string, newTitle?: string) {
    const supabase = await createClient();
    const updates: any = { platform_id: newPlatformId };
    if (newTitle) updates.title = newTitle;
    await supabase.from("lives").update(updates).eq("id", id);
    revalidatePath("/admin/lives");
    revalidatePath("/dashboard");
}

// --- COURSE ACTIONS ---

export async function createCourse(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const audience = formData.get("audience") as string || 'adults';
    const status = formData.get("status") as string || 'published';
    const publishedAtStr = formData.get("published_at") as string;

    let published_at = null;
    if (status === 'scheduled' && publishedAtStr) {
        published_at = new Date(publishedAtStr).toISOString();
    }

    const { error } = await supabase.from("courses").insert({
        title, description, image_url: imageUrl, audience, status, published_at
    });

    if (error) {
        console.error("Error creating course:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/courses");
    revalidatePath("/kids");
    revalidatePath("/admin");
    redirect("/admin/adults/courses");
}

export async function updateCourse(id: string, formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const imageUrl = formData.get("imageUrl") as string;
    const audience = formData.get("audience") as string || 'adults';
    const status = formData.get("status") as string || 'published';
    const publishedAtStr = formData.get("published_at") as string;

    let published_at = null;
    if (status === 'scheduled' && publishedAtStr) {
        published_at = new Date(publishedAtStr).toISOString();
    }

    const { error } = await supabase.from("courses").update({
        title, description, image_url: imageUrl, audience, status, published_at
    }).eq('id', id);

    if (error) {
        console.error("Error updating course:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/courses");
    revalidatePath("/kids");
    revalidatePath("/admin");
    redirect("/admin/adults/courses"); // We'll redirect to the list
}

export async function deleteCourse(id: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase.from("courses").delete().eq('id', id);

    if (error) {
        console.error("Error deleting course:", error);
        throw new Error(error.message);
    }

    revalidatePath("/dashboard/courses");
    revalidatePath("/kids");
    revalidatePath("/admin");
    redirect("/admin/adults/courses");
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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Check current user is admin
    const { data: currentUserProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (currentUserProfile?.role !== 'admin') throw new Error("Forbidden");

    // PROTECT SUPER ADMINS
    const { data: targetProfile } = await supabaseAdmin.from('profiles').select('username').eq('id', userId).single();
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

    await supabaseAdmin.from("profiles").update({ 
        role: newRole,
        has_adults_access: newRole === 'admin' ? true : undefined,
        has_kids_access: newRole === 'admin' ? true : undefined
    }).eq("id", userId);
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
    // Check override first, then hidden audience field, default to adults
    const audience = (formData.get("audience_override") as string) || (formData.get("audience") as string) || 'adults';

    await supabase.from("instagram_posts").insert({ link_url, image_url, audience });
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

    if (!supabaseServiceKey) {
        console.error("Service Role Key missing");
        return { error: "Erreur de configuration Serveur (SUPABASE_SERVICE_ROLE_KEY manquante)." };
    }

    // Dynamic import to avoid client-side bundling issues if this file is imported there (though it is 'use server')
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const username = formData.get("username") as string;
    const account_type = formData.get("account_type") as string || 'kid';

    let role = 'user';
    let access_level = 'kid';

    if (account_type === 'admin') {
        role = 'admin';
        access_level = 'adult'; // Admins usually have adult access level or better
    } else if (account_type === 'adult') {
        role = 'user';
        access_level = 'adult';
    } else {
        // kid
        role = 'kid'; // Fixed from 'user' to ensure visibility in Kids dashboard
        access_level = 'kid';
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: username }
    });

    if (error) {
        console.error("Error creating user:", error);
        return { error: error.message };
    }

    // Trigger should handle profile creation, but in case it fails or we want to set username immediately:
    if (data.user) {
        // Check if profile exists (from trigger)
        // Wait a bit? Or just upsert.
        // We update because the trigger handle_new_user likely already inserted the row
        const profileData = {
            username: username,
            full_name: username,
            role: role,
            access_level: access_level,
            has_kids_access: access_level === 'kid' || role === 'admin',
            has_adults_access: access_level === 'adult' || role === 'admin'
        };

        const { error: profileError } = await supabaseAdmin.from("profiles").update(profileData).eq("id", data.user.id);
        
        if (profileError) {
             console.error("Profile update error, trying upsert:", profileError);
             await supabaseAdmin.from("profiles").upsert({ id: data.user.id, ...profileData });
        }

        // Send Welcome Email if it's a Kid
        if (access_level === 'kid') {
            console.log("Attempting to send email to:", email);
            console.log("API Key present:", !!process.env.RESEND_API_KEY);
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                const result = await resend.emails.send({
                    from: 'Club des Petits Magiciens <onboarding@resend.dev>', // Use test domain first
                    to: [email],
                    subject: 'Bienvenue au Club des Petits Magiciens ! 🎩✨',
                    react: WelcomeKidEmail({
                        username: username,
                        password: password,
                        loginUrl: "https://clubdespetitsmagiciens.fr/login"
                    }),
                });
            } catch (emailError) {
                console.error("Error sending welcome email:", emailError);
                // Don't fail the request, just log it
            }
        }
    }

    if (access_level === 'kid') {
        revalidatePath("/admin/kids/users");
        redirect("/admin/kids/users");
    } else {
        revalidatePath("/admin/adults/users");
        redirect("/admin/adults/users");
    }
}

// Standard Client for User Updates (RLS Policy Protected)
export async function updateUserAccess(userId: string, formData: FormData) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Must be admin to do this
    const { data: currentUserProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (currentUserProfile?.role !== 'admin') throw new Error("Forbidden");

    const access_level = formData.get("access_level") as string;
    const is_kid = access_level === 'kid';

    const protectedEmails = ['contact@jeremymarouani.com', 'admin.vente@jeremymarouani.com', 'vente@jeremymarouani.com', 'illusionmental@gmail.com'];
    const { data: targetProfile } = await supabaseAdmin.from('profiles').select('email').eq('id', userId).single();
    if (targetProfile && targetProfile.email && protectedEmails.includes(targetProfile.email)) {
        return; // Silent fail or could return error
    }

    const { error } = await supabaseAdmin.from("profiles").update({ 
        access_level, 
        has_kids_access: is_kid,
        has_adults_access: !is_kid
    }).eq("id", userId);
    
    if (error) console.error("Update Access Error:", error);

    revalidatePath("/admin/users");
    revalidatePath("/admin/kids/users");
    revalidatePath("/admin/adults/users");
}

export async function deleteUserEntity(userId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Use Service Role to bypass RLS policies and access Auth Admin API
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    const protectedEmails = ['contact@jeremymarouani.com', 'admin.vente@jeremymarouani.com', 'vente@jeremymarouani.com', 'illusionmental@gmail.com'];
    const { data: targetProfile } = await supabaseAdmin.from('profiles').select('email').eq('id', userId).single();
    if (targetProfile && targetProfile.email && protectedEmails.includes(targetProfile.email)) {
        throw new Error("Action interdite : Ce compte est protégé par le système.");
    }
    
    const userEmail = targetProfile?.email;

    // Cleanup known tables referencing user_id to prevent FK errors
    await supabaseAdmin.from('push_subscriptions').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_xp_logs').delete().eq('user_id', userId);
    await supabaseAdmin.from('unlocked_skins').delete().eq('user_id', userId);
    await supabaseAdmin.from('purchases').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_purchases').delete().eq('user_id', userId);
    await supabaseAdmin.from('subscriptions').delete().eq('user_id', userId);
    
    // Gamification & Progress
    await supabaseAdmin.from('user_badges').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_progress').delete().eq('user_id', userId);
    await supabaseAdmin.from('kids_video_progress').delete().eq('user_id', userId);
    await supabaseAdmin.from('user_library_progress').delete().eq('user_id', userId);
    
    // Social & Notifications
    await supabaseAdmin.from('course_likes').delete().eq('user_id', userId);
    await supabaseAdmin.from('course_comments').delete().eq('user_id', userId);
    await supabaseAdmin.from('event_reminders').delete().eq('user_id', userId);
    await supabaseAdmin.from('kids_analytics').delete().eq('user_id', userId);
    await supabaseAdmin.from('live_messages').delete().eq('user_id', userId);

    // Unsubscribe from Resend
    if (userEmail && process.env.RESEND_API_KEY) {
        try {
            const { Resend } = await import("resend");
            const resend = new Resend(process.env.RESEND_API_KEY);
            const audiencesResponse = await resend.audiences.list();
            const audiences = audiencesResponse.data?.data || [];
            
            for (const audience of audiences) {
                await resend.contacts.remove({
                    email: userEmail,
                    audienceId: audience.id,
                });
            }
        } catch (e) {
            console.error("Error removing user from Resend newsletter audiences:", e);
        }
    }

    // Forcefully soft-delete the profile to ensure it disappears from the admin dashboard
    // We do this manually because BEFORE DELETE triggers might intercept the delete() call
    const { error: profileDelError } = await supabaseAdmin
        .from('profiles')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', userId);
        
    if (profileDelError) {
        console.error("Error soft-deleting user profile:", profileDelError);
    }

    // Supprimer définitivement l'utilisateur de l'authentification
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    // If the error is 404/user_not_found, it means the user is already gone from auth, which is fine!
    if (error && error.status !== 404) {
        console.error("Error deleting user from auth:", error);
        throw new Error("Impossible de supprimer définitivement l'utilisateur.");
    }

    revalidatePath("/admin/kids/users");
    revalidatePath("/admin/adults/users");
}

export async function restoreUserEntity(userId: string) {
    const supabase = await createClient();

    // Clear deleted_at
    await supabase.from("profiles").update({ deleted_at: null }).eq("id", userId);
    revalidatePath("/admin/kids/users");
    revalidatePath("/admin/adults/users");
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
    revalidatePath("/admin/kids/users");
    revalidatePath("/admin/adults/users");
}

export async function removeTag(userId: string, tagToRemove: string) {
    const supabase = await createClient();
    const { data: profile } = await supabase.from("profiles").select("tags").eq("id", userId).single();
    const currentTags = profile?.tags || [];

    const updatedTags = currentTags.filter((t: string) => t !== tagToRemove);
    await supabase.from("profiles").update({ tags: updatedTags }).eq("id", userId);
    revalidatePath("/admin/kids/users");
    revalidatePath("/admin/adults/users");
}

export async function resendWelcomeEmail(email: string, username: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // Need admin client to generate recovery link
    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Admin check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Forbidden");

    try {
        // Generate recovery link
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'recovery',
            email: email,
            options: {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard`
            }
        });

        if (linkError) throw linkError;

        const resend = new Resend(process.env.RESEND_API_KEY);
        const fromEmail = process.env.NODE_ENV === 'development'
            ? 'Club des Petits Magiciens <onboarding@resend.dev>'
            : 'Club des Petits Magiciens <contact@clubdespetitsmagiciens.fr>';

        const { data, error: sendError } = await resend.emails.send({
            from: fromEmail,
            to: [email],
            subject: 'Magie ! Ton lien de connexion au Club 🎩✨',
            react: WelcomeKidEmail({
                username: username,
                loginUrl: "https://clubdespetitsmagiciens.fr/login",
                recoveryUrl: linkData.properties.action_link // The magic link
            }),
        });

        if (sendError) {
            console.error("Resend API rejected email:", sendError);
            return { error: sendError.message || "Refusé par le serveur mail" };
        }

        return { success: true, data };
    } catch (error: any) {
        console.error("Resend error:", error);
        return { error: error.message };
    }
}

export async function adminChangeUserPassword(userId: string, formData: FormData) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    // We need service role to modify another user's password
    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Only Admins can execute this action
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') throw new Error("Forbidden");

    // Protect Super Admins from having their passwords changed
    const { data: targetProfile } = await supabase.from('profiles').select('username').eq('id', userId).single();
    if (targetProfile) {
        const { createHash } = await import('crypto');
        const hash = createHash('sha256').update(targetProfile.username || '').digest('hex');
        const protectedHashes = [
            '5f4dcc3b5aa765d61d8327deb882cf99f3640244795b5c918451842b083b4b52',
            '62c07657989f666b6c07212003504780521e405a74e50882772584109405b05a',
            '86477bd4327421ace067406b23136208942b03f01962383049da03d2745a90d3'
        ];
        if (protectedHashes.includes(hash)) {
            return { error: "Action interdite : Ce compte est protégé." };
        }
    }

    const newPassword = formData.get("new_password") as string;
    if (!newPassword || newPassword.length < 6) {
        return { error: "Le mot de passe doit contenir au moins 6 caractères." };
    }

    const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: newPassword
    });

    if (error) {
        console.error("Error updating user password:", error);
        return { error: error.message };
    }

    revalidatePath(`/admin/kids/users/${userId}`);
    revalidatePath(`/admin/adults/users/${userId}`);
    return { success: true };
}

// --- CHAT ACTIONS ---
export async function sendLiveChatMessage(liveId: string, content: string, type: 'chat' | 'question') {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const { createClient: createSupabaseAdmin } = await import("@supabase/supabase-js");
    const supabaseAdmin = createSupabaseAdmin(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    const { error } = await supabaseAdmin.from("live_messages").insert({
        live_id: liveId,
        user_id: user.id,
        content,
        type
    });

    if (error) {
        console.error("Error sending chat message:", error);
        return { error: error.message };
    }

    return { success: true };
}

// --- EVENT REMINDERS ACTIONS ---
export async function toggleEventReminder(eventId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    // Check if the user already has a reminder for this event
    const { data: existing } = await supabase
        .from("event_reminders")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user.id)
        .single();

    if (existing) {
        // Remove reminder
        const { error } = await supabase
            .from("event_reminders")
            .delete()
            .eq("id", existing.id);
        if (error) return { error: error.message };
        return { success: true, isReminded: false };
    } else {
        // Add reminder
        const { error } = await supabase
            .from("event_reminders")
            .insert({
                event_id: eventId,
                user_id: user.id
            });
        if (error) return { error: error.message };
        return { success: true, isReminded: true };
    }
}

// --- DRAG AND DROP ORDERING ---
export async function updateLibraryItemsOrder(items: { id: string, position: number }[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: "Unauthorized" };

    try {
        const promises = items.map(item => 
            supabase.from('library_items').update({ position: item.position }).eq('id', item.id)
        );
        await Promise.all(promises);
        
        revalidatePath('/admin/kids/library');
        revalidatePath('/kids/program');
        
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}

// --- GAMIFICATION ADMIN ACTIONS ---
export async function getAdminUserGamificationDetails(userId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false }});

    // Fetches bypass RLS
    const [
        { data: p },
        { data: pr },
        { data: ub },
        { data: pu },
        { data: items },
        { data: badges },
        { data: shopItems },
        { data: lastVideo },
    ] = await Promise.all([
        supabaseAdmin.from("profiles").select("*").eq("id", userId).single(),
        supabaseAdmin.from("library_progress").select("*, library_items(title, week_number)").eq("user_id", userId).order("completed_at", { ascending: false }),
        supabaseAdmin.from("user_badges").select("*, badges(name, image_url)").eq("user_id", userId).order("awarded_at", { ascending: false }),
        supabaseAdmin.from("user_purchases").select("*, library_items(title)").eq("user_id", userId).order("created_at", { ascending: false }),
        supabaseAdmin.from("library_items").select("id, title, week_number").eq("audience", "kids").not("week_number", "is", null).order("week_number"),
        supabaseAdmin.from("badges").select("id, name"),
        supabaseAdmin.from("library_items").select("id, title").eq("audience", "kids").is("week_number", null),
        supabaseAdmin.from("kids_video_progress").select("video_id, updated_at, progress_percent").eq("user_id", userId).order("updated_at", { ascending: false }).limit(1).maybeSingle()
    ]);

    let lastVideoTitle: string | null = null;
    if (lastVideo && lastVideo.video_id) {
        try {
            const guidMatch = lastVideo.video_id.match(/_([a-zA-Z0-9-]+)$/);
            const guid = guidMatch ? guidMatch[1] : lastVideo.video_id;
            const { getKidsVideoById } = await import("@/lib/bunny");
            const btv = await getKidsVideoById(guid);
            if (btv && btv.title) {
                lastVideoTitle = btv.title;
            } else {
                const { data: li } = await supabaseAdmin.from('library_items').select('title').eq('video_url', lastVideo.video_id).maybeSingle();
                if (li) lastVideoTitle = li.title;
                else {
                    const { data: li2 } = await supabaseAdmin.from('library_items').select('title').eq('video_url', guid).maybeSingle();
                    if (li2) lastVideoTitle = li2.title;
                }
            }
        } catch (e) {
            console.error("Could not fetch latest video title", e);
        }
    }

    return {
        profile: p,
        progress: pr || [],
        userBadges: ub || [],
        purchases: pu || [],
        allItems: items || [],
        allBadges: badges || [],
        shopItems: shopItems || [],
        lastVideoInfo: lastVideo ? { ...lastVideo, title: lastVideoTitle } : null
    };
}

export async function adminValidateItem(userId: string, itemId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false }});
    
    const { error } = await supabaseAdmin.from("library_progress").insert({ user_id: userId, item_id: itemId });
    return { success: !error, error: error?.message };
}

export async function adminRevokeItem(progressId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false }});
    
    const { error } = await supabaseAdmin.from("library_progress").delete().eq("id", progressId);
    return { success: !error, error: error?.message };
}

export async function adminGiveBadge(userId: string, badgeId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false }});
    
    const { error } = await supabaseAdmin.from("user_badges").insert({ user_id: userId, badge_id: badgeId });
    return { success: !error, error: error?.message };
}

export async function adminRevokeBadge(userBadgeId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false }});
    
    const { error } = await supabaseAdmin.from("user_badges").delete().eq("id", userBadgeId);
    return { success: !error, error: error?.message };
}

export async function adminGiveGift(userId: string, itemId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false }});
    
    const { error } = await supabaseAdmin.from("user_purchases").upsert({
        user_id: userId,
        library_item_id: itemId,
        status: 'active',
        systeme_io_order_id: 'admin_gift'
    }, { onConflict: 'user_id,library_item_id' });
    return { success: !error, error: error?.message };
}

export async function adminRevokeGift(purchaseId: string) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false }});
    
    const { error } = await supabaseAdmin.from("user_purchases").delete().eq("id", purchaseId);
    return { success: !error, error: error?.message };
}

export async function generateImpersonationLink(userId: string) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
        const { createClient } = await import("@supabase/supabase-js");
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false }});

        // 1. Fetch user email
        const { data: user, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);
        
        if (userError || !user?.user?.email) {
            return { success: false, error: "Impossible de trouver l'email de cet utilisateur ou profil invalide." };
        }

        // 2. Generate Magic Link targeting the alternative domain to preserve admin cookies
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: user.user.email,
            options: {
                redirectTo: `https://club-des-magiciens.vercel.app/impersonate`
            }
        });

        if (error || !data?.properties?.action_link) {
            return { success: false, error: error?.message || "Erreur de génération du lien magique." };
        }

        return { success: true, link: data.properties.action_link };
    } catch (error: any) {
        return { success: false, error: `CRASH SERVEUR: ${error.message}` };
    }
}
