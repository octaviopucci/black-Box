"use client";

import { useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, Printer, QrCode as QrCodeIcon } from "lucide-react";
import type { Table } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { apiUrl } from "@/lib/api";

function menuUrl(slug: string, qrToken: string) {
  const base = typeof window !== "undefined" ? window.location.origin : "";
  const prefix = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${prefix}/m/${encodeURIComponent(slug)}/${encodeURIComponent(qrToken)}`;
}

export default function QRCodesPage() {
  const { session, authHeaders } = useAuth();
  const [tables, setTables] = useState<Table[]>([]);
  const [qrs, setQrs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const response = await fetch(apiUrl("/admin/tables"), { headers: authHeaders(), cache: "no-store" });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível carregar os QR Codes.");
      setTables(json.tables || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Falha ao carregar os QR Codes.");
    } finally {
      setLoading(false);
    }
  }, [authHeaders]);

  useEffect(() => {
    void load();
    const refresh = () => void load();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [load]);

  const establishment = session?.establishment;
  const slug = establishment?.slug || "";

  useEffect(() => {
    if (!slug || tables.length === 0) {
      setQrs({});
      return;
    }
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

  async function copyLink(table: Table) {
    try {
      await navigator.clipboard.writeText(menuUrl(slug, table.qrToken));
      setFeedback(`Link da Mesa ${table.number} copiado.`);
    } catch {
      setError("O navegador não permitiu copiar o link.");
    }
  }

  function download(table: Table) {
    const qr = qrs[table.id];
    if (!qr) return;
    const anchor = document.createElement("a");
    anchor.href = qr;
    anchor.download = `mesa-${table.number}-qrcode.png`;
    anchor.click();
  }

  return (
    <div>
      <header className="print-hide mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">Acesso ao cardápio</p>
          <h1 className="mt-1 font-[family-name:var(--font-display)] text-3xl font-bold">QR Codes</h1>
          <p className="mt-1 text-sm text-muted">Prontos para baixar ou imprimir.</p>
        </div>
        <Button onClick={printAll} disabled={!tables.length}><Printer className="mr-2 h-4 w-4" /> Imprimir todos</Button>
      </header>

      {feedback && <div className="print-hide mb-4 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">{feedback}</div>}
      {error && <div className="print-hide mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="skeleton h-80 rounded-2xl" />)}
        </div>
      ) : tables.length === 0 ? (
        <div className="print-hide rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <QrCodeIcon className="mx-auto mb-3 h-9 w-9 text-muted" />
          <p className="font-semibold">Nenhum QR Code disponível</p>
          <p className="mt-1 text-sm text-muted">Crie uma mesa para gerar seu acesso.</p>
        </div>
      ) : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 print:grid-cols-3">
        {tables.map((t) => (
          <div
            key={t.id}
            className="flex flex-col items-center overflow-hidden rounded-2xl border border-white/10 bg-white text-center text-black shadow-xl shadow-black/20 print:break-inside-avoid print:border-gray-300 print:shadow-none"
          >
            <div className="w-full p-6">
              <p className="text-xs font-semibold uppercase tracking-[.2em] text-gray-500">{establishment?.name}</p>
              <p className="mb-3 mt-1 text-2xl font-black">MESA {t.number}</p>
              {qrs[t.id] ? (
                // Generated data URLs are intentionally rendered directly for print fidelity.
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrs[t.id]} alt={`QR Mesa ${t.number}`} className="mx-auto h-48 w-48" />
              ) : (
                <div className="mx-auto h-48 w-48 animate-pulse rounded-xl bg-gray-200" />
              )}
              <p className="mt-3 text-xs text-gray-500">Aponte a câmera para abrir o cardápio</p>
            </div>
            <div className="print-hide grid w-full grid-cols-2 border-t border-gray-200 bg-gray-50">
              <button onClick={() => copyLink(t)} className="flex items-center justify-center gap-2 py-3 text-xs font-semibold text-gray-600 hover:bg-gray-100"><Copy className="h-3.5 w-3.5" /> Copiar link</button>
              <button disabled={!qrs[t.id]} onClick={() => download(t)} className="flex items-center justify-center gap-2 border-l border-gray-200 py-3 text-xs font-semibold text-gray-600 hover:bg-gray-100 disabled:opacity-40"><Download className="h-3.5 w-3.5" /> Baixar PNG</button>
            </div>
          </div>
        ))}
      </div>}
    </div>
  );
}
