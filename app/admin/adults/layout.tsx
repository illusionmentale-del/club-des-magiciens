import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Users, LayoutDashboard, BookOpen, ShoppingBag, BarChart, Settings, LogOut } from "lucide-react"
import Link from "next/link"

export default function AdultsAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen w-full bg-brand-bg text-brand-text font-sans selection:bg-brand-gold/30">
            {/* Custom Sidebar for Adults */}
            <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-brand-card border-r border-white/5 hidden md:flex flex-col shadow-2xl">
                <div className="flex items-center h-20 px-6 border-b border-white/5 bg-gradient-to-r from-brand-card to-brand-bg">
                    <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center mr-3 border border-brand-gold/30">
                        <Users className="w-6 h-6 text-brand-gold" />
                    </div>
                    <span className="font-black text-xl tracking-tighter uppercase whitespace-nowrap">
                        Club <span className="text-brand-gold">Adultes</span>
                    </span>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/admin/adults/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <LayoutDashboard className="w-5 h-5 group-hover:text-brand-gold transition-colors" />
                        Dashboard
                    </Link>

                    <Separator className="my-6 bg-white/5" />
                    <p className="px-4 text-[10px] font-black text-brand-gold uppercase tracking-widest mb-4">Business</p>

                    <Link href="/admin/adults/courses" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <BookOpen className="w-5 h-5 group-hover:text-brand-gold transition-colors" />
                        Formations
                    </Link>
                    <Link href="/admin/adults/products" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <ShoppingBag className="w-5 h-5 group-hover:text-brand-gold transition-colors" />
                        Ventes & Abos
                    </Link>
                    <Link href="/admin/adults/analytics" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <BarChart className="w-5 h-5 group-hover:text-brand-gold transition-colors" />
                        Analytics
                    </Link>

                    <Separator className="my-6 bg-white/5" />
                    <p className="px-4 text-[10px] font-black text-brand-text-muted uppercase tracking-widest mb-4">Système</p>

                    <Link href="/admin/adults/settings" className="flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest text-brand-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all group">
                        <Settings className="w-5 h-5 group-hover:text-brand-gold transition-colors" />
                        Réglages
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
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/5 blur-[150px] rounded-full pointer-events-none"></div>

                <header className="flex items-center justify-between h-20 px-8 border-b border-white/5 bg-brand-bg/80 backdrop-blur-xl sticky top-0 z-40">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/admin" className="text-brand-text-muted hover:text-white">Admin</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="text-white/10" />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-brand-gold font-bold uppercase tracking-widest text-xs">Business</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                <div className="p-8 md:p-12 relative z-10 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
