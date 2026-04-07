"use client";

import Link, { LinkProps } from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AnimatedLinkProps extends LinkProps {
    className?: string;
    children: React.ReactNode;
}

export default function AnimatedLink({ href, className, children, ...props }: AnimatedLinkProps) {
    const [isPending, setIsPending] = useState(false);

    return (
        <Link 
            href={href} 
            className={`inline-flex items-center justify-center transition-all ${className} ${isPending ? 'opacity-60 scale-95 pointer-events-none' : ''}`}
            onClick={(e) => {
                // S'il s'agit d'un lien vers une autre page (pas un simple #), on affiche le loader
                if (typeof href === 'string' && !href.startsWith('#')) {
                    setIsPending(true);
                    
                    // Fallback : si la navigation est très rapide ou échoue silencieusement, on retire le loader après 5s
                    setTimeout(() => setIsPending(false), 5000);
                }
            }}
            {...props}
        >
            {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {children}
        </Link>
    );
}
