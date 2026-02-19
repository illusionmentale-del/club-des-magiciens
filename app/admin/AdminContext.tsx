"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AdminAudience = "adults" | "kids" | "all";

interface AdminContextType {
    audience: AdminAudience;
    setAudience: (audience: AdminAudience) => void;
    isPreviewOpen: boolean;
    setIsPreviewOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const [audience, setAudienceState] = useState<AdminAudience>("adults");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("admin_audience") as AdminAudience;
        if (stored) setAudienceState(stored);
    }, []);

    const setAudience = (newAudience: AdminAudience) => {
        setAudienceState(newAudience);
        localStorage.setItem("admin_audience", newAudience);
    };

    return (
        <AdminContext.Provider value={{ audience, setAudience, isPreviewOpen, setIsPreviewOpen }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdmin must be used within an AdminProvider");
    }
    return context;
}
