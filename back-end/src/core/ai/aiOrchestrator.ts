import { runAIRequest } from "../ai-service/ai-client.js";
import { hashObject, MemoryCache, type AIResponse } from "./aiUtils.js";

const cache = new MemoryCache<unknown>(30_000);

export async function orchestrateAI<T>(params: { key: string; prompt: string; fallback: () => T }): Promise<AIResponse<T>> {
  const cacheKey = params.key;
  const cached = cache.get(cacheKey) as T | null;
  if (cached) {
    return { result: cached, cached: true };
  }

  try {
    const response = await runAIRequest({ prompt: params.prompt });
    const parsed = (response as any)?.result as T;
    if (parsed) {
      cache.set(cacheKey, parsed);
      return { result: parsed, raw: response };
    }
    const fallback = params.fallback();
    cache.set(cacheKey, fallback);
    return { result: fallback };
  } catch (err) {
    const fallback = params.fallback();
    return { result: fallback };
  }
}

export function makeCacheKey(namespace: string, payload: unknown) {
  return `${namespace}:${hashObject(payload)}`;
}
