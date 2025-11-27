import type { CreateAiBrainInput, UpdateAiBrainInput } from "./ai-brain.types.js";
import { orchestrateAI, makeCacheKey } from "../../core/ai/aiOrchestrator.js";
import { insightsPrompt } from "../../core/ai/promptTemplates.js";

export const ai_brainService = {
  async list() {
    // TODO: fetch list via Prisma
    return [];
  },

  async getById(id: string) {
    // TODO: fetch by id
    return { id } as unknown;
  },

  async create(input: CreateAiBrainInput) {
    // TODO: create record
    return { id: `new-ai-brain-id`, ...input } as unknown;
  },

  async update(id: string, input: UpdateAiBrainInput) {
    // TODO: update record
    return { id, ...input } as unknown;
  },

  async remove(id: string) {
    // TODO: delete record
    return { id };
  },
};

export const aiBrainInsightsService = {
  async summarize(payload: { brandName: string; highlights: string }) {
    const prompt = insightsPrompt(payload);
    const cacheKey = makeCacheKey("ai-insights", payload);
    const response = await orchestrateAI({
      key: cacheKey,
      prompt,
      fallback: () => ({
        pricingHealth: "Stable",
        marketingSummary: "No AI available, using fallback",
        inventoryRisk: "Unknown",
        nextActions: ["Review pricing weekly", "Launch one campaign"],
      }),
    });
    return response.result;
  },
};
