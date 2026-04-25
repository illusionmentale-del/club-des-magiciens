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

export default function AdultsAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full bg-[#000000] text-[#f5f5f7] font-sans selection:bg-brand-royal/30">
            {/* Mobile Nav */}
            <AdminAdultsMobileNav />

            {/* Custom Sidebar for Adults */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#000000] border-r border-white/5 hidden md:flex flex-col">
                <div className="flex items-center h-20 px-6 border-b border-white/5 bg-[#000000]">
                    <div className="w-10 h-10 bg-[#1c1c1e] rounded-xl flex items-center justify-center mr-3 border border-white/5">
                        <Users className="w-6 h-6 text-[#f5f5f7]" />
                    </div>
                    <span className="font-semibold text-lg tracking-tight whitespace-nowrap text-white">
                        L'Atelier <span className="text-[#86868b] font-light">Admin</span>
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/admin/adults/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <LayoutDashboard className="w-5 h-5 group-hover:text-brand-royal transition-colors" />
                        Dashboard
                    </Link>

                    <Separator className="my-6 bg-white/5" />
                    <Separator className="my-6 bg-white/5" />
                    <p className="px-4 text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-4">Gestion du Contenu</p>

                    <Link href="/admin/adults/library" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Video className="w-5 h-5 group-hover:text-white transition-colors" />
                        Vidéos & Ateliers
                    </Link>
                    <Link href="/admin/adults/settings/masterclass" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Sparkles className="w-5 h-5 group-hover:text-white transition-colors" />
                        Page "Mes Formations"
                    </Link>
                    <Link href="/admin/adults/products" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <ShoppingBag className="w-5 h-5 group-hover:text-white transition-colors" />
                        La Boutique
                    </Link>
                    <Link href="/admin/adults/lives" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Video className="w-5 h-5 group-hover:text-white transition-colors" />
                        Diffusions Live
                    </Link>

                    <Separator className="my-6 bg-white/5" />
                    <p className="px-4 text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-4">Suivi & Communauté</p>

                    <Link href="/admin/adults/inbox" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <MessageCircle className="w-5 h-5 group-hover:text-white transition-colors" />
                        Questions Élèves
                    </Link>
                    <Link href="/admin/adults/users" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Users className="w-5 h-5 group-hover:text-white transition-colors" />
                        Liste des Élèves
                    </Link>
                    <Link href="/admin/adults/newsletter" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Mail className="w-5 h-5 group-hover:text-white transition-colors" />
                        Newsletter
                    </Link>
                    <Link href="/admin/adults/push" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <MessageCircle className="w-5 h-5 group-hover:text-white transition-colors" />
                        Envoi Rapide Push
                    </Link>
                    <Link href="/admin/adults/vip-requests" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Sparkles className="w-5 h-5 group-hover:text-white transition-colors" />
                        Accès Privilège
                    </Link>

                    <Separator className="my-6 bg-white/5" />
                    <p className="px-4 text-[10px] font-black text-[#86868b] uppercase tracking-widest mb-4">Pilotage & Système</p>


                    <Link href="/admin/adults/analytics" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <BarChart className="w-5 h-5 group-hover:text-white transition-colors" />
                        Analytics
                    </Link>
                    <Link href="/admin/adults/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Settings className="w-5 h-5 group-hover:text-white transition-colors" />
                        Vitrine & Identité
                    </Link>
                    <Link href="/admin/legal" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <BookOpen className="w-5 h-5 group-hover:text-white transition-colors" />
                        Textes Légaux
                    </Link>
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
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-royal/5 blur-[150px] rounded-full pointer-events-none"></div>

                <header className="h-16 md:h-20 border-b border-white/5 bg-black/60 backdrop-blur-2xl sticky top-0 z-40 px-4 md:px-8">
                    <div className="flex items-center justify-between w-full max-w-7xl mx-auto h-full">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/admin" className="text-[#86868b] hover:text-white transition-colors">Admin</BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator className="text-white/10" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage className="text-[#f5f5f7] font-medium tracking-wide text-sm hidden md:block">Atelier</BreadcrumbPage>
                                    <BreadcrumbPage className="text-[#f5f5f7] font-medium tracking-wide text-sm md:hidden">Atelier</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                </header>

                <div className="p-4 md:p-8 lg:p-12 relative z-10 w-full max-w-7xl mx-auto flex-1">
                    {children}
                </div>
            </main>
        </div>
    )
}
