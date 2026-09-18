"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TurnstileWidget } from "@/components/auth/turnstile-widget";
import { useAuth } from "@/contexts/auth-context";
import { staffFetch } from "@/lib/api";
import { AuthLayout } from "@/components/ui/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BRAND_NAME } from "@/lib/brand";
import { DEMO_LOGIN } from "@/lib/demo";
import { turnstileSiteKeyClient } from "@/lib/turnstile-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const turnstileSiteKey = turnstileSiteKeyClient();
  const [email, setEmail] = useState(DEMO_LOGIN.email);
  const [password, setPassword] = useState(DEMO_LOGIN.password);
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
    const res = await staffFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, turnstileToken: turnstileToken || undefined }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha no login");
      setLoading(false);
      return;
    }
    setSession({
      token: json.token,
      user: json.user,
      establishment: json.establishment,
    });
    router.push("/admin");
  }

  return (
    <AuthLayout title="Bem-vindo de volta" subtitle={`Entre no painel ${BRAND_NAME} do seu estabelecimento`}>
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
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
        <Button type="submit" className="w-full shadow-lg shadow-brand/20" size="lg" loading={loading}>
          Entrar no painel
        </Button>
        <p className="text-center text-sm text-muted">
          Novo estabelecimento?{" "}
          <Link href="/admin/signup" className="font-medium text-brand hover:underline">Criar conta grátis</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
