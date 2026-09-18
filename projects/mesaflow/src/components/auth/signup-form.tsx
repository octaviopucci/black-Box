"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TurnstileWidget } from "@/components/auth/turnstile-widget";
import { useAuth } from "@/contexts/auth-context";
import { staffFetch } from "@/lib/api";
import { PASSWORD_POLICY_HINT } from "@/lib/password-policy";
import { PLAN_OPTIONS } from "@/lib/platform-plans";
import { adminHomePath } from "@/lib/platform-status";
import { PRIVACY_POLICY_PATH, PRIVACY_POLICY_VERSION } from "@/lib/privacy-policy";
import { turnstileSiteKeyClient } from "@/lib/turnstile-client";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { OPERATION_MODES } from "@/lib/operation-modes";
import { cn } from "@/lib/cn";
import type { BusinessType, OperationMode, PlatformPlan } from "@/lib/types";

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
  const turnstileSiteKey = turnstileSiteKeyClient();
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [requiresInvite, setRequiresInvite] = useState(false);
  const [plan, setPlan] = useState<PlatformPlan>("essencial");
  const [businessType, setBusinessType] = useState<BusinessType>("restaurante");
  const [operationMode, setOperationMode] = useState<OperationMode>("a_la_carte");
  const [tableCount, setTableCount] = useState(8);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  useEffect(() => {
    staffFetch("/auth/signup-config")
      .then(async (res) => {
        if (!res.ok) return;
        const json = await res.json();
        setRequiresInvite(Boolean(json.requiresInvite));
      })
      .catch(() => undefined);
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!privacyAccepted) {
      setError("Aceite a Política de Privacidade para continuar.");
      return;
    }
    if (turnstileSiteKey && !turnstileToken) {
      setError("Complete a verificação anti-bot.");
      return;
    }
    setLoading(true);
    setError("");
    const res = await staffFetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName,
        ownerName,
        email,
        password,
        inviteCode: inviteCode || undefined,
        plan,
        businessType,
        operationMode,
        tableCount,
        turnstileToken: turnstileToken || undefined,
        privacyConsent: {
          acceptedAt: new Date().toISOString(),
          policyVersion: PRIVACY_POLICY_VERSION,
        },
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error || "Falha no cadastro");
      setLoading(false);
      return;
    }
    setSession({ token: json.token, user: json.user, establishment: json.establishment });
    router.push(adminHomePath(json.establishment));
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
      <Select value={operationMode} onChange={(e) => setOperationMode(e.target.value as OperationMode)}>
        {OPERATION_MODES.map((mode) => (
          <option key={mode.value} value={mode.value}>{mode.label}</option>
        ))}
      </Select>

      <div className="space-y-2">
        <p className="text-xs font-medium text-muted">Escolha seu plano</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {PLAN_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPlan(option.value)}
              className={cn(
                "rounded-xl border px-3 py-3 text-left transition",
                plan === option.value
                  ? "border-brand bg-brand/10 ring-1 ring-brand/30"
                  : "border-white/10 bg-surface-2 hover:border-white/20",
              )}
            >
              <p className="text-sm font-semibold text-ink">{option.label}</p>
              <p className="mt-1 text-xs text-muted">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      <Input placeholder="Seu nome" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
      <Input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <Input
        type="password"
        placeholder={PASSWORD_POLICY_HINT}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={10}
        required
      />
      {requiresInvite ? (
        <Input
          placeholder="Código de convite"
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
          required
        />
      ) : null}
      <Input type="number" min={3} max={20} value={tableCount} onChange={(e) => setTableCount(Number(e.target.value))} />
      <label className="flex items-start gap-2 text-xs text-muted">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={privacyAccepted}
          onChange={(e) => setPrivacyAccepted(e.target.checked)}
          required
        />
        <span>
          Li e aceito a{" "}
          <Link href={PRIVACY_POLICY_PATH} className="text-brand hover:underline" target="_blank">
            Política de Privacidade
          </Link>
          .
        </span>
      </label>
      {turnstileSiteKey ? (
        <TurnstileWidget siteKey={turnstileSiteKey} onToken={setTurnstileToken} onExpire={() => setTurnstileToken("")} />
      ) : null}
      <Button type="submit" className="w-full" size={compact ? "md" : "lg"} loading={loading}>
        Criar conta
      </Button>
      <p className="text-center text-xs text-muted">
        Após o cadastro, sua conta ficará aguardando aprovação da plataforma NA MESA.
      </p>
      <p className="text-center text-sm text-muted">
        Já tem conta? <Link href="/admin/login" className="text-brand hover:underline">Entrar</Link>
      </p>
    </form>
  );
}
