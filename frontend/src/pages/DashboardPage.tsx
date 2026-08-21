import { Activity, BadgeDollarSign, CheckCircle2, Star } from "lucide-react";
import { GenerationCard } from "../components/GenerationCard";
import { Card } from "../components/ui/Card";
import { useDashboard } from "../hooks/usePixolData";
import { formatPixol } from "../utils/format";

export function DashboardPage() {
  const { data } = useDashboard();
  const stats = [
    { label: "Total generations", value: data?.totalGenerations ?? 0, icon: Activity },
    { label: "PIXOL spent", value: formatPixol(data?.pixolSpent ?? 0), icon: BadgeDollarSign },
    { label: "Favorite model", value: data?.favoriteModel ?? "-", icon: Star },
    { label: "Success rate", value: `${data?.successRate ?? 0}%`, icon: CheckCircle2 }
  ];

  return (
    <div>
      <PageTitle title="Dashboard" subtitle="A compact operating view of generations, spend, favorites, and recent output." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-5">
              <Icon className="mb-6 text-pixol" size={26} />
              <p className="text-sm font-bold text-slate-500">{stat.label}</p>
              <p className="mt-2 text-2xl font-black">{stat.value}</p>
            </Card>
          );
        })}
      </div>
      <h2 className="mb-4 mt-8 text-2xl font-black">Recent creations</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(data?.recentCreations ?? []).map((job) => <GenerationCard key={job.id} item={job} />)}
      </div>
    </div>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-black uppercase text-pixol">PIXOL</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight lg:text-5xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-slate-400">{subtitle}</p>
    </div>
  );
}
