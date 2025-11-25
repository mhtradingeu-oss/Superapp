import { runAIRequest } from "../../core/ai-service/ai-client.js";

export async function runCrmAI(input: Record<string, unknown>) {
  // TODO: connect to AI Brain / provider with scoped prompt
  return runAIRequest({ prompt: `AI placeholder for crm`, agent: 'crm', ...input });
}
