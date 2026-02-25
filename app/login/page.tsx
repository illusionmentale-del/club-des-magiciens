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
            className="w-full py-3 bg-magic-purple hover:bg-magic-purple/80 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
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

            <div className="bg-magic-card border border-white/10 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-serif font-bold text-center mb-8">Connexion</h2>

                <form action={formAction} className="space-y-6">
                    <input type="hidden" name="redirect" value={redirectUrl} />
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Identifiant ou Email</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                name="identifier"
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-magic-purple focus:outline-none transition-all placeholder:text-gray-600 focus:bg-black/60"
                                placeholder="lemagicien"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-300">Mot de passe</label>
                            <Link href="/forgot-password" className="text-xs text-magic-purple hover:text-magic-purple/80 transition-colors">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                name="password"
                                type="password"
                                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-magic-purple focus:outline-none transition-all placeholder:text-gray-600 focus:bg-black/60"
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
                            className="w-4 h-4 rounded border-white/20 bg-black/40 text-magic-purple focus:ring-magic-purple"
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
        <div className="min-h-screen bg-magic-bg text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background noise */}
            <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-20 pointer-events-none"></div>

            <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-magic-purple absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}>
                <LoginFormContent />
            </Suspense>
        </div>
    );
}
