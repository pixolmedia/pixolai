import { Download, RotateCcw, Trash2, Wand2 } from "lucide-react";
import type { GalleryItem, Job } from "../types";
import { formatDate, formatPixol } from "../utils/format";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { JobStatus } from "./ui/JobStatus";

export function GenerationCard({ item, onOpen, onUsePrompt }: { item: GalleryItem | Job; onOpen?: () => void; onUsePrompt?: () => void }) {
  return (
    <Card className="overflow-hidden">
      {item.resultUrl ? (
        <button className="block aspect-[4/3] w-full bg-slate-900 text-left" onClick={onOpen}>
          <img className="h-full w-full object-cover" src={item.resultUrl} alt={item.prompt} />
        </button>
      ) : (
        <div className="grid aspect-[4/3] place-items-center bg-white/[0.04]">
          <div className="w-2/3">
            <div className="mb-3 flex items-center justify-between"><JobStatus status={item.status} /><span className="text-sm font-black">{item.progress}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-pixol" style={{ width: `${item.progress}%` }} /></div>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <JobStatus status={item.status} />
          <span className="text-sm font-black text-pixol">{formatPixol(item.actualCost ?? item.estimatedCost)}</span>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm text-slate-300">{item.prompt}</p>
        <p className="mt-3 text-xs font-bold text-slate-500">{formatDate(item.createdAt)}</p>
        {onOpen ? (
          <div className="mt-4 grid grid-cols-4 gap-2">
            <Button variant="ghost" onClick={onOpen} aria-label="Open"><Download size={16} /></Button>
            <Button variant="ghost" onClick={onUsePrompt} aria-label="Use prompt"><Wand2 size={16} /></Button>
            <Button variant="ghost" aria-label="Regenerate"><RotateCcw size={16} /></Button>
            <Button variant="danger" aria-label="Delete"><Trash2 size={16} /></Button>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
