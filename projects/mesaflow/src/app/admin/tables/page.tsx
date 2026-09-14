"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAdminData } from "@/hooks/use-admin-data";
import { formatCurrency } from "@/lib/format";
import type { Table } from "@/lib/types";
import { cn } from "@/lib/cn";

export default function AdminTablesPage() {
  const { data, establishment } = useAdminData<{
    tables: Table[];
    commands: { id: string; total: number }[];
  }>();
  const [tables, setTables] = useState<Table[]>([]);
  const [commands, setCommands] = useState<Record<string, { total: number }>>({});

  useEffect(() => {
    if (!data) return;
    setTables(data.tables || []);
    const cmdMap: Record<string, { total: number }> = {};
    for (const c of data.commands || []) {
      cmdMap[c.id] = { total: c.total };
    }
    setCommands(cmdMap);
  }, [data]);

  const slug = establishment?.slug || "";

  const statusColor: Record<string, string> = {
    LIVRE: "bg-success/20 text-success",
    OCUPADA: "bg-brand/20 text-brand",
    AGUARDANDO_PAGAMENTO: "bg-warning/20 text-warning",
    RESERVADA: "bg-purple-500/20 text-purple-300",
    INATIVA: "bg-muted/20 text-muted",
  };

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold">Mesas</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tables.map((t) => {
          const total = t.commandId ? commands[t.commandId]?.total : 0;
          return (
            <Link
              key={t.id}
              href={`/m/${encodeURIComponent(slug)}/${encodeURIComponent(t.qrToken)}`}
              className="rounded-2xl border border-white/5 bg-surface-2 p-5 transition hover:border-brand/30"
            >
              <div className="flex items-center justify-between">
                <p className="text-xl font-bold">Mesa {t.number}</p>
                <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", statusColor[t.status])}>
                  {t.status.replace(/_/g, " ")}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted">{t.capacity} lugares</p>
              {total ? <p className="mt-1 font-semibold text-brand">{formatCurrency(total)}</p> : null}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
