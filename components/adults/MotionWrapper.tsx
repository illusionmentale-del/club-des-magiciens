"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    delay?: number;
    className?: string;
}

export function FadeInUp({ children, delay = 0, className, ...props }: MotionWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }} // Apple-like custom ease curve
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function FadeIn({ children, delay = 0, className, ...props }: MotionWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay, ease: "easeOut" }}
            className={className}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function BentoHoverEffect({ children, className, ...props }: MotionWrapperProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full h-full cursor-pointer ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
}
