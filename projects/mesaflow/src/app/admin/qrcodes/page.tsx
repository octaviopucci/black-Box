"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { useAdminData } from "@/hooks/use-admin-data";
import type { Table } from "@/lib/types";
import { Button } from "@/components/ui/button";

function menuUrl(slug: string, qrToken: string) {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${prefix}/m/${encodeURIComponent(slug)}/${encodeURIComponent(qrToken)}`;
}

export default function QRCodesPage() {
  const { data, establishment } = useAdminData<{ tables: Table[] }>();
  const [tables, setTables] = useState<Table[]>([]);
  const [qrs, setQrs] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data?.tables) setTables(data.tables);
  }, [data]);

  const slug = establishment?.slug || "";

  useEffect(() => {
    if (!slug || tables.length === 0) return;
    void Promise.all(
      tables.map(async (t) => {
        const url = menuUrl(slug, t.qrToken);
        const dataUrl = await QRCode.toDataURL(url, { margin: 1, width: 200 });
        return [t.id, dataUrl] as const;
      }),
    ).then((pairs) => setQrs(Object.fromEntries(pairs)));
  }, [tables, slug]);

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
            <p className="mt-2 text-xs text-gray-600">{establishment?.name} · MesaFlow</p>
          </div>
        ))}
      </div>
    </div>
  );
}
