import crypto from "crypto";
import { runAIRequest } from "../ai-service/ai-client.js";

export type CacheEntry<T> = { value: T; expiresAt: number };

export class SimpleCache<T> {
  constructor(private ttlMs: number) {}
  private store = new Map<string, CacheEntry<T>>();

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: T) {
    this.store.set(key, { value, expiresAt: Date.now() + this.ttlMs });
  }
}

export function hashPayload(input: unknown) {
  return crypto.createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

export async function safeAIRequest<T>(prompt: string, fallback: T): Promise<{ result: T; raw?: unknown; cached?: boolean }> {
  try {
    const raw = await runAIRequest({ prompt });
    const parsed = (raw as any)?.result as T;
    if (parsed) return { result: parsed, raw };
  } catch (err) {
    return { result: fallback };
  }
  return { result: fallback };
}
