import { api } from "./client";
import type { PaginatedResponse } from "./types";

export interface BrandDto {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  countryOfOrigin?: string | null;
  defaultCurrency?: string | null;
  settings?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export async function listBrands(params?: { search?: string; page?: number; pageSize?: number }) {
  const { data } = await api.get<PaginatedResponse<BrandDto>>("/brand", { params });
  return data;
}

export async function getBrand(id: string) {
  const { data } = await api.get<BrandDto>(`/brand/${id}`);
  return data;
}

export async function createBrand(payload: Partial<BrandDto> & { name: string; slug: string }) {
  const { data } = await api.post<BrandDto>("/brand", payload);
  return data;
}

export async function updateBrand(id: string, payload: Partial<BrandDto>) {
  const { data } = await api.put<BrandDto>(`/brand/${id}`, payload);
  return data;
}

export async function removeBrand(id: string) {
  await api.delete(`/brand/${id}`);
  return true;
}
