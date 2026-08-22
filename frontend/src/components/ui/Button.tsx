import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-sky-500 via-blue-500 to-violet-600 text-white shadow-[0_18px_44px_rgba(71,139,255,0.38)] hover:brightness-110",
    secondary: "border border-white/45 bg-white/[0.28] text-slate-950 backdrop-blur-xl hover:bg-white/[0.42]",
    ghost: "text-slate-700 hover:bg-white/[0.28]",
    danger: "border border-coral/30 bg-coral/10 text-coral hover:bg-coral/20"
  };

  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
