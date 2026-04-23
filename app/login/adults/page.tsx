"use client";

import { useActionState, Suspense } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { loginWithPassword } from "../actions";

// Submit Button Component
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:scale-[1.02] text-black font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
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
                        className="object-contain drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                        priority
                    />
                </div>
                <h1 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-600 tracking-wider">
                    L'Atelier des Magiciens
                </h1>
                <p className="text-gray-400 mt-2">Connectez-vous à votre espace membre</p>
            </div>

            <div className="bg-[#0f0f13] border border-white/5 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
                
                <form action={formAction} className="space-y-6 relative">
                    <input type="hidden" name="audience" value="adults" />
                    <input type="hidden" name="redirect" value={redirectUrl} />
                    
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-amber-500/80 mb-2 font-semibold">Identifiant ou Email</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within/input:text-amber-500" />
                            <input
                                name="identifier"
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder:text-gray-600 text-white"
                                placeholder="votre@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="block text-xs uppercase tracking-widest text-amber-500/80 font-semibold">Mot de passe</label>
                            <Link href="/login/forgot-password" className="text-xs text-amber-500 hover:text-amber-400 transition-colors">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                        <div className="relative group/input">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-colors group-focus-within/input:text-amber-500" />
                            <input
                                name="password"
                                type="password"
                                className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all placeholder:text-gray-600 text-white"
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
                            className="w-4 h-4 rounded border-white/20 bg-black/40 text-amber-500 focus:ring-amber-500"
                        />
                        <label htmlFor="remember" className="text-sm text-gray-400 select-none cursor-pointer">
                            Rester connecté
                        </label>
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-500/10 text-red-400 rounded-lg text-sm border border-red-500/20 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {state.error}
                        </div>
                    )}

                    <SubmitButton />
                </form>
            </div>
        </div>
    );
}

export default function AdultLoginPage() {
    return (
        <div className="min-h-[100dvh] bg-[#050507] text-white flex flex-col p-4 relative overflow-y-auto">
            {/* Ambient Background */}
            <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen"></div>
            
            <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto py-8">
                <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-amber-500" />}>
                    <LoginFormContent />
                </Suspense>
            </div>
        </div>
    );
}
