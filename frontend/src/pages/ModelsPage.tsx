import { ModelCard } from "../components/ModelCard";
import { useModels } from "../hooks/usePixolData";
import { PageTitle } from "./DashboardPage";

export function ModelsPage() {
  const { data = [] } = useModels();
  return (
    <div>
      <PageTitle title="Models" subtitle="Discover model profiles, licenses, capabilities, creator details, ratings, usage, and provider availability." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {data.map((model) => <ModelCard key={model.id} model={model} />)}
      </div>
    </div>
  );
}
