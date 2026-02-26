"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function KidsLayoutClient({
    sidebar,
    mobileNav,
    children
}: {
    sidebar: ReactNode;
    mobileNav: ReactNode;
    children: ReactNode;
}) {
    const pathname = usePathname();

    // Hide sidebar on specific video pages for full "immersion/cinema" mode
    const isVideoPage = pathname?.startsWith('/kids/videos/') || pathname?.startsWith('/watch/');

    if (isVideoPage) {
        return (
            <div className="flex h-screen bg-brand-bg overflow-hidden text-brand-text font-sans relative">
                <main className="flex-1 overflow-y-auto bg-brand-bg w-full h-full relative z-0 hide-scrollbar-if-needed">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-brand-bg overflow-hidden text-brand-text font-sans">
            {sidebar}
            <div className="flex-1 flex flex-col md:pl-0">
                {mobileNav}
                <main className="flex-1 overflow-y-auto bg-brand-bg p-4 md:p-8 text-brand-text">
                    {children}
                </main>
            </div>
        </div>
    );
}
