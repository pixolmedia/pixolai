import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`rounded-lg border border-white/10 bg-white/[0.06] shadow-panel backdrop-blur ${className}`} {...props}>
      {children}
    </div>
  );
}
