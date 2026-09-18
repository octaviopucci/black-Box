"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Shield } from "lucide-react";
import { TurnstileWidget } from "@/components/auth/turnstile-widget";
import { AuthLayout } from "@/components/ui/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePlatformAuth } from "@/contexts/platform-auth-context";
import { apiUrl } from "@/lib/api";
import { BRAND_NAME } from "@/lib/brand";
import { PLATFORM_OWNER_LOGIN } from "@/lib/demo";
import { turnstileSiteKeyClient } from "@/lib/turnstile-client";

export default function PlatformLoginPage() {
  const router = useRouter();
  const { setSession } = usePlatformAuth();
  const turnstileSiteKey = turnstileSiteKeyClient();
  const [email, setEmail] = useState(PLATFORM_OWNER_LOGIN.email);
  const [password, setPassword] = useState(PLATFORM_OWNER_LOGIN.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (turnstileSiteKey && !turnstileToken) {
      setError("Complete a verificação anti-bot.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await fetch(apiUrl("/platform/auth/login"), {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, turnstileToken: turnstileToken || undefined }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha no login");
      setLoading(false);
      return;
    }
    setSession({ user: json.user });
    router.push("/platform");
  }

  return (
    <AuthLayout
      title="NA MESA — Operação"
      subtitle={`Acesso exclusivo do dono da plataforma ${BRAND_NAME}. Não confundir com o painel do restaurante.`}
    >
      <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
        <Shield className="h-3.5 w-3.5" />
        Platform Owner · Super Admin
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">E-mail</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Senha</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {turnstileSiteKey ? (
          <TurnstileWidget siteKey={turnstileSiteKey} onToken={setTurnstileToken} onExpire={() => setTurnstileToken("")} />
        ) : null}
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500" size="lg" loading={loading}>
          Entrar na operação
        </Button>
        <p className="text-center text-xs text-muted">
          Painel do restaurante?{" "}
          <Link href="/admin/login" className="font-medium text-brand hover:underline">
            /admin
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
