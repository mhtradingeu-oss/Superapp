import { runAIRequest } from "../../core/ai-service/ai-client.js";
export async function runSocialIntelligenceAI(input) {
    // TODO: connect to AI Brain / provider with scoped prompt
    return runAIRequest({ prompt: `AI placeholder for social-intelligence`, agent: 'social-intelligence', ...input });
}
