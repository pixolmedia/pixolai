import type { Wallet } from "../types.js";

export interface WalletProvider {
  connect(): Promise<Wallet>;
  getWallet(): Promise<Wallet>;
  getBalance(): Promise<{ balance: number; currency: "PIXOL" }>;
}
