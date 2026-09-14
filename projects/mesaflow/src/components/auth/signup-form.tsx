"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import type { BusinessType } from "@/lib/types";

const BUSINESS_TYPES: { value: BusinessType; label: string }[] = [
  { value: "restaurante", label: "Restaurante" },
  { value: "lanchonete", label: "Lanchonete" },
  { value: "padaria", label: "Padaria" },
  { value: "bar", label: "Bar" },
  { value: "cafeteria", label: "Cafeteria" },
  { value: "rodizio", label: "Rodízio" },
];

export function SignupForm({ compact = false }: { compact?: boolean }) {
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
      body: JSON.stringify({ businessName, ownerName, email, password, businessType, tableCount }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha no cadastro");
      setLoading(false);
      return;
    }
    setSession({ token: json.token, user: json.user, establishment: json.establishment });
    router.push("/admin");
  }

  return (
    <form onSubmit={onSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      {error && (
        <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
      )}
      <Input placeholder="Nome do estabelecimento" value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
      <Select value={businessType} onChange={(e) => setBusinessType(e.target.value as BusinessType)}>
        {BUSINESS_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </Select>
      <Input placeholder="Seu nome" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
      <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input type="password" placeholder="Senha (mín. 6)" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
      <Input type="number" min={3} max={20} value={tableCount} onChange={(e) => setTableCount(Number(e.target.value))} />
      <Button type="submit" className="w-full" size={compact ? "md" : "lg"} loading={loading}>
        Criar conta grátis
      </Button>
      <p className="text-center text-sm text-muted">
        Já tem conta? <Link href="/admin/login" className="text-brand hover:underline">Entrar</Link>
      </p>
    </form>
  );
}
