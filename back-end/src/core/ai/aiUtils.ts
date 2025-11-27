import crypto from "crypto";

export type CacheEntry<T> = { value: T; expiresAt: number };

export class MemoryCache<T> {
  constructor(private readonly ttlMs = 60_000) {}
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

export function hashObject(obj: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}

export type AIResponse<T> = {
  result: T;
  raw?: unknown;
  cached?: boolean;
};
