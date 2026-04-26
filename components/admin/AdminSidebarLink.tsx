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

    const activeColorClass = audience === "adults" ? "text-brand-blue" : "text-brand-purple";
    const activeBgClass = audience === "adults" ? "bg-brand-blue/10 border-brand-blue/30" : "bg-brand-purple/10 border-brand-purple/30";
    const hoverColorClass = audience === "adults" ? "[&>svg]:group-hover:text-brand-blue" : "[&>svg]:group-hover:text-brand-purple";
    const shadowColor = audience === "adults" ? "rgba(59,130,246,0.15)" : "rgba(168,85,247,0.15)";

    const isActive = pathname.startsWith(href);

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all group border ${
                isActive
                    ? `${activeBgClass} text-white [&>svg]:${activeColorClass} shadow-[0_0_15px_${shadowColor}]`
                    : `border-transparent text-brand-text-muted hover:text-white hover:bg-white/5 ${hoverColorClass}`
            } [&>svg]:transition-colors [&>svg]:w-5 [&>svg]:h-5 [&>svg]:flex-shrink-0`}
        >
            {children}
        </Link>
    );
}
