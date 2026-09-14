"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import type { BusinessType } from "@/lib/types";

const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: "restaurante", label: "Restaurante" },
  { value: "lanchonete", label: "Lanchonete" },
  { value: "padaria", label: "Padaria" },
  { value: "bar", label: "Bar" },
  { value: "cafeteria", label: "Cafeteria" },
  { value: "rodizio", label: "Rodízio" },
];

export default function AdminSignupPage() {
  const router = useRouter();
  const { setSession } = useAuth();
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessType, setBusinessType] = useState<BusinessType>("restaurante");
  const [tableCount, setTableCount] = useState(8);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch(apiUrl("/auth/register"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName,
        ownerName,
        email,
        password,
        businessType,
        tableCount,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha no cadastro");
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
    <div className="flex min-h-dvh items-center justify-center bg-surface p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-2xl border border-white/10 bg-surface-2 p-8">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">Criar conta MesaFlow</h1>
        <p className="text-sm text-muted">Cadastre seu restaurante, lanchonete, padaria ou bar em minutos.</p>
        {error && <p className="text-sm text-danger">{error}</p>}

        <input
          className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm"
          placeholder="Nome do estabelecimento"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />
        <select
          className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value as BusinessType)}
        >
          {BUSINESS_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input
          className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm"
          placeholder="Seu nome (responsável)"
          value={ownerName}
          onChange={(e) => setOwnerName(e.target.value)}
          required
        />
        <input
          type="email"
          className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm"
          placeholder="Senha (mín. 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <label className="block text-sm text-muted">
          Quantidade de mesas
          <input
            type="number"
            min={3}
            max={20}
            className="mt-1 w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm"
            value={tableCount}
            onChange={(e) => setTableCount(Number(e.target.value))}
          />
        </label>

        <Button type="submit" className="w-full" loading={loading}>Criar conta e entrar</Button>
        <p className="text-center text-sm text-muted">
          Já tem conta?{" "}
          <Link href="/admin/login" className="text-brand hover:underline">Entrar</Link>
        </p>
      </form>
    </div>
  );
}
