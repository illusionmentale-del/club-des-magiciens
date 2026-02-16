import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Film, Users, LogOut, ArrowLeft } from "lucide-react";
import { cookies } from "next/headers";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Basic Auth Check
    if (!user) {
        redirect("/login");
    }

    // 2. Admin Password Check
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("admin_session");

    if (!isAdmin) {
        redirect("/admin/login");
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white flex">
            {/* Sidebar */}
            <aside className="w-64 border-r border-brand-border bg-brand-card flex flex-col fixed h-full">
                <div className="p-6 border-b border-brand-border">
                    <h1 className="text-xl font-serif text-brand-gold">Admin Panel</h1>
                    <p className="text-xs text-brand-text-muted mt-1">Le Club des Magiciens</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-colors">
                        <LayoutDashboard className="w-5 h-5 text-magic-purple" />
                        <span className="font-medium">Tableau de bord</span>
                    </Link>
                    <Link href="/admin/courses" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                        <Film className="w-5 h-5" />
                        <span>Mes Cours</span>
                    </Link>
                    {/* 
                    <Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors opacity-50 cursor-not-allowed">
                        <Users className="w-5 h-5" />
                        <span>Utilisateurs</span>
                    </Link>
                    */}
                </nav>

                <div className="p-4 border-t border-brand-border space-y-2">
                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg text-magic-gold hover:bg-white/5 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Retour au Site</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-brand-bg p-8 ml-64">
                {children}
            </main>
        </div>
    );
}
