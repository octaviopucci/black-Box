"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Banknote, CheckCircle2, Split } from "lucide-react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { apiUrl } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { describeClosingScope } from "@/lib/closing";
import { formatPaymentMethod } from "@/lib/payments";
import type {
  ClosingRequest,
  Command,
  GuestParticipation,
  Order,
  OrderItemSplit,
  Payment,
  PaymentMethod,
  Table,
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";

type CockpitData = {
  table: Table;
  command: Command | null;
  orders: Order[];
  participations: GuestParticipation[];
  splits: OrderItemSplit[];
  payments: Payment[];
  closingRequests: ClosingRequest[];
  summary: {
    commandTotal: number;
    paidTotal: number;
    remainingTotal: number;
    canSettle: boolean;
    participants: Array<{
      guestParticipationId: string;
      displayName: string;
      itemTotal: number;
      paidTotal: number;
      remainingTotal: number;
      isSettled: boolean;
    }>;
  } | null;
};

const PAYMENT_METHODS: PaymentMethod[] = ["cash", "credit", "debit", "pix", "other"];

export default function TableCockpitPage() {
  const params = useParams<{ id: string }>();
  const tableId = params.id;
  const { authHeaders } = useAuth();
  const [data, setData] = useState<CockpitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState("");
  const [paymentDraft, setPaymentDraft] = useState({
    amount: "",
    method: "pix" as PaymentMethod,
    guestParticipationId: "",
    note: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(apiUrl(`/admin/tables/${encodeURIComponent(tableId)}/cockpit`), {
        headers: authHeaders(),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível carregar o cockpit.");
      setData(json);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Falha ao carregar o cockpit.");
    } finally {
      setLoading(false);
    }
  }, [authHeaders, tableId]);

  useEffect(() => {
    void load();
  }, [load]);

  const [splitDraft, setSplitDraft] = useState<
    Array<{ orderItemId: string; label: string; qty: number; guestParticipationId: string }>
  >([]);

  useEffect(() => {
    if (!data?.orders.length) {
      setSplitDraft([]);
      return;
    }
    const rows: Array<{ orderItemId: string; label: string; qty: number; guestParticipationId: string }> = [];
    for (const order of data.orders) {
      for (const item of order.items) {
        const existing = data.splits.find((split) => split.orderItemId === item.id);
        rows.push({
          orderItemId: item.id,
          label: `${item.qty}x ${item.productName}`,
          qty: item.qty,
          guestParticipationId:
            existing?.guestParticipationId || order.guestParticipationId || data.participations[0]?.id || "",
        });
      }
    }
    setSplitDraft(rows);
  }, [data]);

  async function registerPayment() {
    if (!data?.command) return;
    setBusy("payment");
    setError("");
    try {
      const response = await fetch(
        apiUrl(`/admin/commands/${encodeURIComponent(data.command.id)}/payments`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({
            amount: Number(paymentDraft.amount),
            method: paymentDraft.method,
            guestParticipationId: paymentDraft.guestParticipationId || undefined,
            note: paymentDraft.note || undefined,
          }),
        },
      );
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível registrar o pagamento.");
      setFeedback("Pagamento registrado.");
      setPaymentDraft({ amount: "", method: "pix", guestParticipationId: "", note: "" });
      await load();
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Falha ao registrar pagamento.");
    } finally {
      setBusy("");
    }
  }

  async function saveSplits() {
    if (!data?.command) return;
    setBusy("splits");
    setError("");
    try {
      const response = await fetch(
        apiUrl(`/admin/commands/${encodeURIComponent(data.command.id)}/splits`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json", ...authHeaders() },
          body: JSON.stringify({
            splits: splitDraft.map((row) => ({
              orderItemId: row.orderItemId,
              guestParticipationId: row.guestParticipationId,
              quantity: row.qty,
            })),
          }),
        },
      );
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível salvar as divisões.");
      setFeedback("Divisão por item atualizada.");
      await load();
    } catch (splitError) {
      setError(splitError instanceof Error ? splitError.message : "Falha ao salvar divisões.");
    } finally {
      setBusy("");
    }
  }

  async function settle() {
    if (!data?.command) return;
    if (!window.confirm("Encerrar comanda e liberar a mesa?")) return;
    setBusy("settle");
    setError("");
    try {
      const response = await fetch(
        apiUrl(`/admin/commands/${encodeURIComponent(data.command.id)}/settle`),
        { method: "POST", headers: authHeaders() },
      );
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível encerrar a comanda.");
      setFeedback("Comanda encerrada. Mesa liberada.");
      await load();
    } catch (settleError) {
      setError(settleError instanceof Error ? settleError.message : "Falha ao encerrar comanda.");
    } finally {
      setBusy("");
    }
  }

  async function confirmClosing(closingRequestId: string) {
    setBusy(closingRequestId);
    setError("");
    try {
      const response = await fetch(apiUrl(`/admin/closing/${encodeURIComponent(closingRequestId)}/confirm`), {
        method: "POST",
        headers: authHeaders(),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Não foi possível confirmar o fechamento.");
      setFeedback("Fechamento confirmado.");
      await load();
    } catch (confirmError) {
      setError(confirmError instanceof Error ? confirmError.message : "Falha ao confirmar fechamento.");
    } finally {
      setBusy("");
    }
  }

  if (loading) {
    return <div className="skeleton h-96 rounded-2xl" />;
  }

  if (!data) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-muted">{error || "Mesa não encontrada."}</p>
      </div>
    );
  }

  const summary = data.summary;
  const pendingClosing = data.closingRequests.find((request) => request.status === "PENDING");

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href="/admin/tables" className="rounded-xl bg-surface-2 p-2 text-muted hover:text-ink">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">Cockpit</p>
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold">
            Mesa {data.table.number}
          </h1>
        </div>
      </div>

      {feedback && (
        <div className="mb-4 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
          {feedback}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {!data.command ? (
        <div className="glass-card p-8 text-center">
          <p className="text-muted">Mesa livre — sem comanda ativa.</p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
          <section className="space-y-6">
            <div className="glass-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold">Resumo da comanda</h2>
                <span className="rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold text-brand">
                  {data.command.status}
                </span>
              </div>
              {summary && (
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-surface/60 p-4">
                    <p className="text-xs text-muted">Total</p>
                    <p className="text-xl font-bold">{formatCurrency(summary.commandTotal)}</p>
                  </div>
                  <div className="rounded-xl bg-surface/60 p-4">
                    <p className="text-xs text-muted">Pago</p>
                    <p className="text-xl font-bold text-success">{formatCurrency(summary.paidTotal)}</p>
                  </div>
                  <div className="rounded-xl bg-surface/60 p-4">
                    <p className="text-xs text-muted">Pendente</p>
                    <p className="text-xl font-bold text-warning">{formatCurrency(summary.remainingTotal)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="glass-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Split className="h-4 w-4 text-brand" />
                <h2 className="font-semibold">Divisão por item</h2>
              </div>
              {data.participations.length === 0 ? (
                <p className="text-sm text-muted">
                  Sem participantes cadastrados — consumo atribuído ao pedido original.
                </p>
              ) : (
                <div className="space-y-3">
                  {splitDraft.map((row) => (
                    <div key={row.orderItemId} className="grid gap-2 rounded-xl border border-white/5 p-3 sm:grid-cols-[1fr_180px]">
                      <p className="text-sm">{row.label}</p>
                      <Select
                        value={row.guestParticipationId}
                        onChange={(event) => {
                          setSplitDraft((current) =>
                            current.map((entry) =>
                              entry.orderItemId === row.orderItemId
                                ? { ...entry, guestParticipationId: event.target.value }
                                : entry,
                            ),
                          );
                        }}
                      >
                        {data.participations.map((participation) => (
                          <option key={participation.id} value={participation.id}>
                            {participation.displayName || `Participante ${participation.participantIndex}`}
                          </option>
                        ))}
                      </Select>
                    </div>
                  ))}
                  <p className="text-xs text-muted">
                    Cada item inteiro é atribuído a um participante. Use salvar após ajustar no backend.
                  </p>
                  <Button onClick={saveSplits} loading={busy === "splits"} variant="secondary">
                    Salvar divisão
                  </Button>
                </div>
              )}
            </div>

            <div className="glass-card p-6">
              <h2 className="mb-4 font-semibold">Pedidos</h2>
              <ul className="space-y-3">
                {data.orders.map((order) => (
                  <li key={order.id} className="rounded-xl border border-white/5 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">#{order.number}</span>
                      <span className="text-muted">{formatCurrency(order.total)}</span>
                    </div>
                    <ul className="mt-2 space-y-1 text-muted">
                      {order.items.map((item) => (
                        <li key={item.id}>{item.qty}x {item.productName}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="space-y-6">
            <div className="glass-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Banknote className="h-4 w-4 text-brand" />
                <h2 className="font-semibold">Registrar pagamento</h2>
              </div>
              <div className="grid gap-3">
                <label>
                  <span className="mb-1 block text-xs text-muted">Valor</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={paymentDraft.amount}
                    onChange={(event) => setPaymentDraft({ ...paymentDraft, amount: event.target.value })}
                    placeholder="0,00"
                  />
                </label>
                <label>
                  <span className="mb-1 block text-xs text-muted">Forma</span>
                  <Select
                    value={paymentDraft.method}
                    onChange={(event) =>
                      setPaymentDraft({ ...paymentDraft, method: event.target.value as PaymentMethod })
                    }
                  >
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method} value={method}>{formatPaymentMethod(method)}</option>
                    ))}
                  </Select>
                </label>
                {data.participations.length > 0 && (
                  <label>
                    <span className="mb-1 block text-xs text-muted">Participante (opcional)</span>
                    <Select
                      value={paymentDraft.guestParticipationId}
                      onChange={(event) =>
                        setPaymentDraft({ ...paymentDraft, guestParticipationId: event.target.value })
                      }
                    >
                      <option value="">Conta inteira</option>
                      {data.participations.map((participation) => (
                        <option key={participation.id} value={participation.id}>
                          {participation.displayName || `Participante ${participation.participantIndex}`}
                        </option>
                      ))}
                    </Select>
                  </label>
                )}
                <Button onClick={registerPayment} loading={busy === "payment"}>
                  Registrar pagamento
                </Button>
              </div>
            </div>

            {summary && (
              <div className="glass-card p-6">
                <h2 className="mb-4 font-semibold">Participantes</h2>
                <ul className="space-y-3">
                  {summary.participants.map((participant) => (
                    <li key={participant.guestParticipationId} className="rounded-xl border border-white/5 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{participant.displayName}</span>
                        {participant.isSettled ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : null}
                      </div>
                      <p className="mt-1 text-muted">
                        {formatCurrency(participant.paidTotal)} / {formatCurrency(participant.itemTotal)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="glass-card p-6">
              <h2 className="mb-4 font-semibold">Pagamentos</h2>
              <ul className="space-y-2 text-sm">
                {data.payments.map((payment) => (
                  <li key={payment.id} className="flex items-center justify-between rounded-lg bg-surface/50 px-3 py-2">
                    <span>{formatPaymentMethod(payment.method)}</span>
                    <span className={payment.status === "voided" ? "text-muted line-through" : ""}>
                      {formatCurrency(payment.amount)}
                    </span>
                  </li>
                ))}
                {data.payments.length === 0 && <p className="text-muted">Nenhum pagamento registrado.</p>}
              </ul>
            </div>

            {pendingClosing && (
              <div className="glass-card p-6">
                <h2 className="mb-2 font-semibold">Fechamento pendente</h2>
                <p className="text-sm text-muted">{describeClosingScope(pendingClosing.scope)}</p>
                <Button
                  className="mt-4 w-full"
                  variant="secondary"
                  onClick={() => confirmClosing(pendingClosing.id)}
                  loading={busy === pendingClosing.id}
                  disabled={!summary?.canSettle}
                >
                  Confirmar fechamento
                </Button>
              </div>
            )}

            <Button
              className="w-full"
              onClick={settle}
              loading={busy === "settle"}
              disabled={!summary?.canSettle}
            >
              Encerrar comanda e liberar mesa
            </Button>
          </section>
        </div>
      )}
    </div>
  );
}
