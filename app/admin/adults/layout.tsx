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
        <div className="flex min-h-screen w-full bg-slate-50/50">
            {/* Custom Sidebar for Adults */}
            <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-slate-900 text-white hidden md:flex flex-col">
                <div className="flex items-center h-16 px-6 border-b border-slate-800">
                    <Users className="w-6 h-6 text-slate-400 mr-2" />
                    <span className="font-bold text-lg">Admin <span className="text-slate-400">Adultes</span></span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    <Link href="/admin/adults/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                        <LayoutDashboard className="w-4 h-4" />
                        Tableau de bord
                    </Link>

                    <Separator className="my-4 bg-slate-800" />
                    <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Business</p>

                    <Link href="/admin/adults/courses" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                        <BookOpen className="w-4 h-4" />
                        Formations
                    </Link>
                    <Link href="/admin/adults/products" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                        <ShoppingBag className="w-4 h-4" />
                        Ventes & Abos
                    </Link>
                    <Link href="/admin/adults/analytics" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                        <BarChart className="w-4 h-4" />
                        Analytics
                    </Link>

                    <Separator className="my-4 bg-slate-800" />

                    <Link href="/admin/adults/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-md transition-colors">
                        <Settings className="w-4 h-4" />
                        Réglages
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-900">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
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
                                <BreadcrumbPage>Espace Adultes</BreadcrumbPage>
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
