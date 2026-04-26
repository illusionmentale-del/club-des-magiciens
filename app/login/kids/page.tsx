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
            className="relative overflow-hidden w-full bg-brand-purple hover:bg-brand-purple/80 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] flex justify-center items-center mt-2 disabled:opacity-75 disabled:cursor-wait uppercase tracking-widest"
        >
            {/* Shimmer Effect */}
            {!pending && (
                <div className="absolute inset-0 -translate-x-[150%] animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
            )}
            
            {pending ? (
                <>
                    <span className="text-[15px]">Connexion...</span>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin ml-2"></span>
                </>
            ) : (
                <span className="text-[15px]">Entrer dans le Club</span>
            )}
        </button>
    );
}

function LoginFormContent() {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "";

    // Server Action State for Password Login
    // @ts-ignore
    const [state, formAction] = useActionState(loginWithPassword, null);

    return (
        <div className="w-full max-w-md z-10">
            <div className="text-center mb-10 relative">
                <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 border border-white/10 bg-white/5 rounded-full text-white/80 text-[10px] font-medium tracking-[0.2em] uppercase backdrop-blur-xl shadow-sm mb-6 cursor-default">
                    <Sparkles className="w-3 h-3 text-white/70" />
                    Le Club des Petits Magiciens
                </div>
                
                <h1 className="relative z-10 text-5xl md:text-6xl font-bold tracking-tighter text-white leading-[1.1] mb-4">
                    Bienvenue au <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-purple-400">Club</span>
                </h1>
                
                <p className="text-xl text-gray-400 font-light">Prêt à découvrir les secrets de la semaine ?</p>
            </div>

            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[24px] p-8 md:p-10 shadow-2xl overflow-hidden">
                <form action={formAction} className="space-y-6 relative">
                    <input type="hidden" name="audience" value="kids" />
                    <input type="hidden" name="redirect" value={redirectUrl} />

                    <div className="space-y-1">
                        <label className="text-brand-text-muted text-sm font-medium">Ton adresse e-mail de connexion</label>
                        <div className="relative group/input">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-transform group-focus-within/input:text-brand-purple" />
                            <input
                                name="identifier"
                                type="text"
                                className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 focus:outline-none transition-colors placeholder:text-gray-600 text-white"
                                placeholder="Ex: parent@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between items-center">
                            <label className="text-brand-text-muted text-sm font-medium">Mot de passe secret</label>
                            <Link href="/login/forgot-password" title="Récupérer mon accès" className="text-[11px] font-medium text-gray-400 hover:text-white transition-colors">
                                Oublié ?
                            </Link>
                        </div>
                        <div className="relative group/input">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 transition-transform group-focus-within/input:text-brand-purple" />
                            <input
                                name="password"
                                type="password"
                                className="w-full pl-12 pr-4 py-3 bg-black/50 border border-white/10 rounded-xl focus:border-brand-purple focus:ring-1 focus:ring-brand-purple/50 focus:outline-none transition-colors placeholder:text-gray-600 text-white"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="remember"
                            name="remember"
                            className="w-4 h-4 rounded-[4px] border-white/20 bg-black text-brand-purple focus:ring-brand-purple focus:ring-offset-black transition-all cursor-pointer"
                        />
                        <label htmlFor="remember" className="text-[13px] text-gray-300 font-light cursor-pointer select-none">
                            Rester connecté
                        </label>
                    </div>

                    {state?.error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
                            <AlertCircle className="w-4 h-4 inline-block mr-2 -mt-0.5" />
                            {state.error}
                        </div>
                    )}

                    <SubmitButton />
                </form>
            </div>

            <div className="text-center mt-8">
                <a 
                    href="mailto:contact@clubdespetitsmagiciens.fr?subject=Besoin%20d'aide%20-%20Club%20des%20petits%20magiciens" 
                    className="text-sm font-bold text-brand-text-muted hover:text-brand-purple transition-colors inline-block"
                >
                    Besoin d'aide ? Clique ici (réponse sous 24h) 🧙‍♂️
                </a>
            </div>
        </div>
    );
}

export default function KidsLoginPage() {
    return (
        <div className="min-h-screen bg-brand-bg text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Colorful Background Elements for Kids */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-purple/5 blur-[120px] rounded-full mix-blend-screen translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-purple/10 blur-[100px] rounded-full mix-blend-screen -translate-x-1/3 translate-y-1/3"></div>
            </div>

            <Suspense fallback={<Loader2 className="w-12 h-12 animate-spin text-brand-purple z-10" />}>
                <LoginFormContent />
            </Suspense>
        </div>
    );
}
