"use client";

import { useActionState, Suspense } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock, User, Mail, ArrowRight, AlertCircle, Sparkles } from "lucide-react";
import { registerAccount } from "./actions";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-3.5 bg-white hover:bg-gray-200 text-black font-bold rounded-xl transition-all disabled:opacity-50 flex justify-center items-center gap-2 shadow-[0_4px_14px_0_rgba(255,255,255,0.1)]"
        >
            {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="flex items-center gap-2">Créer mon compte <ArrowRight className="w-4 h-4" /></span>}
        </button>
    );
}

function RegisterFormContent() {
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get("redirect") || "/kids";

    // @ts-ignore
    const [state, formAction] = useActionState(registerAccount, null);

    return (
        <div className="w-full max-w-md z-10">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-white text-xs font-bold uppercase tracking-widest mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    Bienvenue au Club
                </div>
            </div>

            <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-8 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
                <h2 className="text-2xl font-bold text-center mb-2 tracking-tight">Inscription</h2>
                <p className="text-gray-400 text-center mb-8 text-sm">Crée ton compte parent/enfant pour débloquer la magie.</p>

                <form action={formAction} className="space-y-5">
                    <input type="hidden" name="redirect" value={redirectUrl} />

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Prénom de l'enfant (ou Pseudo)</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                name="username"
                                type="text"
                                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition-all placeholder:text-gray-600"
                                placeholder="Ex: Léo Magicien"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email (Parent)</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                name="email"
                                type="email"
                                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition-all placeholder:text-gray-600"
                                placeholder="parent@email.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                name="password"
                                type="password"
                                className="w-full pl-12 pr-4 py-3 bg-black border border-white/10 rounded-xl focus:border-white focus:ring-1 focus:ring-white focus:outline-none transition-all placeholder:text-gray-600"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    {state?.error && (
                        <div className="p-4 bg-red-500/10 text-red-400 rounded-xl text-sm border border-red-500/20 flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {state.error}
                        </div>
                    )}

                    <div className="pt-2">
                        <SubmitButton />
                    </div>
                </form>

                <div className="mt-8 text-center text-sm text-gray-400">
                    Tu as déjà un compte ?{" "}
                    <Link href={`/login?redirect=${encodeURIComponent(redirectUrl)}`} className="text-white font-bold hover:underline">
                        Connecte-toi
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-[100dvh] bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-y-auto">
            {/* Subtle central glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-full max-h-lg bg-white/5 blur-[120px] rounded-full pointer-events-none fixed"></div>

            <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-brand-purple absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />}>
                <RegisterFormContent />
            </Suspense>
        </div>
    );
}
