import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlayCircle } from "lucide-react";

export default async function ProgramPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // TODO: Identify the "Main Course" (e.g. by a specific tag or ID)
    // For now, we fetch the first course that is NOT a "product" or just the first one.
    // Ideally, we should have a 'is_main_program' flag or similar. 
    // Let's assume the first course created or a specific one is the main program.

    // TEMPORARY: Just listing all courses but presenting them as "The Program"
    // In the future, this should redirect to /watch/[MAIN_COURSE_ID]

    const { data: courses } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: true }) // Oldest first (Main program usually created first?)
        .limit(1)
        .single();


    if (courses) {
        redirect(`/watch/${courses.id}`);
    }

    return (
        <div className="text-white p-8">
            <h1 className="text-3xl font-bold mb-4">Mon Programme</h1>
            <p>Aucun programme principal trouvé. Contactez l'administrateur.</p>
        </div>
    );
}
