"use client";

import { useCallback, useEffect, useState } from "react";
import { Plug, Shield } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { apiUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";

type IntegrationItem = {
  provider: string;
  label: string;
  description: string;
  status: string;
  canConnect: boolean;
};

export default function AdminIntegrationsPage() {
  const { authHeaders } = useAuth();
  const [items, setItems] = useState<IntegrationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(apiUrl("/admin/integrations"), { headers: authHeaders() });
      const json = await response.json();
      setItems(json.items || []);
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">Conectores</p>
        <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold">Integrações</h1>
        <p className="mt-1 text-sm text-muted">
          Catálogo preparado para conectar marketplaces, mensagens e ERP com segurança.
        </p>
      </header>

      <div className="mb-6 flex items-start gap-3 rounded-2xl border border-brand/20 bg-brand/5 p-4 text-sm">
        <Shield className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
        <p>
          Nenhum provedor externo é simulado aqui. As conexões reais serão habilitadas em fases futuras,
          com credenciais criptografadas e auditoria de acesso.
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
                    <Plug className="h-5 w-5" />
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
              <Button className="mt-4" variant="secondary" disabled>
                Em breve
              </Button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
