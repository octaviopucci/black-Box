"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { TurnstileWidget } from "@/components/auth/turnstile-widget";
import { useAuth } from "@/contexts/auth-context";
import { staffFetch } from "@/lib/api";
import { AuthLayout } from "@/components/ui/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_LOGIN } from "@/lib/demo";
import { turnstileSiteKeyClient } from "@/lib/turnstile-client";

function WaiterLoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setSession } = useAuth();
  const turnstileSiteKey = turnstileSiteKeyClient();
  const emailFromActivate = searchParams.get("email")?.trim().toLowerCase() || "";
  const devDefaults = process.env.NODE_ENV === "development";
  const [email, setEmail] = useState(
    emailFromActivate || (devDefaults ? "garcom@pontodosabor.com" : ""),
  );
  const [password, setPassword] = useState(devDefaults ? DEMO_LOGIN.password : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  useEffect(() => {
    if (emailFromActivate) setEmail(emailFromActivate);
  }, [emailFromActivate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (turnstileSiteKey && !turnstileToken) {
      setError("Complete a verificação anti-bot.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await staffFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        password,
        turnstileToken: turnstileToken || undefined,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha no login");
      setLoading(false);
      return;
    }
    if (json.user?.role !== "WAITER") {
      setError("Esta conta não é de garçom. Use o painel admin.");
      setLoading(false);
      return;
    }
    setSession({
      token: json.token,
      user: json.user,
      establishment: json.establishment,
    });
    router.push("/waiter");
  }

  return (
    <AuthLayout title="Acesso do Garçom" subtitle="Entre com seu login operacional">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
        )}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">E-mail</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Senha</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        {turnstileSiteKey ? (
          <TurnstileWidget
            siteKey={turnstileSiteKey}
            onToken={setTurnstileToken}
            onExpire={() => setTurnstileToken("")}
          />
        ) : null}
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Entrar
        </Button>
        <p className="text-center text-sm text-muted">
          Primeiro acesso?{" "}
          <Link href="/waiter/activate" className="font-medium text-brand hover:underline">
            Ativar conta
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default function WaiterLoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Carregando…</div>}>
      <WaiterLoginForm />
    </Suspense>
  );
}
