"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { AuthLayout } from "@/components/ui/auth-layout";
import { Button } from "@/components/ui/button";
import { PLAN_LABELS } from "@/lib/platform-plans";
import { adminHomePath, isMerchantAdminOperational, resolvePlatformStatus } from "@/lib/platform-status";

const STATUS_POLL_MS = 15_000;

export default function AdminPendingPage() {
  const router = useRouter();
  const { session, loading, logout, refreshSession } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const redirectIfApproved = useCallback(
    (establishment: NonNullable<typeof session>["establishment"]) => {
      const status = resolvePlatformStatus(establishment);
      if (isMerchantAdminOperational(status)) {
        router.replace("/admin");
        return true;
      }
      return false;
    },
    [router],
  );

  useEffect(() => {
    if (loading || !session) return;
    redirectIfApproved(session.establishment);
  }, [loading, redirectIfApproved, session]);

  useEffect(() => {
    if (loading || !session) return;

    const poll = async () => {
      const fresh = await refreshSession();
      if (fresh?.establishment) redirectIfApproved(fresh.establishment);
    };

    const id = window.setInterval(poll, STATUS_POLL_MS);
    const onFocus = () => {
      void poll();
    };
    window.addEventListener("focus", onFocus);
    const onVisibility = () => {
      if (document.visibilityState === "visible") void poll();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [loading, redirectIfApproved, refreshSession, session]);

  async function handleRefreshStatus() {
    setRefreshing(true);
    const fresh = await refreshSession();
    setRefreshing(false);
    if (fresh?.establishment) {
      router.replace(adminHomePath(fresh.establishment));
    }
  }

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
            <p className="text-xs">Esta página atualiza automaticamente quando a aprovação for concluída.</p>
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
            className="text-brand hover:underline disabled:opacity-50"
            disabled={refreshing}
            onClick={() => void handleRefreshStatus()}
          >
            {refreshing ? "Verificando…" : "Verificar status agora"}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
