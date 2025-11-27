import { api } from "./client";
import type { AuthUser } from "@/lib/auth/auth-context";

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post<{ token: string }>("/auth/login", payload);
  return data;
}

export async function me() {
  const { data } = await api.get<AuthUser>("/auth/me");
  return data;
}
