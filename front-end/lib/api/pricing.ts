import { api } from "./client";
import type { PaginatedResponse } from "./types";

export interface PricingDto {
  id: string;
  productId: string;
  brandId?: string | null;
  b2cNet?: number | null;
  b2cGross?: number | null;
  dealerNet?: number | null;
  vatPct?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PricingDraftDto {
  id: string;
  productId: string;
  brandId?: string | null;
  channel: string;
  oldNet?: number | null;
  newNet?: number | null;
  status?: string | null;
  createdById?: string | null;
  approvedById?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CompetitorPriceDto {
  id: string;
  productId: string;
  brandId?: string | null;
  competitor: string;
  marketplace?: string | null;
  country?: string | null;
  priceNet?: number | null;
  priceGross?: number | null;
  currency?: string | null;
  collectedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PricingLogDto {
  id: string;
  productId: string;
  brandId?: string | null;
  channel?: string | null;
  oldNet?: number | null;
  newNet?: number | null;
  aiAgent?: string | null;
  confidenceScore?: number | null;
  summary?: string | null;
  createdAt: string;
}

export async function listPricing(params?: { productId?: string; brandId?: string; page?: number; pageSize?: number }) {
  const { data } = await api.get<PaginatedResponse<PricingDto>>("/pricing", { params });
  return data;
}

export async function getPricing(id: string) {
  const { data } = await api.get<PricingDto>(`/pricing/${id}`);
  return data;
}

export async function createPricing(payload: Partial<PricingDto> & { productId: string }) {
  const { data } = await api.post<PricingDto>("/pricing", payload);
  return data;
}

export async function updatePricing(id: string, payload: Partial<PricingDto>) {
  const { data } = await api.put<PricingDto>(`/pricing/${id}`, payload);
  return data;
}

export async function removePricing(id: string) {
  await api.delete(`/pricing/${id}`);
  return true;
}

export async function listDrafts(productId: string) {
  const { data } = await api.get<PricingDraftDto[]>(`/pricing/product/${productId}/drafts`);
  return data;
}

export async function createDraft(productId: string, payload: Omit<PricingDraftDto, "id" | "productId" | "createdAt" | "updatedAt">) {
  const { data } = await api.post<PricingDraftDto>(`/pricing/product/${productId}/drafts`, payload);
  return data;
}

export async function listCompetitors(productId: string) {
  const { data } = await api.get<CompetitorPriceDto[]>(`/pricing/product/${productId}/competitors`);
  return data;
}

export async function addCompetitor(productId: string, payload: Omit<CompetitorPriceDto, "id" | "productId" | "createdAt" | "updatedAt">) {
  const { data } = await api.post<CompetitorPriceDto>(`/pricing/product/${productId}/competitors`, payload);
  return data;
}

export async function listLogs(productId: string) {
  const { data } = await api.get<PricingLogDto[]>(`/pricing/product/${productId}/logs`);
  return data;
}
