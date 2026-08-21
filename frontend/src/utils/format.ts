export function formatPixol(value: number): string {
  return `${value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "")} PIXOL`;
}

export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}
