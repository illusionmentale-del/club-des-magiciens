"use client";

import { CheckCircle2, Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BentoHoverEffect } from "./MotionWrapper";

type LibraryProgress = {
    course_id: string;
    completed_at: string;
    courses: {
        title: string;
    } | null;
};

export default function AdultAchievements({ recentValids }: { recentValids: any[] }) {
    if (!recentValids || recentValids.length === 0) return null;

    return (
        <section className="bg-[#1c1c1e] rounded-[32px] p-8 border border-white/5 shadow-xl">
            <h3 className="text-xl font-semibold text-white tracking-tight mb-8 flex items-center gap-3">
                <Trophy className="w-5 h-5 text-brand-purple" />
                Visionnés Récemment
            </h3>

            <div className="space-y-3 mb-8">
                {recentValids.slice(0, 3).map((progress) => (
                    <div key={progress.course_id} className="flex items-start gap-4 p-4 rounded-2xl bg-black/20 hover:bg-[#2c2c2e] transition-colors duration-300 border border-transparent hover:border-white/10 group">
                        <div className="mt-1">
                            <CheckCircle2 className="w-5 h-5 text-brand-purple group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div>
                            <p className="text-base font-medium text-[#f5f5f7] group-hover:text-white transition-colors duration-300 tracking-tight">
                                {progress.courses?.title || "Formation terminée"}
                            </p>
                            <p className="text-sm text-[#86868b] mt-1 font-light">
                                Le {new Date(progress.completed_at).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <BentoHoverEffect>
                <Link href="/dashboard/achievements" className="w-full flex items-center justify-between py-4 px-6 rounded-full border border-white/10 hover:bg-[#2c2c2e] hover:border-white/20 transition-all duration-300 group">
                    <span className="text-sm font-medium text-[#f5f5f7] group-hover:text-white tracking-tight">
                        Mon Journal Magique
                    </span>
                    <ArrowRight className="w-4 h-4 text-brand-purple group-hover:text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </Link>
            </BentoHoverEffect>
        </section>
    );
}
