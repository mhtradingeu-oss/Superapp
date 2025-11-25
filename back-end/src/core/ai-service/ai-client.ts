// Placeholder AI client to be wired to actual providers later.
export type AIRequest = {
  prompt: string;
  agent?: string;
};

export async function runAIRequest(_input: AIRequest) {
  return {
    result: "TODO: Connect to AI provider",
  };
}
