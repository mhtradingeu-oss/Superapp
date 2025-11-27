import { runAIRequest } from "../../core/ai-service/ai-client.js";
export async function runPricingAI(input) {
    // TODO: connect to AI Brain / provider with scoped prompt
    return runAIRequest({ prompt: `AI placeholder for pricing`, agent: 'pricing', ...input });
}
