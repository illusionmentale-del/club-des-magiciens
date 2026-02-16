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
        return (
            <div className="flex min-h-screen w-full bg-slate-50/50">
                {/* Custom Sidebar for Kids */}
                <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
                    <div className="flex items-center h-16 px-6 border-b border-slate-200">
                        <Sparkles className="w-6 h-6 text-brand-purple mr-2" />
                        <span className="font-bold text-lg">Admin <span className="text-brand-purple">Kids</span></span>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        <Link href="/admin/kids/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-purple hover:bg-brand-purple/5 rounded-md transition-colors">
                            <LayoutDashboard className="w-4 h-4" />
                            Tableau de bord
                        </Link>

                        <Separator className="my-4" />
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Le Club</p>

                        <Link href="/admin/kids/library" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-purple hover:bg-brand-purple/5 rounded-md transition-colors">
                            <Film className="w-4 h-4" />
                            Ateliers & Contenus
                        </Link>
                        <Link href="/admin/kids/gamification" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-purple hover:bg-brand-purple/5 rounded-md transition-colors">
                            <Trophy className="w-4 h-4" />
                            Gamification (Badges)
                        </Link>
                        <Link href="/admin/kids/users" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-purple hover:bg-brand-purple/5 rounded-md transition-colors">
                            <Users className="w-4 h-4" />
                            Membres (Élèves)
                        </Link>

                        <Separator className="my-4" />
                        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Système</p>

                        <Link href="/admin/kids/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-purple hover:bg-brand-purple/5 rounded-md transition-colors">
                            <Settings className="w-4 h-4" />
                            Réglages Généraux
                        </Link>
                    </nav>

                    <div className="p-4 border-t border-slate-200 bg-slate-50">
                        <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                            <LogOut className="w-4 h-4" />
                            Changer d'univers
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
                    <header className="flex items-center justify-between h-16 px-6 border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Espace Kids</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </header>
                    <div className="p-6 md:p-10 space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        )
    }
