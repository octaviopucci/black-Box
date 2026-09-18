"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/api";
import type { PlatformUserRole } from "@/lib/types";

export type PlatformSession = {
  token: string;
  user: { id: string; name: string; email: string; role: PlatformUserRole };
};

const STORAGE_KEY = "mesaflow_platform";

type PlatformAuthContextValue = {
  session: PlatformSession | null;
  loading: boolean;
  setSession: (session: PlatformSession) => void;
  logout: () => void;
  authHeaders: () => Record<string, string>;
};

const PlatformAuthContext = createContext<PlatformAuthContextValue | null>(null);

function readStoredSession(): PlatformSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlatformSession;
    if (!parsed?.token || !parsed?.user?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function PlatformAuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<PlatformSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredSession();
    if (!stored) {
      setLoading(false);
      return;
    }
    fetch(apiUrl("/platform/auth/me"), {
      headers: { Authorization: `Bearer ${stored.token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("invalid");
        const json = await res.json();
        const next: PlatformSession = { token: stored.token, user: json.user };
        setSessionState(next);
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      })
      .catch(() => {
        sessionStorage.removeItem(STORAGE_KEY);
        setSessionState(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const setSession = useCallback((next: PlatformSession) => {
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

  return <PlatformAuthContext.Provider value={value}>{children}</PlatformAuthContext.Provider>;
}

export function usePlatformAuth() {
  const ctx = useContext(PlatformAuthContext);
  if (!ctx) throw new Error("usePlatformAuth must be used within PlatformAuthProvider");
  return ctx;
}
