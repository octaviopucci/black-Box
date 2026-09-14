"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/api";
import type { Establishment, User } from "@/lib/types";

export type AuthSession = {
  token: string;
  user: Pick<User, "id" | "name" | "email" | "role">;
  establishment: Establishment;
};

const STORAGE_KEY = "mesaflow_admin";

type AuthContextValue = {
  session: AuthSession | null;
  loading: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => void;
  authHeaders: () => Record<string, string>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.token || !parsed?.establishment?.slug) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredSession();
    if (!stored) {
      setLoading(false);
      return;
    }
    fetch(apiUrl("/auth/me"), {
      headers: { Authorization: `Bearer ${stored.token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("invalid");
        const json = await res.json();
        const next: AuthSession = {
          token: stored.token,
          user: json.user,
          establishment: json.establishment,
        };
        setSessionState(next);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      })
      .catch(() => {
        sessionStorage.removeItem(STORAGE_KEY);
        setSessionState(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const setSession = useCallback((next: AuthSession) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setSessionState(next);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setSessionState(null);
  }, []);

  const authHeaders = useCallback((): Record<string, string> => {
    if (!session?.token) return {};
    return { Authorization: `Bearer ${session.token}` };
  }, [session?.token]);

  const value = useMemo(
    () => ({ session, loading, setSession, logout, authHeaders }),
    [session, loading, setSession, logout, authHeaders],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
