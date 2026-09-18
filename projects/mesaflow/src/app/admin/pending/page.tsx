"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Clock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { AuthLayout } from "@/components/ui/auth-layout";
import { Button } from "@/components/ui/button";
import { PLAN_LABELS } from "@/lib/platform-plans";
import { adminHomePath, resolvePlatformStatus } from "@/lib/platform-status";

export default function AdminPendingPage() {
  const router = useRouter();
  const { session, loading, logout } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!session) {
      router.replace("/admin/login");
      return;
    }
    const status = resolvePlatformStatus(session.establishment);
    if (status === "active") {
      router.replace("/admin");
    }
  }, [loading, router, session]);

  if (loading || !session) return null;

  const status = resolvePlatformStatus(session.establishment);
  if (status !== "pending") return null;

  const plan = session.establishment.plan ?? "essencial";

  return (
    <AuthLayout
      title="Aguardando aprovação"
      subtitle="Seu cadastro foi recebido e está em análise pela equipe NA MESA."
    >
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-xl border border-brand/20 bg-brand/5 px-4 py-4">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
          <div className="space-y-2 text-sm text-muted">
            <p>
              <strong className="text-ink">{session.establishment.name}</strong> foi cadastrado com
              o plano <strong className="text-ink">{PLAN_LABELS[plan]}</strong>.
            </p>
            <p>
              Assim que a plataforma aprovar sua conta, você poderá acessar o painel completo —
              cardápio, mesas, pedidos e cozinha.
            </p>
            <p className="text-xs">Enquanto isso, nenhuma operação ficará disponível no admin.</p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="secondary" className="flex-1" onClick={() => logout()}>
            Sair
          </Button>
          <Link href="/" className="flex-1">
            <Button type="button" variant="secondary" className="w-full">
              Voltar ao site
            </Button>
          </Link>
        </div>

        <p className="text-center text-xs text-muted">
          Já foi aprovado?{" "}
          <button
            type="button"
            className="text-brand hover:underline"
            onClick={() => router.replace(adminHomePath(session.establishment))}
          >
            Atualizar status
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
