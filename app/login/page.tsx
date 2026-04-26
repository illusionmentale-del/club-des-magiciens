"use client";

import { useActionState, Suspense } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock, User, ArrowRight, AlertCircle } from "lucide-react"; // Added AlertCircle
import { loginWithPassword } from "./actions";

// Submit Button Component
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-3.5 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
            {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2">Se connecter <ArrowRight className="w-4 h-4" /></span>}
        </button>
    );
}

function LoginFormContent() {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/dashboard";

    // Server Action State for Password Login
    // @ts-ignore
    const [state, formAction] = useActionState(loginWithPassword, null);

    return (
        <div className="w-full max-w-md z-10">
            <div className="text-center mb-10">
                <div className="relative w-40 h-20 mx-auto mb-6">
                    <Image
                        src="/logo.png"
                        alt="Club des Magiciens"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-[24px] p-8 shadow-2xl relative overflow-hidden">
                <h2 className="text-2xl font-bold text-center mb-8">Connexion</h2>

                <form action={formAction} className="space-y-6">
                    <input type="hidden" name="redirect" value={redirectUrl} />
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Identifiant ou Email</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                name="identifier"
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 focus:outline-none transition-all placeholder:text-gray-600 text-white"
                                placeholder="lemagicien"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-300">Mot de passe</label>
                            <Link href="/forgot-password" className="text-xs text-gray-400 hover:text-white transition-colors">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                name="password"
                                type="password"
                                className="w-full pl-10 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 focus:outline-none transition-all placeholder:text-gray-600 text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            className="w-4 h-4 rounded border-white/10 bg-black text-white focus:ring-white focus:ring-offset-black"
                        />
                        <label htmlFor="remember" className="text-sm text-gray-300 select-none cursor-pointer">
                            Rester connecté
                        </label>
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-500/10 text-red-400 rounded-lg text-sm border border-red-500/20 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {state.error}
                        </div>
                    )}

                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-[100dvh] bg-brand-bg text-white flex flex-col p-4 relative overflow-y-auto">
            {/* Subtle central glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/5 blur-[150px] rounded-full pointer-events-none fixed"></div>

            <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto py-8">
                <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-magic-purple" />}>
                    <LoginFormContent />
                </Suspense>
            </div>
        </div>
    );
}
