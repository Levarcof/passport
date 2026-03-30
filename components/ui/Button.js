"use client";

import { cn } from "@/utils/cn";

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  disabled, 
  children, 
  ...props 
}) {
  const variants = {
    primary: "bg-slate-900 text-slate-50 shadow-sm hover:bg-slate-800",
    secondary: "bg-white text-slate-900 border border-slate-200 shadow-sm hover:bg-slate-50",
    outline: "bg-transparent text-slate-900 border border-slate-200 hover:bg-slate-50",
    ghost: "bg-transparent text-slate-900 hover:bg-slate-100",
    danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs font-medium rounded-lg",
    md: "px-4 py-2.5 text-sm font-semibold rounded-xl",
    lg: "px-6 py-3.5 text-base font-semibold rounded-2xl",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
