"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function revokeDevice(deviceIdToRevoke: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Non autorisé.");
    }

    // Attempt to delete. RLS ensures a user can only delete their own devices.
    const { error } = await supabase
        .from('user_devices')
        .delete()
        .eq('device_id', deviceIdToRevoke)
        .eq('user_id', user.id);

    if (error) {
        console.error("Failed to revoke device:", error);
        throw new Error("Impossible de supprimer cet appareil.");
    }

    // After deleting a device, the current device might now be able to connect!
    // Revaliding the root paths to ensure layouts re-run the `enforceDeviceLimit` which should now INSERT the current device!
    revalidatePath("/kids", "layout");
    revalidatePath("/dashboard", "layout");
    
    // Redirect back to root (the middleware will route them to kids or dashboard correctly)
    redirect("/");
}
