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
            className="w-full py-4 bg-[#f5f5f7] hover:bg-white text-black font-semibold rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
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
                <h1 className="text-3xl font-semibold text-[#f5f5f7] tracking-tight">
                    L'Atelier des Magiciens
                </h1>
                <p className="text-[#86868b] mt-3 font-light">Connectez-vous à votre espace membre</p>
            </div>

            <div className="bg-[#1c1c1e] border border-white/5 rounded-[32px] p-8 md:p-10 shadow-2xl relative overflow-hidden">
                <form action={formAction} className="space-y-6 relative">
                    <input type="hidden" name="audience" value="adults" />
                    <input type="hidden" name="redirect" value={redirectUrl} />
                    
                    <div>
                        <label className="block text-sm text-[#86868b] mb-2 font-medium">Identifiant ou Email</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] transition-colors group-focus-within/input:text-[#f5f5f7]" />
                            <input
                                name="identifier"
                                type="text"
                                className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/5 rounded-[16px] focus:ring-1 focus:ring-white/20 focus:border-white/20 focus:outline-none transition-all placeholder:text-[#86868b]/50 text-[#f5f5f7]"
                                placeholder="votre@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="block text-sm text-[#86868b] font-medium">Mot de passe</label>
                            <Link href="/login/forgot-password" className="text-sm text-[#86868b] hover:text-[#f5f5f7] transition-colors font-light">
                                Oublié ?
                            </Link>
                        </div>
                        <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b] transition-colors group-focus-within/input:text-[#f5f5f7]" />
                            <input
                                name="password"
                                type="password"
                                className="w-full pl-12 pr-4 py-4 bg-black/50 border border-white/5 rounded-[16px] focus:ring-1 focus:ring-white/20 focus:border-white/20 focus:outline-none transition-all placeholder:text-[#86868b]/50 text-[#f5f5f7]"
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
                            className="w-5 h-5 rounded-[6px] border-white/10 bg-black/50 text-[#f5f5f7] focus:ring-0 focus:ring-offset-0"
                        />
                        <label htmlFor="remember" className="text-sm text-[#86868b] select-none cursor-pointer font-light">
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
        <div className="min-h-[100dvh] bg-[#000000] text-white flex flex-col p-4 relative overflow-y-auto">
            <div className="flex-1 flex flex-col justify-center items-center w-full max-w-md mx-auto py-8">
                <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-[#86868b]" />}>
                    <LoginFormContent />
                </Suspense>
            </div>
        </div>
    );
}
