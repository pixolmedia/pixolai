import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GenerationParameters } from "../types";
import type { RuntimeConfig } from "../services/api";

interface InferenceSettingsState {
  initialized: boolean;
  localRuntime: GenerationParameters["localRuntime"];
  localEndpoint: string;
  apiEndpoint: string;
  apiKey: string;
  solaiEndpoint: string;
  initializeFromRuntime: (runtime: RuntimeConfig) => void;
  setLocalRuntime: (runtime: GenerationParameters["localRuntime"]) => void;
  setLocalEndpoint: (endpoint: string) => void;
  setApiEndpoint: (endpoint: string) => void;
  setApiKey: (apiKey: string) => void;
  setSolaiEndpoint: (endpoint: string) => void;
}

export const useInferenceSettingsStore = create<InferenceSettingsState>()(
  persist(
    (set, get) => ({
      initialized: false,
      localRuntime: "ollama",
      localEndpoint: "http://localhost:11434",
      apiEndpoint: "http://localhost:8000/v1",
      apiKey: "",
      solaiEndpoint: "https://api.solai.network",
      initializeFromRuntime: (runtime) => {
        if (get().initialized) {
          return;
        }

        set({
          initialized: true,
          localRuntime: runtime.localInferenceRuntime as GenerationParameters["localRuntime"],
          localEndpoint: runtime.localInferenceUrl,
          apiEndpoint: runtime.compatibleInferenceApiUrl,
          solaiEndpoint: runtime.solaiNetworkApiUrl
        });
      },
      setLocalRuntime: (localRuntime) => set({ localRuntime, initialized: true }),
      setLocalEndpoint: (localEndpoint) => set({ localEndpoint, initialized: true }),
      setApiEndpoint: (apiEndpoint) => set({ apiEndpoint, initialized: true }),
      setApiKey: (apiKey) => set({ apiKey, initialized: true }),
      setSolaiEndpoint: (solaiEndpoint) => set({ solaiEndpoint, initialized: true })
    }),
    {
      name: "pixolai-inference-settings"
    }
  )
);
