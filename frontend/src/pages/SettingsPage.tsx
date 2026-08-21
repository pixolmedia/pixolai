import { Card } from "../components/ui/Card";
import { PageTitle } from "./DashboardPage";

export function SettingsPage() {
  return (
    <div>
      <PageTitle title="Settings" subtitle="Mock mode, future inference protocol integration, wallet strategy, and generation defaults." />
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5"><h2 className="text-xl font-black">Inference protocol mode</h2><p className="mt-2 text-slate-400">Current provider: MockInferenceProtocolProvider. Future integrations can replace this boundary without changing the app surface.</p></Card>
        <Card className="p-5"><h2 className="text-xl font-black">ComfyUI</h2><p className="mt-2 text-slate-400">ComfyUIAdapter is prepared in the backend and remains optional. It is not required for frontend operation.</p></Card>
      </div>
    </div>
  );
}
