import { Wallet } from "lucide-react";
import { useWallet } from "../hooks/usePixolData";
import { shortenAddress } from "../utils/format";
import { Button } from "./ui/Button";

export function WalletButton() {
  const { data } = useWallet();
  return (
    <Button variant="secondary" className="whitespace-nowrap">
      <Wallet size={16} />
      {data?.connected ? shortenAddress(data.address) : "Connect wallet"}
    </Button>
  );
}
