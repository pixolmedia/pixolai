import { Wallet } from "lucide-react";
import { Card } from "../components/ui/Card";
import { useWallet } from "../hooks/usePixolData";
import { formatPixol, shortenAddress } from "../utils/format";
import { PageTitle } from "./DashboardPage";

export function WalletPage() {
  const { data } = useWallet();
  return (
    <div>
      <PageTitle title="Wallet" subtitle="A Web3-ready wallet interface powered by a mock provider for local development." />
      <Card className="max-w-xl p-6">
        <Wallet className="mb-6 text-pixol" size={34} />
        <p className="text-sm font-bold uppercase text-slate-500">Wallet</p>
        <p className="mt-2 text-2xl font-black">{data ? shortenAddress(data.address) : "Not connected"}</p>
        <p className="mt-6 text-sm font-bold uppercase text-slate-500">PIXOL Balance</p>
        <p className="mt-2 text-4xl font-black text-pixol">{formatPixol(data?.balance ?? 0)}</p>
      </Card>
    </div>
  );
}
