export interface ComfyPromptRequest {
  prompt: string;
  workflow: Record<string, unknown>;
}

export class ComfyUIAdapter {
  constructor(private readonly baseUrl?: string) {}

  async submitPrompt(_request: ComfyPromptRequest): Promise<{ promptId: string }> {
    if (!this.baseUrl) {
      throw new Error("COMFYUI_URL is not configured");
    }

    throw new Error("ComfyUI integration is prepared but not enabled in the MVP");
  }
}
