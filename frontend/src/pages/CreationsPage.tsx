import { useState } from "react";
import { GenerationCard } from "../components/GenerationCard";
import { Modal } from "../components/ui/Modal";
import { useGallery } from "../hooks/usePixolData";
import type { GalleryItem } from "../types";
import { formatDate, formatPixol } from "../utils/format";
import { PageTitle } from "./DashboardPage";

export function CreationsPage() {
  const { data = [] } = useGallery();
  const [selected, setSelected] = useState<GalleryItem>();

  return (
    <div>
      <PageTitle title="My Creations" subtitle="Your completed generations with prompt, model, provider, cost, download, regenerate, use prompt, and delete actions." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.map((item) => <GenerationCard key={item.id} item={item} onOpen={() => setSelected(item)} />)}
      </div>
      {selected ? (
        <Modal title="Generation details" onClose={() => setSelected(undefined)}>
          <img className="mb-4 aspect-[16/10] w-full rounded-lg object-cover" src={selected.resultUrl} alt={selected.prompt} />
          <div className="grid gap-3 text-sm md:grid-cols-2">
            <Detail label="Prompt" value={selected.prompt} />
            <Detail label="Model" value={selected.model?.name ?? selected.modelId} />
            <Detail label="Provider" value={selected.provider?.name ?? selected.providerId} />
            <Detail label="Cost" value={formatPixol(selected.actualCost ?? selected.estimatedCost)} />
            <Detail label="Generation date" value={formatDate(selected.createdAt)} />
          </div>
        </Modal>
      ) : null}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-white/[0.05] p-3"><p className="text-slate-500">{label}</p><p className="font-bold">{value}</p></div>;
}
