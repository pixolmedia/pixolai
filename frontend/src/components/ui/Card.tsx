import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <div className={`glass-soft rounded-lg text-slate-950 ${className}`} {...props}>
      {children}
    </div>
  );
}
