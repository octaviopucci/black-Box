"use client";

import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { useRealtime } from "@/hooks/use-realtime";
import { apiUrl } from "@/lib/api";
import { DEMO_ESTABLISHMENT_ID, DEMO_ESTABLISHMENT_SLUG } from "@/lib/demo";
import type { Table } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default function QRCodesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [qrs, setQrs] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const res = await fetch(apiUrl(`/admin/dashboard?slug=${DEMO_ESTABLISHMENT_SLUG}`));
    const json = await res.json();
    setTables(json.tables || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useRealtime(DEMO_ESTABLISHMENT_ID, load);

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    void Promise.all(
      tables.map(async (t) => {
        const url = `${origin}/m/${DEMO_ESTABLISHMENT_SLUG}/${t.qrToken}`;
        const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: 200 });
        return [t.id, dataUrl] as const;
      }),
    ).then((pairs) => setQrs(Object.fromEntries(pairs)));
  }, [tables]);

  function printAll() {
    window.print();
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">QR Codes</h1>
        <Button onClick={printAll}>Imprimir todos</Button>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
        {tables.map((t) => (
          <div
            key={t.id}
            className="flex flex-col items-center rounded-2xl border border-white/5 bg-white p-6 text-center text-black print:break-inside-avoid"
          >
            <p className="mb-2 text-lg font-bold">MESA {t.number}</p>
            {qrs[t.id] ? (
              <img src={qrs[t.id]} alt={`QR Mesa ${t.number}`} className="h-48 w-48" />
            ) : (
              <div className="h-48 w-48 animate-pulse bg-gray-200" />
            )}
            <p className="mt-2 text-xs text-gray-600">Ponto do Sabor · MesaFlow</p>
          </div>
        ))}
      </div>
    </div>
  );
}
