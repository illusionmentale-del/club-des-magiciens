"use client";

import { useActionState, Suspense } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock, Mail, AlertCircle } from "lucide-react";
import { loginWithPassword } from "../actions";

// Submit Button Component
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-all shadow-md hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
            {pending ? <Loader2 className="w-6 h-6 animate-spin text-black" /> : <span className="text-lg">Accéder à l'Atelier</span>}
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
                        alt="L'Atelier des Magiciens"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                    L'Atelier des Magiciens
                </h1>
                <p className="text-gray-400 mt-3 font-light">Connectez-vous à votre espace membre</p>
            </div>

            <div className="bg-[#0a0a0a] border border-white/10 rounded-[24px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                <form action={formAction} className="space-y-6 relative">
                    <input type="hidden" name="audience" value="adults" />
                    <input type="hidden" name="redirect" value={redirectUrl} />
                    
                    <div>
                        <label className="block text-sm text-gray-300 mb-2 font-medium">Identifiant ou Email</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within/input:text-brand-purple" />
                            <input
                                name="identifier"
                                type="text"
                                className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl focus:ring-1 focus:ring-brand-purple/50 focus:border-brand-purple focus:outline-none transition-all placeholder:text-gray-600 text-white"
                                placeholder="votre@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="block text-sm text-gray-300 font-medium">Mot de passe</label>
                            <Link href="/login/forgot-password" className="text-sm text-gray-400 hover:text-white transition-colors font-light">
                                Oublié ?
                            </Link>
                        </div>
                        <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within/input:text-brand-purple" />
                            <input
                                name="password"
                                type="password"
                                className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/10 rounded-xl focus:ring-1 focus:ring-brand-purple/50 focus:border-brand-purple focus:outline-none transition-all placeholder:text-gray-600 text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-4">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            className="w-5 h-5 rounded-[6px] border-white/10 bg-black/50 text-brand-purple focus:ring-brand-purple/50 focus:ring-offset-0 focus:ring-1"
                        />
                        <label htmlFor="remember" className="text-sm text-gray-300 select-none cursor-pointer font-light">
                            Rester connecté
                        </label>
                    </div>

                    {state?.error && (
                        <div className="p-4 bg-red-500/10 text-red-400 rounded-[16px] text-sm border border-red-500/20 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {state.error}
                        </div>
                    )}

                    <div className="pt-4">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AdultLoginPage() {
    return (
        <div className="min-h-[100dvh] bg-brand-bg text-white flex flex-col p-4 relative overflow-y-auto">
            {/* Subtle central glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-purple/5 blur-[150px] rounded-full pointer-events-none fixed"></div>
            
            <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto py-8">
                <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-gray-400" />}>
                    <LoginFormContent />
                </Suspense>
            </div>
        </div>
    );
}
