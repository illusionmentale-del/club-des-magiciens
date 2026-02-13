"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// HARDCODED PASSWORD FOR MVP - TO BE MOVED TO ENV VAR
const ADMIN_PASSWORD = "Simsalabim2026!";

export async function loginAdmin(prevState: any, formData: FormData) {
    const password = formData.get("password") as string;

    if (password === ADMIN_PASSWORD) {
        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set("admin_session", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: "/",
        });
        redirect("/admin");
    } else {
        return { error: "Mot de passe incorrect" };
    }
}

export async function logoutAdmin() {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    redirect("/admin/login");
}
