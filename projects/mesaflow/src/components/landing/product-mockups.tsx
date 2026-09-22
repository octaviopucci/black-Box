import { cn } from "@/lib/cn";
import { DesktopFrame, PhoneFrame } from "@/components/landing/device-frame";

function MockHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="border-b border-white/10 bg-[#111] px-3 py-2.5">
      <p className="text-[11px] font-bold text-brand">{title}</p>
      {subtitle ? <p className="text-[9px] text-muted">{subtitle}</p> : null}
    </div>
  );
}

export function GuestMenuMockup({ className }: { className?: string }) {
  const items = [
    { name: "Picanha na brasa", price: "R$ 89,90", tag: "Destaque" },
    { name: "Costela 4h", price: "R$ 72,00" },
    { name: "Caipirinha", price: "R$ 18,00" },
    { name: "Água 500ml", price: "R$ 6,00" },
  ];

  return (
    <PhoneFrame className={className}>
      <MockHeader title="Mesa 8 · Casa da Carne" subtitle="Cardápio · NA MESA" />
      <div className="space-y-2 p-2.5">
        <div className="flex gap-1 overflow-x-auto pb-1">
          {["Todos", "Carnes", "Bebidas", "Sobremesas"].map((cat, i) => (
            <span
              key={cat}
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[8px] font-semibold",
                i === 0 ? "bg-brand text-[#111]" : "bg-[#2a2a2a] text-muted",
              )}
            >
              {cat}
            </span>
          ))}
        </div>
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-lg bg-[#242424] px-2 py-1.5">
            <div>
              <p className="text-[9px] font-semibold">{item.name}</p>
              {item.tag ? (
                <span className="text-[7px] font-bold uppercase text-brand">{item.tag}</span>
              ) : null}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[8px] text-muted">{item.price}</span>
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-[#111]">
                +
              </span>
            </div>
          </div>
        ))}
        <div className="mt-2 rounded-lg bg-brand px-2 py-1.5 text-center text-[9px] font-bold text-[#111]">
          Enviar pedido · 3 itens
        </div>
      </div>
    </PhoneFrame>
  );
}

export function AdminOrdersMockup({ className }: { className?: string }) {
  const cols = [
    { label: "Novos", count: 2, items: ["#142 · Mesa 8", "#143 · Mesa 3"] },
    { label: "Em preparo", count: 1, items: ["#141 · Mesa 12"] },
    { label: "Prontos", count: 1, items: ["#140 · Mesa 5"] },
  ];

  return (
    <DesktopFrame className={className}>
      <div className="flex h-full flex-col p-2">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10px] font-bold">Pedidos · Tempo real</p>
          <span className="rounded bg-brand/20 px-1.5 py-0.5 text-[8px] font-bold text-brand">4 ativos</span>
        </div>
        <div className="grid flex-1 grid-cols-3 gap-1.5">
          {cols.map((col) => (
            <div key={col.label} className="rounded border border-[#2a2a2a] bg-[#1a1a1a] p-1.5">
              <p className="mb-1 text-[8px] font-bold text-muted">
                {col.label} <span className="text-brand">({col.count})</span>
              </p>
              {col.items.map((item) => (
                <div key={item} className="mb-1 rounded bg-[#242424] px-1.5 py-1 text-[7px]">
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </DesktopFrame>
  );
}

export function KdsMockup({ className }: { className?: string }) {
  const tickets = [
    { num: 142, table: "Mesa 8", items: "1× Picanha · 2× Caipirinha", time: "3 min" },
    { num: 143, table: "Mesa 3", items: "1× Costela · 1× Água", time: "1 min" },
  ];

  return (
    <DesktopFrame className={className}>
      <div className="flex h-full flex-col p-2">
        <div className="mb-2 flex items-center justify-between border-b border-[#2a2a2a] pb-1.5">
          <p className="text-[10px] font-bold">KDS · Cozinha</p>
          <span className="text-[8px] text-brand">2 comandas</span>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-2">
          {tickets.map((t) => (
            <div key={t.num} className="rounded-lg border-2 border-brand bg-[#1a1a1a] p-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-brand">#{t.num}</span>
                <span className="text-[8px] text-muted">{t.time}</span>
              </div>
              <p className="mt-0.5 text-[9px] font-bold">{t.table}</p>
              <p className="mt-1 text-[8px] leading-snug text-muted">{t.items}</p>
              <div className="mt-2 rounded bg-brand/20 py-0.5 text-center text-[7px] font-bold text-brand">
                Em preparo
              </div>
            </div>
          ))}
        </div>
      </div>
    </DesktopFrame>
  );
}

export function WaiterMockup({ className }: { className?: string }) {
  return (
    <PhoneFrame className={className}>
      <MockHeader title="Garçom · Mesa 8" subtitle="Pedido pelo celular" />
      <div className="space-y-2 p-2.5">
        <div className="flex gap-1">
          {["Pedir", "Pedidos", "Conta"].map((tab, i) => (
            <span
              key={tab}
              className={cn(
                "flex-1 rounded py-1 text-center text-[8px] font-semibold",
                i === 0 ? "bg-brand text-[#111]" : "bg-[#2a2a2a] text-muted",
              )}
            >
              {tab}
            </span>
          ))}
        </div>
        <div className="rounded-lg border border-brand/30 bg-[#242424] p-2">
          <p className="text-[9px] font-bold">Mesa 8 · 4 pessoas</p>
          <p className="text-[8px] text-muted">Consumo: R$ 312,40</p>
        </div>
        <div className="rounded-lg bg-[#242424] px-2 py-1.5">
          <p className="text-[9px] font-semibold">Filé ao molho</p>
          <p className="text-[8px] text-muted">R$ 54,00 · + Adicionar</p>
        </div>
        <div className="rounded-lg bg-brand px-2 py-1.5 text-center text-[9px] font-bold text-[#111]">
          Lançar na mesa
        </div>
      </div>
    </PhoneFrame>
  );
}

export function ClosingMockup({ className }: { className?: string }) {
  return (
    <PhoneFrame className={className}>
      <MockHeader title="Fechamento · Mesa 8" subtitle="Conta e divisão" />
      <div className="space-y-2 p-2.5">
        <div className="rounded-lg bg-[#242424] p-2">
          <p className="text-[9px] font-bold">Total da mesa</p>
          <p className="text-[14px] font-extrabold text-brand">R$ 312,40</p>
          <p className="text-[8px] text-muted">Taxa de serviço: 10%</p>
        </div>
        <div className="space-y-1">
          <p className="text-[8px] font-bold text-muted">Como fechar?</p>
          {["Minha parte", "Conta inteira", "Dividir por pessoa"].map((opt, i) => (
            <div
              key={opt}
              className={cn(
                "rounded border px-2 py-1 text-[8px]",
                i === 0 ? "border-brand bg-brand/10 font-semibold" : "border-[#333] text-muted",
              )}
            >
              {opt}
            </div>
          ))}
        </div>
        <div className="rounded-lg bg-brand px-2 py-1.5 text-center text-[9px] font-bold text-[#111]">
          Pedir a conta
        </div>
      </div>
    </PhoneFrame>
  );
}

type ProductMockupProps = {
  variant: "guest" | "admin" | "kds" | "waiter" | "closing";
  className?: string;
};

export function ProductMockup({ variant, className }: ProductMockupProps) {
  switch (variant) {
    case "guest":
      return <GuestMenuMockup className={className} />;
    case "admin":
      return <AdminOrdersMockup className={className} />;
    case "kds":
      return <KdsMockup className={className} />;
    case "waiter":
      return <WaiterMockup className={className} />;
    case "closing":
      return <ClosingMockup className={className} />;
  }
}
