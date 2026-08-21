import { ProviderCard } from "../components/ProviderCard";
import { useProviders } from "../hooks/usePixolData";
import { PageTitle } from "./DashboardPage";

export function ProvidersPage() {
  const { data = [] } = useProviders();
  return (
    <div>
      <PageTitle title="Providers" subtitle="Compare provider reputation, GPU capability, uptime, latency, model availability, and execution history without exposing protocol node internals." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((provider) => <ProviderCard key={provider.id} provider={provider} />)}
      </div>
    </div>
  );
}
