import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Film, Users, LogOut, ArrowLeft, Sparkles, Trophy, Settings } from "lucide-react";
import { cookies } from "next/headers";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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

    const content = (
        <div className="flex min-h-screen w-full bg-brand-bg text-brand-text font-sans selection:bg-brand-purple/30">
            {/* Custom Sidebar for Kids */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-brand-card border-r border-white/5 hidden md:flex flex-col shadow-2xl">
                <div className="flex items-center h-20 px-6 border-b border-white/5 bg-gradient-to-r from-brand-card to-brand-bg">
                    <div className="w-10 h-10 bg-brand-purple/20 rounded-xl flex items-center justify-center mr-3 border border-brand-purple/30">
                        <Sparkles className="w-6 h-6 text-brand-purple" />
                    </div>
                    <span className="font-black text-xl tracking-tighter uppercase whitespace-nowrap">
                        Club <span className="text-brand-purple">Kids</span>
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/admin/kids/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <LayoutDashboard className="w-5 h-5 group-hover:text-brand-purple transition-colors" />
                        Tableau de bord
                    </Link>

                    <Separator className="my-6 bg-white/5" />
                    <p className="px-4 text-[10px] font-black text-brand-purple uppercase tracking-widest mb-4">L'Univers Magique</p>

                    <Link href="/admin/kids/library" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Film className="w-5 h-5 group-hover:text-brand-purple transition-colors" />
                        Le Club
                    </Link>
                    <Link href="/admin/kids/gamification" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Trophy className="w-5 h-5 group-hover:text-brand-purple transition-colors" />
                        Badges
                    </Link>
                    <Link href="/admin/kids/users" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Users className="w-5 h-5 group-hover:text-brand-purple transition-colors" />
                        Élèves
                    </Link>

                    <Separator className="my-6 bg-white/5" />
                    <p className="px-4 text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-4">Système</p>

                    <Link href="/admin/kids/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Settings className="w-4 h-4 group-hover:text-brand-purple transition-colors" />
                        Réglages
                    </Link>
                </nav>

                <div className="p-4 border-t border-white/5 bg-black/20">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-brand-text-muted hover:text-white transition-all">
                        <LogOut className="w-4 h-4" />
                        Changer d'univers
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
                {/* Page Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-purple/5 blur-[150px] rounded-full pointer-events-none"></div>

                <header className="flex items-center justify-between h-20 px-8 border-b border-white/5 bg-brand-bg/80 backdrop-blur-xl sticky top-0 z-40">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin" className="text-brand-text-muted hover:text-white">Admin</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-white/10" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-white font-bold uppercase tracking-widest text-xs">Espace Kids</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <div className="p-8 md:p-12 relative z-10 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );

    return content;
}
