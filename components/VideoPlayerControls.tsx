"use client";

import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface VideoPlayerControlsProps {
    videoId: string;
    courseId: string;
    isCompleted: boolean;
    theme?: "adults" | "kids";
}

export default function VideoPlayerControls({ videoId, courseId, isCompleted: initialStatus, theme = "adults" }: VideoPlayerControlsProps) {
    const [isCompleted, setIsCompleted] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const toggleCompletion = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (isCompleted) {
                // Unmark
                await supabase
                    .from("user_progress")
                    .delete()
                    .eq("user_id", user.id)
                    .eq("video_id", videoId);
                setIsCompleted(false);
            } else {
                // Mark as complete
                await supabase
                    .from("user_progress")
                    .insert({
                        user_id: user.id,
                        video_id: videoId,
                        course_id: courseId,
                        is_completed: true,
                        last_watched_at: new Date().toISOString()
                    });
                setIsCompleted(true);
            }
            router.refresh(); // Refresh server components to update sidebar
        } catch (error) {
            console.error("Error toggling completion:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-4 py-4 border-b border-white/10 mb-4">
            <button
                onClick={toggleCompletion}
                disabled={isLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-lg ${theme === "kids"
                        ? isCompleted
                            ? "bg-gradient-to-r from-brand-purple/20 to-blue-500/20 text-brand-purple border border-brand-purple/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                            : "bg-[#111] text-white border border-white/10 hover:border-brand-purple/50 hover:text-brand-purple hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        : isCompleted
                            ? "bg-gradient-to-r from-magic-gold/20 to-orange-500/20 text-magic-gold border border-magic-gold/50 shadow-[0_0_20px_rgba(238,195,67,0.2)]"
                            : "bg-[#111] text-white border border-white/10 hover:border-magic-gold/50 hover:text-magic-gold hover:shadow-[0_0_15px_rgba(238,195,67,0.15)]"
                    }`}
            >
                {isLoading ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                ) : (
                    <Circle className="w-5 h-5" />
                )}
                {isCompleted ? "Terminé" : "Marquer comme terminé"}
            </button>
        </div>
    );
}
