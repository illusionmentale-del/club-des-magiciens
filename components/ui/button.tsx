import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "magical"
    size?: "default" | "sm" | "lg"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
                    {
                        "bg-white text-black hover:bg-gray-200": variant === "default",
                        "border border-white/20 bg-transparent hover:bg-white/10 hover:text-white": variant === "outline",
                        "hover:bg-white/10 hover:text-white": variant === "ghost",
                        "bg-magic-purple text-white hover:bg-magic-purple/80 shadow-[0_0_15px_rgba(124,58,237,0.5)] border border-white/10 transition-all duration-300 hover:scale-105": variant === "magical",
                        "h-9 px-4 py-2": size === "default",
                        "h-8 rounded-md px-3 text-xs": size === "sm",
                        "h-10 rounded-md px-8": size === "lg",
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
