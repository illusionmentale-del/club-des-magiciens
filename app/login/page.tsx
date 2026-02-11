import { Button } from "@/components/ui/button"
import { login } from "./actions"

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-magic-bg relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

            <div className="w-full max-w-md space-y-8 z-10 bg-magic-card/50 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
                <div className="text-center space-y-2">
                    <h1 className="font-serif text-3xl text-white">Connexion</h1>
                    <p className="text-gray-400 font-sans text-sm">Entre ton email pour recevoir ton lien magique.</p>
                </div>

                <form className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="houdini@magic.com"
                            required
                            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-md text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-magic-purple/50 focus:border-magic-purple transition-all"
                        />
                    </div>
                    <Button formAction={login} variant="magical" className="w-full">
                        Envoyer le lien magique
                    </Button>
                </form>
            </div>
        </div>
    )
}
