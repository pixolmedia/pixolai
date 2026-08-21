import { GenerationCard } from "../components/GenerationCard";
import { ModelCard } from "../components/ModelCard";
import { ProviderCard } from "../components/ProviderCard";
import { useGallery, useModels, useProviders } from "../hooks/usePixolData";
import { PageTitle } from "./DashboardPage";

export function ExplorePage() {
  const { data: models = [] } = useModels();
  const { data: providers = [] } = useProviders();
  const { data: gallery = [] } = useGallery();
  return (
    <div className="space-y-8">
      <PageTitle title="Explore" subtitle="Discover trending models, popular providers, and latest creations prepared for future community workflows." />
      <section>
        <h2 className="mb-4 text-2xl font-black">Trending models</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {models.slice(0, 3).map((model) => <ModelCard key={model.id} model={model} />)}
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-black">Popular providers</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {providers.slice(0, 3).map((provider) => <ProviderCard key={provider.id} provider={provider} />)}
        </div>
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-black">Latest creations</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {gallery.slice(0, 4).map((item) => <GenerationCard key={item.id} item={item} />)}
        </div>
      </section>
    </div>
  );
}
