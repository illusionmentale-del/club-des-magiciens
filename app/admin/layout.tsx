import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminProvider } from "./AdminContext";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

    // Double check admin role here (Middleware also does it, but safer)
    if (profile?.role !== 'admin') {
        redirect("/dashboard");
    }

    // Since we are in Admin, isAdmin is always true
    const isAdmin = true;

    return (
        <AdminProvider>
            <div className="flex bg-brand-bg min-h-screen">
                <main className="flex-1 relative min-h-screen">
                    <div className="p-0">
                        {children}
                    </div>
                </main>
            </div>
        </AdminProvider>
    );
}
