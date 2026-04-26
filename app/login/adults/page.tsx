"use client";

import { useActionState, Suspense } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock, Mail, AlertCircle, Sparkles } from "lucide-react";
import { loginWithPassword } from "../actions";

// Submit Button Component
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-gradient-to-r from-brand-blue to-cyan-500 hover:scale-[1.02] text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:shadow-brand-blue/50 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
        >
            {pending ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="text-lg">Accéder à l'Atelier</span>}
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
            <div className="text-center mb-10 relative">
                <div className="relative z-10 inline-flex items-center gap-2 px-5 py-2 border border-brand-blue/30 bg-brand-blue/5 rounded-full text-brand-blue text-[11px] font-bold tracking-[0.2em] uppercase backdrop-blur-xl shadow-[0_0_20px_rgba(59,130,246,0.15)] mb-6 cursor-default">
                    <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                    L'Atelier des Magiciens
                </div>
                
                <h1 className="relative z-10 text-5xl md:text-6xl font-bold tracking-tighter text-white leading-[1.1] mb-4">
                    Bienvenue à <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">l'Atelier</span>
                </h1>
                
                <p className="text-xl text-gray-400 font-light">Prêt à perfectionner votre art ?</p>
            </div>

            <div className="bg-brand-card border-2 border-brand-blue/30 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/5 to-cyan-400/5 pointer-events-none"></div>

                <form action={formAction} className="space-y-6 relative">
                    <input type="hidden" name="audience" value="adults" />
                    <input type="hidden" name="redirect" value={redirectUrl} />

                    <div className="space-y-2">
                        <label className="block text-xs font-black uppercase tracking-widest text-brand-blue ml-1">Identifiant ou Email</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-blue transition-transform group-focus-within/input:scale-110" />
                            <input
                                name="identifier"
                                type="text"
                                className="w-full pl-12 pr-4 py-4 bg-brand-bg/50 border-2 border-brand-border rounded-2xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 focus:outline-none transition-all placeholder:text-gray-500 font-bold text-lg"
                                placeholder="votre@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center ml-1">
                            <label className="block text-xs font-black uppercase tracking-widest text-brand-blue">Mot de passe</label>
                            <Link href="/login/forgot-password" title="Récupérer mon accès" className="text-[10px] font-black uppercase tracking-wider text-cyan-400 hover:text-brand-blue transition-colors">
                                Oublié ?
                            </Link>
                        </div>
                        <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-blue transition-transform group-focus-within/input:scale-110" />
                            <input
                                name="password"
                                type="password"
                                className="w-full pl-12 pr-4 py-4 bg-brand-bg/50 border-2 border-brand-border rounded-2xl focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/20 focus:outline-none transition-all placeholder:text-gray-500 font-bold text-lg"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-1">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            className="w-5 h-5 rounded border-2 border-brand-blue/50 bg-brand-bg/50 text-brand-blue focus:ring-brand-blue/20 focus:ring-4 focus:outline-none transition-all cursor-pointer accent-brand-blue"
                        />
                        <label htmlFor="remember" className="text-xs font-black uppercase tracking-widest text-brand-blue cursor-pointer select-none">
                            Rester connecté
                        </label>
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
        </div>
    );
}

export default function AdultLoginPage() {
    return (
        <div className="min-h-[100dvh] bg-brand-bg text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Colorful Background Elements for Adults */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>

            <Suspense fallback={<Loader2 className="w-12 h-12 animate-spin text-brand-blue z-10" />}>
                <LoginFormContent />
            </Suspense>
        </div>
    );
}
