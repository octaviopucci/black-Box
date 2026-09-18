import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";
import { DEMO_ESTABLISHMENT_SLUG, DEMO_LOGIN } from "@/lib/demo";

export function DemoSection() {
  return (
    <section id="demo" className="mt-24 scroll-mt-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card flex flex-col justify-center p-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand">Demo gratuita</p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold">Ponto do Sabor</h3>
          <p className="mt-2 text-muted">
            Explore o cardápio, faça pedidos e veja o painel admin funcionando — mesma stack de produção.
          </p>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between border-b border-white/5 py-2">
              <dt className="text-muted">Admin</dt>
              <dd className="font-mono text-xs sm:text-sm">{DEMO_LOGIN.email}</dd>
            </div>
            <div className="flex justify-between border-b border-white/5 py-2">
              <dt className="text-muted">Senha</dt>
              <dd className="font-mono">{DEMO_LOGIN.password}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/admin/login" className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white">
              Painel admin
            </Link>
            <Link
              href={`/m/${DEMO_ESTABLISHMENT_SLUG}/mesa-8`}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/5"
            >
              Mesa demo
            </Link>
            <Link
              href={`/kds/sec_cozinha?slug=${DEMO_ESTABLISHMENT_SLUG}`}
              className="rounded-xl border border-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/5"
            >
              KDS Cozinha
            </Link>
          </div>
        </div>

        <div className="glass-card flex flex-col items-center justify-center p-8 text-center">
          <div className="animate-float mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand/15 ring-1 ring-brand/30">
            <TrendingUp className="h-12 w-12 text-brand" />
          </div>
          <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">
            Camada digital de mesa
          </h3>
          <p className="mt-2 max-w-xs text-sm text-muted">
            Sessão → KDS → conta parcial → OK do restaurante. Tudo conectado à mesa.
          </p>
          <Link
            href="#cadastro"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-semibold text-white"
          >
            Criar conta grátis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
