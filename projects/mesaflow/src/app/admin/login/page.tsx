"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { DEMO_LOGIN } from "@/lib/demo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState(DEMO_LOGIN.email);
  const [password, setPassword] = useState(DEMO_LOGIN.password);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(apiUrl("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha no login");
      setLoading(false);
      return;
    }
    sessionStorage.setItem("mesaflow_admin", JSON.stringify(json));
    router.push("/admin");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-surface p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-surface-2 p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">MesaFlow Admin</h1>
        <p className="text-sm text-muted">Painel do estabelecimento</p>
        {error && <p className="text-sm text-danger">{error}</p>}
        <input
          className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" loading={loading}>Entrar</Button>
      </form>
    </div>
  );
}
