"use client";

import { useFormState, useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Loader2, Lock, User, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { loginWithPassword } from "../actions";

// Submit Button Component
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-gradient-to-r from-brand-purple to-brand-blue hover:scale-[1.02] text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:shadow-brand-purple/50 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
            {pending ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="flex items-center gap-2 text-lg">Ouvrir le Grimoire <ArrowRight className="w-5 h-5" /></span>}
        </button>
    );
}

export default function KidsLoginPage() {
    // Server Action State for Password Login
    // @ts-ignore
    const [state, formAction] = useFormState(loginWithPassword, null);

    return (
        <div className="min-h-screen bg-brand-bg text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Colorful Background Elements for Kids */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-purple/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8 relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                        <Sparkles className="w-12 h-12 text-brand-gold animate-bounce-slow" />
                    </div>
                    <div className="relative w-48 h-24 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                        <Image
                            src="/logo.png"
                            alt="Club des Petits Magiciens"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-blue uppercase tracking-tighter drop-shadow-sm">
                        Club des Petits Magiciens
                    </h1>
                    <p className="text-brand-text-muted font-bold mt-2">Connecte-toi pour apprendre la magie !</p>
                </div>

                <div className="bg-brand-card border-2 border-brand-purple/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-brand-blue/5 pointer-events-none"></div>

                    <form action={formAction} className="space-y-6 relative">
                        <input type="hidden" name="audience" value="kids" />

                        <div className="space-y-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-brand-purple ml-1">Ton Nom de Magicien</label>
                            <div className="relative group/input">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-purple transition-transform group-focus-within/input:scale-110" />
                                <input
                                    name="identifier"
                                    type="text"
                                    className="w-full pl-12 pr-4 py-4 bg-brand-bg/50 border-2 border-brand-border rounded-2xl focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/20 focus:outline-none transition-all placeholder:text-gray-500 font-bold text-lg"
                                    placeholder="Ex: Merlin"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="block text-xs font-black uppercase tracking-widest text-brand-purple">Mot de passe secret</label>
                            </div>
                            <div className="relative group/input">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-purple transition-transform group-focus-within/input:scale-110" />
                                <input
                                    name="password"
                                    type="password"
                                    className="w-full pl-12 pr-4 py-4 bg-brand-bg/50 border-2 border-brand-border rounded-2xl focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/20 focus:outline-none transition-all placeholder:text-gray-500 font-bold text-lg"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="p-4 bg-red-500/20 text-red-300 rounded-2xl text-sm border-2 border-red-500/30 flex items-center gap-3 font-bold animate-shake">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {state.error}
                            </div>
                        )}

                        <SubmitButton />
                    </form>
                </div>

                <p className="text-center mt-8 text-sm text-brand-text-muted font-medium">
                    Besoin d'aide ? Demande à tes parents ! 🧙‍♂️
                </p>
            </div>
        </div>
    );
}
