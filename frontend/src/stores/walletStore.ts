import { create } from "zustand";
import type { Wallet } from "../types";

interface WalletState {
  wallet?: Wallet;
  setWallet: (wallet: Wallet) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: undefined,
  setWallet: (wallet) => set({ wallet })
}));
