import { api } from "./client";

export async function fetchAiInsights(payload: { brandName?: string; highlights?: string }) {
  const { data } = await api.post("/ai/insights", payload);
  return data;
}

export async function suggestPricing(productId: string) {
  const { data } = await api.post(`/pricing/product/${productId}/ai/suggest`, {});
  return data;
}

export async function generateMarketing(payload: { goal: string; tone?: string; audience?: string }) {
  const { data } = await api.post(`/marketing/ai/generate`, payload);
  return data;
}

export async function generateSeo(payload: { topic: string; locale?: string }) {
  const { data } = await api.post(`/marketing/ai/seo`, payload);
  return data;
}

export async function generateCaptions(payload: { topic: string; platform?: string; tone?: string }) {
  const { data } = await api.post(`/marketing/ai/captions`, payload);
  return data;
}

export async function scoreLead(payload: { leadName: string; intent?: string }) {
  const { data } = await api.post(`/crm/ai/score`, payload);
  return data;
}
