import Link from "next/link";
import { DEMO_ESTABLISHMENT_SLUG, DEMO_LOGIN } from "@/lib/demo";

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-surface via-surface-2 to-surface">
      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-16 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.3em] text-brand">MesaFlow</p>
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold sm:text-5xl">
          Garçom digital + pedidos em tempo real
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          QR Code na mesa → cardápio no celular → pedido direto na cozinha, balcão ou bar.
        </p>

        <div className="mt-10 grid w-full max-w-lg gap-3 sm:grid-cols-2">
          <Link
            href={`/m/${DEMO_ESTABLISHMENT_SLUG}/mesa-8`}
            className="rounded-2xl bg-brand px-6 py-4 font-semibold text-white transition hover:bg-brand-dark"
          >
            Demo cliente · Mesa 08
          </Link>
          <Link
            href="/admin"
            className="rounded-2xl border border-white/10 bg-surface-2 px-6 py-4 font-semibold transition hover:bg-surface-3"
          >
            Painel do estabelecimento
          </Link>
          <Link
            href="/kds/sec_cozinha"
            className="rounded-2xl border border-white/10 bg-surface-2 px-6 py-4 font-semibold transition hover:bg-surface-3"
          >
            KDS Cozinha
          </Link>
          <Link
            href="/kds/sec_balcao"
            className="rounded-2xl border border-white/10 bg-surface-2 px-6 py-4 font-semibold transition hover:bg-surface-3"
          >
            KDS Balcão
          </Link>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-surface-2/80 p-6 text-left text-sm">
          <p className="font-semibold text-brand">Demo · Ponto do Sabor</p>
          <p className="mt-2 text-muted">Admin: {DEMO_LOGIN.email} / {DEMO_LOGIN.password}</p>
          <p className="text-muted">Loja: {DEMO_ESTABLISHMENT_SLUG} · 10 mesas · 15 produtos</p>
        </div>
      </div>
    </div>
  );
}
