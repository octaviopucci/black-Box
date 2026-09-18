"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiUrl } from "@/lib/api";
import type { Establishment, User } from "@/lib/types";

export type AuthSession = {
  user: Pick<User, "id" | "name" | "email" | "role">;
  establishment: Establishment;
};

type AuthContextValue = {
  session: AuthSession | null;
  loading: boolean;
  setSession: (session: AuthSession) => void;
  logout: () => Promise<void>;
  /** Headers vazios — sessão admin via cookie HttpOnly `mf_as`. */
  authHeaders: () => Record<string, string>;
  credentials: RequestCredentials;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl("/auth/me"), { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) throw new Error("invalid");
        const json = await res.json();
        setSessionState({ user: json.user, establishment: json.establishment });
      })
      .catch(() => setSessionState(null))
      .finally(() => setLoading(false));
  }, []);

  const setSession = useCallback((next: AuthSession) => {
    setSessionState(next);
  }, []);

  const logout = useCallback(async () => {
    await fetch(apiUrl("/auth/logout"), { method: "POST", credentials: "include" });
    setSessionState(null);
  }, []);

  const authHeaders = useCallback((): Record<string, string> => ({}), []);

  const value = useMemo(
    () => ({
      session,
      loading,
      setSession,
      logout,
      authHeaders,
      credentials: "include" as const,
    }),
    [session, loading, setSession, logout, authHeaders],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
