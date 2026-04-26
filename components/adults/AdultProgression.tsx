"use client";

import Link from "next/link";
import { Award } from "lucide-react";
import { BentoHoverEffect } from "./MotionWrapper";

type AdultProgressionProps = {
    validatedCount: number;
    totalCourses: number;
};

export default function AdultProgression({
    validatedCount,
    totalCourses,
}: AdultProgressionProps) {

    const progressPercentage = totalCourses > 0 ? Math.min((validatedCount / totalCourses) * 100, 100) : 0;

    return (
        <BentoHoverEffect>
            <section className="bg-[#1c1c1e] rounded-[32px] p-8 border border-white/5 shadow-xl sticky top-8 flex flex-col justify-between min-h-[300px]">
                <h3 className="text-xl font-semibold flex items-center gap-3 text-white tracking-tight mb-8">
                    <Award className="w-5 h-5 text-brand-purple" />
                    Progression Globale
                </h3>

                <div className="flex-1 flex flex-col justify-center">
                    <div className="mb-8">
                        <div className="text-6xl font-semibold tracking-tighter text-[#f5f5f7] mb-1">
                            {validatedCount} <span className="text-2xl text-[#86868b] font-light">/ {totalCourses}</span>
                        </div>
                        <div className="text-sm font-medium text-[#86868b] uppercase tracking-widest">Modules Validés</div>
                    </div>

                    <div className="relative h-1.5 w-full bg-black rounded-full overflow-hidden mb-6">
                        <div
                            className="absolute top-0 left-0 h-full bg-brand-purple transition-all duration-1000 ease-[0.16,1,0.3,1]"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <Link href="/dashboard/library" className="block w-full text-center py-4 text-sm font-medium text-white bg-brand-purple hover:bg-indigo-500 shadow-lg shadow-brand-purple/20 rounded-full transition-all shadow-md hover:shadow-lg">
                    Reprendre ma session
                </Link>
            </section>
        </BentoHoverEffect>
    );
}
