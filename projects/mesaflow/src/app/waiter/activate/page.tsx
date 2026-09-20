"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { apiUrl } from "@/lib/api";
import { AuthLayout } from "@/components/ui/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PASSWORD_POLICY_HINT } from "@/lib/password-policy";

function ActivateForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [token, setToken] = useState(searchParams.get("token") || "");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(apiUrl("/waiter/activate"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password, pin: pin || undefined }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha na ativação");
      setLoading(false);
      return;
    }
    const activatedEmail = json.user?.email;
    router.push(
      activatedEmail
        ? `/waiter/login?email=${encodeURIComponent(activatedEmail)}`
        : "/waiter/login",
    );
  }

  return (
    <AuthLayout title="Ativar conta" subtitle="Defina sua senha — o QR não contém senha">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
        )}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Código de ativação</label>
          <Input value={token} onChange={(e) => setToken(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Nova senha</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <p className="mt-1 text-xs text-muted">{PASSWORD_POLICY_HINT}</p>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">PIN rápido (opcional)</label>
          <Input type="password" inputMode="numeric" value={pin} onChange={(e) => setPin(e.target.value)} maxLength={6} />
        </div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Ativar e continuar
        </Button>
        <p className="text-center text-sm text-muted">
          <Link href="/waiter/login" className="font-medium text-brand hover:underline">
            Já tenho senha
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default function WaiterActivatePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted">Carregando…</div>}>
      <ActivateForm />
    </Suspense>
  );
}
