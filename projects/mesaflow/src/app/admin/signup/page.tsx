"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { apiUrl } from "@/lib/api";
import { AuthLayout } from "@/components/ui/auth-layout";
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
    <AuthLayout title="Crie sua conta" subtitle="Configure seu estabelecimento em poucos minutos">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>
        )}
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Nome do estabelecimento</label>
          <Input value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Tipo de negócio</label>
          <Select value={businessType} onChange={(e) => setBusinessType(e.target.value as BusinessType)}>
            {BUSINESS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Seu nome</label>
          <Input value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">E-mail</label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Senha</label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted">Quantidade de mesas</label>
          <Input type="number" min={3} max={20} value={tableCount} onChange={(e) => setTableCount(Number(e.target.value))} />
        </div>
        <Button type="submit" className="w-full shadow-lg shadow-brand/20" size="lg" loading={loading}>
          Criar conta e entrar
        </Button>
        <p className="text-center text-sm text-muted">
          Já tem conta?{" "}
          <Link href="/admin/login" className="font-medium text-brand hover:underline">Entrar</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
