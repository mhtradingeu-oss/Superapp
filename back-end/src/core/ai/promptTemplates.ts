export function pricingSuggestionPrompt(context: {
  productName: string;
  brandName?: string | null;
  competitorSummary?: string;
  currentNet?: number | null;
  vatPct?: number | null;
  marginHint?: string;
}) {
  return `You are an AI pricing strategist. Provide a JSON response with fields: suggestedPrice, reasoning, riskLevel (LOW|MEDIUM|HIGH), competitorSummary, confidenceScore (0-1).
Product: ${context.productName}
Brand: ${context.brandName ?? "N/A"}
CurrentNet: ${context.currentNet ?? "unknown"}
VAT: ${context.vatPct ?? "unknown"}
MarginHint: ${context.marginHint ?? "protect margin"}
Competitors: ${context.competitorSummary ?? "none"}`;
}

export function marketingPrompt(payload: { goal: string; tone?: string; audience?: string }) {
  return `You are a marketing strategist. Return JSON with fields: headline, body, cta, keywords (array), tone.
Goal: ${payload.goal}
Tone: ${payload.tone ?? "friendly"}
Audience: ${payload.audience ?? "broad"}`;
}

export function seoPrompt(payload: { topic: string; locale?: string }) {
  return `Generate SEO ideas as JSON: { title, keywords: string[], description } for topic ${payload.topic} locale ${payload.locale ?? "en"}.`;
}

export function captionPrompt(payload: { topic: string; platform?: string; tone?: string }) {
  return `Create short social captions as JSON: { captions: string[] } for ${payload.platform ?? "social"} about ${payload.topic} tone ${payload.tone ?? "engaging"}.`;
}

export function crmScorePrompt(payload: { leadName: string; intent?: string; scoreFactors?: string }) {
  return `You are a CRM assistant. Return JSON: { score: number (0-100), probability: number (0-1), reasons: string[], nextAction: string }.
Lead: ${payload.leadName}
Intent: ${payload.intent ?? "unknown"}
Factors: ${payload.scoreFactors ?? "recent activity"}`;
}

export function insightsPrompt(payload: { brandName: string; highlights: string }) {
  return `Produce concise executive insights as JSON: { pricingHealth, marketingSummary, inventoryRisk, nextActions: string[] } for brand ${payload.brandName}. Highlights: ${payload.highlights}`;
}
