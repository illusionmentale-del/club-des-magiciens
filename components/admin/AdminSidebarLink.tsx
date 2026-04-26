"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface AdminSidebarLinkProps {
    href: string;
    children: ReactNode;
    audience: "kids" | "adults";
}

export default function AdminSidebarLink({ href, children, audience }: AdminSidebarLinkProps) {
    const pathname = usePathname();

    const activeColorClass = audience === "kids" ? "text-brand-purple" : "text-brand-blue";
    const activeBgClass = audience === "kids" ? "bg-brand-purple/10 border-brand-purple/30" : "bg-brand-blue/10 border-brand-blue/30";
    const hoverColorClass = audience === "kids" ? "[&>svg]:group-hover:text-brand-purple" : "[&>svg]:group-hover:text-brand-blue";

    const isActive = pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all group border ${
                isActive
                    ? `${activeBgClass} text-white [&>svg]:${activeColorClass}`
                    : `border-transparent text-brand-text-muted hover:text-white hover:bg-white/5 ${hoverColorClass}`
            } [&>svg]:transition-colors [&>svg]:w-5 [&>svg]:h-5 [&>svg]:flex-shrink-0`}
        >
            {children}
        </Link>
    );
}
