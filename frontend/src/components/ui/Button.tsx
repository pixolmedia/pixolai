import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const variants = {
    primary: "bg-pixol text-ink shadow-[0_16px_40px_rgba(125,255,155,0.2)] hover:bg-[#9dffb3]",
    secondary: "border border-white/10 bg-white/[0.07] text-white hover:bg-white/[0.1]",
    ghost: "text-slate-300 hover:bg-white/[0.07]",
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
