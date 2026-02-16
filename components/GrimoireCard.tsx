"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { PlayCircle, Star, Sparkles, Square, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface GrimoireCardProps {
    course: any;
    index: number;
}

export default function GrimoireCard({ course, index }: GrimoireCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative w-full h-[400px]"
        >
            <Link href={`/watch/${course.id}`} className="block h-full group">
                <div
                    className="relative h-full bg-[#0F1014] border border-white/5 rounded-none overflow-hidden transition-all duration-500 hover:border-blue-500/30 group-hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.15)] flex flex-col"
                >
                    {/* Brand Geometric Adornments - Corner Accents */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/10 group-hover:border-blue-500/50 transition-colors duration-500 z-20"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/10 group-hover:border-purple-500/50 transition-colors duration-500 z-20"></div>

                    {/* Image Container */}
                    <div className="relative aspect-video overflow-hidden">
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1014] via-transparent to-transparent z-10 opacity-80"></div>

                        {/* Fallback image */}
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700">
                            {course.thumbnail_url ? (
                                <Image
                                    src={course.thumbnail_url}
                                    alt={course.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105 group-hover:sepia-[.20] group-hover:brightness-75"
                                />
                            ) : (
                                <div className="flex gap-2 opacity-10">
                                    <Square className="w-12 h-12 stroke-1" />
                                    <Circle className="w-12 h-12 stroke-1" />
                                </div>
                            )}
                        </div>

                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 z-20">
                            {index === 0 && (
                                <span className="text-[10px] font-bold tracking-widest uppercase text-white bg-blue-600/20 backdrop-blur-md px-3 py-1 border border-blue-500/30">
                                    Nouveau
                                </span>
                            )}
                        </div>

                        {/* Play Button - Ghost Style */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                            <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 bg-black/30">
                                <PlayCircle className="w-6 h-6 text-white stroke-1" />
                            </div>
                        </div>
                    </div>

                    {/* Card Content - Minimalist & Modern */}
                    <div className="p-6 relative z-20 flex flex-col flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-[1px] w-6 bg-blue-500/50"></div>
                            <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                                Module {String(index + 1).padStart(2, '0')}
                            </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors uppercase tracking-wide font-sans">
                            {course.title}
                        </h3>

                        <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-light">
                            {course.description || "Découvrez les secrets de cette illusion professionnelle..."}
                        </p>

                        {/* Progress Bar - Gold/Premium */}
                        <div className="mt-auto pt-4 border-t border-white/5">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[9px] text-slate-500 uppercase tracking-widest">Progression</span>
                                <span className="text-xs font-mono text-blue-400">0%</span>
                            </div>
                            <div className="relative h-[2px] w-full bg-slate-800 overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                                    style={{ width: `${Math.random() > 0.5 ? Math.random() * 60 : 0}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
