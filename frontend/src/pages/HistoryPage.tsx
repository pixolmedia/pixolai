import { JobStatus } from "../components/ui/JobStatus";
import { Card } from "../components/ui/Card";
import { useJobs } from "../hooks/usePixolData";
import { formatDate, formatPixol } from "../utils/format";
import { PageTitle } from "./DashboardPage";

export function HistoryPage() {
  const { data = [] } = useJobs();
  return (
    <div>
      <PageTitle title="History" subtitle="All generation jobs, including queued, processing, completed, failed, and cancelled states." />
      <Card className="overflow-hidden">
        <div className="hidden grid-cols-[1fr_140px_140px_120px_160px] border-b border-white/10 px-4 py-3 text-xs font-black uppercase text-slate-500 md:grid">
          <span>Prompt</span><span>Model</span><span>Provider</span><span>Cost</span><span>Status</span>
        </div>
        {data.map((job) => (
          <div key={job.id} className="grid gap-3 border-b border-white/10 px-4 py-4 text-sm last:border-b-0 md:grid-cols-[1fr_140px_140px_120px_160px] md:items-center">
            <div><p className="font-bold">{job.prompt}</p><p className="mt-1 text-xs text-slate-500">{formatDate(job.createdAt)}</p></div>
            <span className="text-slate-300">{job.modelId}</span>
            <span className="text-slate-300">{job.providerId}</span>
            <span className="font-black text-pixol">{formatPixol(job.actualCost ?? job.estimatedCost)}</span>
            <div className="flex items-center gap-3"><JobStatus status={job.status} /><span className="text-slate-500">{job.progress}%</span></div>
          </div>
        ))}
      </Card>
    </div>
  );
}
