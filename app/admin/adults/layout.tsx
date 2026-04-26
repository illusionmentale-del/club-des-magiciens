import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Users, LayoutDashboard, BookOpen, ShoppingBag, BarChart, Settings, LogOut, Video, MessageCircle, Mail, Sparkles, Trophy } from "lucide-react"
import Link from "next/link"
import AdminAdultsMobileNav from "@/components/admin/AdminAdultsMobileNav"
import AdminSidebarLink from "@/components/admin/AdminSidebarLink"
import GlobalPreview from "@/components/admin/GlobalPreview"

export default function AdultsAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full bg-brand-bg text-brand-text font-sans selection:bg-brand-blue/30">
            {/* Mobile Nav */}
            <AdminAdultsMobileNav />

            {/* Custom Sidebar for Adults */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-white/10 hidden md:flex flex-col shadow-2xl">
                <Link href="/dashboard" className="flex items-center h-20 px-6 border-b border-white/10 bg-[#0a0a0a] hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="w-10 h-10 bg-brand-blue/20 rounded-xl flex items-center justify-center mr-3 border border-brand-blue/30">
                        <Users className="w-6 h-6 text-brand-blue" />
                    </div>
                    <span className="font-black text-xl tracking-tighter uppercase whitespace-nowrap">
                        L'Atelier <span className="text-brand-blue">Admin</span>
                    </span>
                </Link>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <AdminSidebarLink href="/admin/adults/dashboard" audience="adults">
                        <LayoutDashboard />
                        Dashboard
                    </AdminSidebarLink>

                    <Separator className="my-6 bg-white/5" />
                    <p className="px-4 text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-4">Gestion du Contenu</p>

                    <AdminSidebarLink href="/admin/adults/library" audience="adults">
                        <Video />
                        Vidéos & Ateliers
                    </AdminSidebarLink>
                    <AdminSidebarLink href="/admin/adults/settings/masterclass" audience="adults">
                        <Sparkles />
                        Page "Mes Formations"
                    </AdminSidebarLink>
                    <AdminSidebarLink href="/admin/adults/products" audience="adults">
                        <ShoppingBag />
                        La Boutique
                    </AdminSidebarLink>
                    <AdminSidebarLink href="/admin/adults/lives" audience="adults">
                        <Video />
                        Diffusions Live
                    </AdminSidebarLink>

                    <Separator className="my-6 bg-white/5" />
                    <p className="px-4 text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-4">Suivi & Communauté</p>

                    <AdminSidebarLink href="/admin/adults/inbox" audience="adults">
                        <MessageCircle />
                        Questions Élèves
                    </AdminSidebarLink>
                    <AdminSidebarLink href="/admin/adults/users" audience="adults">
                        <Users />
                        Liste des Élèves
                    </AdminSidebarLink>
                    <AdminSidebarLink href="/admin/adults/newsletter" audience="adults">
                        <Mail />
                        Newsletter
                    </AdminSidebarLink>
                    <AdminSidebarLink href="/admin/adults/push" audience="adults">
                        <MessageCircle />
                        Envoi Rapide Push
                    </AdminSidebarLink>
                    <AdminSidebarLink href="/admin/adults/vip-requests" audience="adults">
                        <Sparkles />
                        Accès Privilège
                    </AdminSidebarLink>

                    <Separator className="my-6 bg-white/5" />
                    <p className="px-4 text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-4">Pilotage & Système</p>

                    <AdminSidebarLink href="/admin/adults/analytics" audience="adults">
                        <BarChart />
                        Analytics
                    </AdminSidebarLink>
                    <AdminSidebarLink href="/admin/adults/settings" audience="adults">
                        <Settings />
                        Vitrine & Identité
                    </AdminSidebarLink>
                    <AdminSidebarLink href="/admin/adults/legal" audience="adults">
                        <BookOpen />
                        Textes Légaux
                    </AdminSidebarLink>
                </nav>

                <div className="p-4 border-t border-white/5 bg-black/20">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest text-brand-text-muted hover:text-white transition-all text-center">
                        <LogOut className="w-4 h-4" />
                        Changer d'univers
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
                {/* Page Background Glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 blur-[150px] rounded-full pointer-events-none"></div>

                <header className="h-16 md:h-20 border-b border-white/5 bg-brand-bg/80 backdrop-blur-xl sticky top-0 z-40 px-4 md:px-8">
                    <div className="flex items-center justify-between w-full max-w-7xl mx-auto h-full">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin" className="text-brand-text-muted hover:text-white transition-colors">Admin</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="text-white/10" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-white font-bold uppercase tracking-widest text-xs hidden md:block">Espace Atelier</BreadcrumbPage>
                                    <BreadcrumbPage className="text-white font-bold uppercase tracking-widest text-xs md:hidden">Atelier</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>

                        <div className="flex items-center gap-4">
                            <GlobalPreview />
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8 lg:p-12 relative z-10 w-full max-w-7xl mx-auto flex-1">
                    {children}
                </div>
            </main>
        </div>
    )
}
