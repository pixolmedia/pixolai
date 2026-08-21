import type { Wallet } from "../types.js";
import type { WalletProvider } from "./WalletProvider.js";

export class MockWalletProvider implements WalletProvider {
  private balance = 125.4;
  private readonly wallet: Wallet = {
    address: "0x1234fA8E91c0B2dE3aA4578f90bC5678",
    chain: "solana",
    balance: this.balance,
    connected: true
  };

  async connect(): Promise<Wallet> {
    return this.getWallet();
  }

  async getWallet(): Promise<Wallet> {
    return { ...this.wallet, balance: this.balance };
  }

  async getBalance(): Promise<{ balance: number; currency: "PIXOL" }> {
    return { balance: this.balance, currency: "PIXOL" };
  }

  debit(amount: number): void {
    this.balance = Number(Math.max(0, this.balance - amount).toFixed(3));
  }
}
