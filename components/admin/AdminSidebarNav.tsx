"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

interface NavItem {
    href: string;
    label: string;
    icon: LucideIcon;
}

interface AdminSidebarNavProps {
    items: NavItem[];
    audience: "kids" | "adults";
}

export default function AdminSidebarNav({ items, audience }: AdminSidebarNavProps) {
    const pathname = usePathname();

    const activeColorClass = audience === "kids" ? "text-brand-purple" : "text-brand-blue";
    const activeBgClass = audience === "kids" ? "bg-brand-purple/10 border-brand-purple/30" : "bg-brand-blue/10 border-brand-blue/30";
    const hoverColorClass = audience === "kids" ? "group-hover:text-brand-purple" : "group-hover:text-brand-blue";

    return (
        <>
            {items.map((item) => {
                const isActive = pathname.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-all group border ${
                            isActive
                                ? `${activeBgClass} text-white`
                                : "border-transparent text-brand-text-muted hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <item.icon
                            className={`w-5 h-5 flex-shrink-0 transition-colors ${
                                isActive ? activeColorClass : hoverColorClass
                            }`}
                        />
                        {item.label}
                    </Link>
                );
            })}
        </>
    );
}
