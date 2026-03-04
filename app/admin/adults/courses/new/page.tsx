import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CourseForm from "@/components/admin/CourseForm";

export default function NewCoursePage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <header>
                <Link href="/admin" className="text-gray-400 hover:text-white flex items-center gap-2 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </Link>
                <h1 className="text-3xl font-serif text-white">Créer un nouveau cours</h1>
                <p className="text-gray-400">Remplissez les informations ci-dessous pour créer une nouvelle formation.</p>
            </header>

            <CourseForm />
        </div>
    );
}
