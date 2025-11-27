"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, onUnauthorized, updateToken } from "@/lib/api/client";
import { clearToken, getToken, setToken } from "@/lib/auth/token";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  permissions?: string[];
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  login: (params: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
  hasPermission: (permission: string | string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    void refresh();
  }, []);

  const login = async ({ email, password }: { email: string; password: string }) => {
    const { data } = await api.post<{ token: string }>("/auth/login", { email, password });
    updateToken(data.token);
    setToken(data.token);
    await refresh();
    router.push("/dashboard");
  };

  const refresh = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<AuthUser>("/auth/me");
      setUser({ ...data, permissions: data.permissions ?? [] });
    } catch (err) {
      setUser(null);
      clearToken();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    setUser(null);
    router.push("/auth/login");
  };

  const hasPermission = (permission: string | string[]) => {
    if (!user) return false;
    const permissions = user.permissions ?? [];
    if (permissions.includes("*")) return true;
    const required = Array.isArray(permission) ? permission : [permission];
    return required.some((p) => permissions.includes(p));
  };

  const hasAnyPermission = (permissions: string[]) => {
    if (!user) return false;
    const assigned = user.permissions ?? [];
    if (assigned.includes("*")) return true;
    return permissions.some((p) => assigned.includes(p));
  };

  const hasAllPermissions = (permissions: string[]) => {
    if (!user) return false;
    const assigned = user.permissions ?? [];
    if (assigned.includes("*")) return true;
    return permissions.every((p) => assigned.includes(p));
  };

  useEffect(() => {
    // register unauthorized callback to clear local state
    onUnauthorized(() => setUser(null));
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading: loading, login, logout, refresh, hasPermission, hasAnyPermission, hasAllPermissions }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
