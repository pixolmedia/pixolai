import { X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./Button";

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4">
      <div className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#0b1513] p-5 shadow-panel">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-black">{title}</h2>
          <Button variant="ghost" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
