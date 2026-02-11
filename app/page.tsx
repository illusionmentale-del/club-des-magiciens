"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-magic-purple/20 via-magic-bg to-magic-bg relative overflow-hidden">
      {/* Noise overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center text-center space-y-8 max-w-2xl"
      >
        <div className="space-y-2">
          <h2 className="text-magic-gold text-sm tracking-[0.2em] uppercase font-sans font-semibold">Bienvenue dans le cercle</h2>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 drop-shadow-2xl">
            Le Club des<br />Magiciens
          </h1>
        </div>

        <p className="text-lg md:text-xl text-gray-400 max-w-lg font-sans leading-relaxed">
          Découvrez les secrets les mieux gardés. Une expérience d'apprentissage unique pour les passionnés de l'art magique.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="magical" size="lg" className="w-full font-serif tracking-wide text-lg h-12">
              Espace Membre
            </Button>
          </Link>
          <Link href="/pricing" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full font-serif tracking-wide text-lg border-magic-gold/30 text-magic-gold hover:bg-magic-gold/10 h-12">
              Rejoindre le Club
            </Button>
          </Link>
        </div>
      </motion.div>

      <footer className="absolute bottom-8 text-white/20 text-sm font-sans z-10">
        © {new Date().getFullYear()} Club des Magiciens. All rights reserved.
      </footer>
    </div>
  );
}
