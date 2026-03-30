"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

export function Card({ 
  className, 
  variant = 'default', 
  children, 
  animate = true,
  initial,
  whileHover,
  transition,
  ...props 
}) {
  const variants = {
    default: "bg-white text-slate-950 border border-slate-200 shadow-sm",
    glass: "bg-white/40 backdrop-blur-md border border-white/20 shadow-md",
    indigo: "bg-[#1e293b] text-white border-slate-700 shadow-lg",
  };

  const Component = animate ? motion.div : 'div';

  // Only pass these to Component if it's a motion component
  const animationProps = animate ? {
    initial: initial || { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    whileHover: whileHover || { y: -4, transition: { duration: 0.2 } },
    transition: transition
  } : {};

  return (
    <Component
      {...animationProps}
      className={cn(
        "rounded-2xl p-6 transition-all",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
