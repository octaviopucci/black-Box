"use client";

import { useCallback, useEffect, useState } from "react";
import { Plug, Shield, Webhook } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type IntegrationItem = {
  provider: string;
  label: string;
  description: string;
  status: string;
  canConnect: boolean;
  connection?: {
    config?: Record<string, string>;
    connectedAt?: string;
    lastSyncAt?: string;
    lastError?: string;
  };
};

export default function AdminIntegrationsPage() {
  const { authHeaders } = useAuth();
  const [items, setItems] = useState<IntegrationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [webhookSecret, setWebhookSecret] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl("/admin/integrations"), { headers: authHeaders() });
      const json = await response.json();
      setItems(json.items || []);
      const webhook = (json.items as IntegrationItem[] | undefined)?.find(
        (item) => item.provider === "webhook",
      );
      if (webhook?.connection?.config?.url) {
        setWebhookUrl(webhook.connection.config.url);
        setWebhookSecret(webhook.connection.config.secret || "");
      }
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    void load();
  }, [load]);

  async function connect(provider: string, config: Record<string, string>) {
    setBusy(provider);
    try {
      const response = await fetch(apiUrl(`/admin/integrations/${provider}/connect`), {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ config }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Falha ao conectar.");
      await load();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao conectar.");
    } finally {
      setBusy(null);
    }
  }

  async function disconnect(provider: string) {
    setBusy(provider);
    try {
      await fetch(apiUrl(`/admin/integrations/${provider}/connect`), {
        method: "DELETE",
        headers: authHeaders(),
      });
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function testWebhook() {
    setBusy("webhook-test");
    setTestResult(null);
    try {
      const response = await fetch(apiUrl("/admin/integrations/webhook/test"), {
        method: "POST",
        headers: authHeaders(),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Teste falhou.");
      setTestResult(`HTTP ${json.status} — ${json.preview}`);
    } catch (error) {
      setTestResult(error instanceof Error ? error.message : "Teste falhou.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">Conectores</p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold">Integrações</h1>
        <p className="mt-1 text-sm text-muted">
          Fundação para parceiros — conectores stub sem credenciais reais de marketplace.
        </p>
      </header>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-4 text-sm">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p>
          iFood, Rappi e ERP ficam como stub (status conectado local). Webhook envia POST de teste
          para a URL informada — use um endpoint seu ou webhook.site para validar.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton h-40 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <article key={item.provider} className="glass-card p-5">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-brand/10 p-2 text-brand">
                    {item.provider === "webhook" ? (
                      <Webhook className="h-5 w-5" />
                    ) : (
                      <Plug className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold">{item.label}</h2>
                    <p className="text-xs text-muted">{item.provider}</p>
                  </div>
                </div>
                <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-semibold uppercase text-muted">
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-muted">{item.description}</p>

              {item.provider === "webhook" ? (
                <div className="mt-4 space-y-3">
                  <Input
                    placeholder="https://seu-servidor.com/webhook"
                    value={webhookUrl}
                    onChange={(event) => setWebhookUrl(event.target.value)}
                  />
                  <Input
                    placeholder="Segredo (opcional)"
                    value={webhookSecret}
                    onChange={(event) => setWebhookSecret(event.target.value)}
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      loading={busy === "webhook"}
                      onClick={() =>
                        void connect("webhook", {
                          url: webhookUrl,
                          ...(webhookSecret ? { secret: webhookSecret } : {}),
                        })
                      }
                    >
                      Conectar webhook
                    </Button>
                    {item.status === "connected" && (
                      <>
                        <Button
                          size="sm"
                          variant="secondary"
                          loading={busy === "webhook-test"}
                          onClick={() => void testWebhook()}
                        >
                          Enviar teste
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => void disconnect("webhook")}
                        >
                          Desconectar
                        </Button>
                      </>
                    )}
                  </div>
                  {testResult && <p className="text-xs text-muted">{testResult}</p>}
                  {item.connection?.lastError && (
                    <p className="text-xs text-danger">Último erro: {item.connection.lastError}</p>
                  )}
                </div>
              ) : (
                <div className="mt-4 flex gap-2">
                  {item.status !== "connected" ? (
                    <Button
                      size="sm"
                      loading={busy === item.provider}
                      onClick={() => void connect(item.provider, { stub: "1" })}
                    >
                      Conectar (stub)
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => void disconnect(item.provider)}
                    >
                      Desconectar
                    </Button>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
