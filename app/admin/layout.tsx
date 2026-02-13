import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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
        <div className="flex bg-magic-bg min-h-screen">
            {/* Desktop Sidebar */}
            <div className="hidden md:block w-64 fixed h-full z-10 transition-all duration-300">
                <Sidebar isAdmin={isAdmin} />
            </div>

            {/* Mobile Nav */}
            <div className="md:hidden fixed top-0 w-full z-50">
                <MobileNav isAdmin={isAdmin} />
            </div>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 relative min-h-screen">
                {/* Add top padding for mobile to account for fixed header */}
                <div className="md:p-0 pt-20">
                    {children}
                </div>
            </main>
        </div>
    );
}
