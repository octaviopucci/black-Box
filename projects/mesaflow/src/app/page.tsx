import Link from "next/link";
import { SignupSection } from "@/components/auth/signup-section";
import { Logo } from "@/components/brand/logo";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import {
  ArrowRight,
  ChefHat,
  LayoutDashboard,
  Smartphone,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { DEMO_ESTABLISHMENT_SLUG, DEMO_LOGIN } from "@/lib/demo";

const FEATURES = [
  {
    icon: Smartphone,
    title: "Experiência na mesa",
    desc: "Cliente pede pelo celular — cardápio, carrinho e acompanhamento em tempo real.",
  },
  {
    icon: ChefHat,
    title: "Cozinha e bar conectados",
    desc: "Pedidos chegam instantaneamente no KDS. Cozinha, balcão e bar em sincronia.",
  },
  {
    icon: Users,
    title: "Operação integrada",
    desc: "Mesas, comandas, rodízio e fechamento — tudo em um fluxo único.",
  },
  {
    icon: LayoutDashboard,
    title: "Painel completo",
    desc: "Dashboard, pedidos, produtos e QR Codes em um painel simples para o time.",
  },
];

const ESTABLISHMENTS = [
  "restaurantes",
  "bares",
  "lanchonetes",
  "cafeterias",
  "padarias",
  "pizzarias",
  "rodízios",
];

const STEPS = [
  { n: "01", title: "Cadastre", desc: "Crie sua conta em poucos minutos" },
  { n: "02", title: "Configure", desc: "Mesas, cardápio e setores prontos" },
  { n: "03", title: "Ative", desc: "QR nas mesas e operação rodando" },
];

export default function HomePage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-surface">
      <div className="pointer-events-none absolute inset-0 mesh-bg" />
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-40 h-64 w-64 rounded-full bg-brand-soft/10 blur-3xl" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo showTagline />
        <div className="flex items-center gap-3">
          <Link href="/admin/login" className="hidden text-sm font-medium text-muted transition hover:text-ink sm:block">
            Entrar
          </Link>
          <Link
            href="#cadastro"
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
          >
            Começar grátis
          </Link>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-20 pt-8 sm:pt-16">
        <section className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            {BRAND_TAGLINE}
          </div>
          <h1 className="mx-auto max-w-3xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] sm:text-6xl">
            {BRAND_TAGLINE.replace(".", "")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">{BRAND_DESCRIPTION}</p>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted/80">
            Para {ESTABLISHMENTS.join(", ")} e qualquer estabelecimento com atendimento por mesa.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#cadastro"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand px-8 py-4 text-base font-semibold text-white shadow-xl shadow-brand/25 transition hover:bg-brand-dark"
            >
              Conhecer o {BRAND_NAME}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold backdrop-blur transition hover:bg-white/10"
            >
              Ver como funciona
            </Link>
          </div>
        </section>

        <section className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-6 transition hover:border-brand/20">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="font-[family-name:var(--font-display)] font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{desc}</p>
            </div>
          ))}
        </section>

        <section id="como-funciona" className="mt-24 scroll-mt-8">
          <h2 className="text-center font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
            Como funciona
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted">
            O cliente pede. O restaurante recebe. Tudo acontece {BRAND_NAME}.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="relative text-center">
                <span className="font-[family-name:var(--font-display)] text-5xl font-black text-brand/20">{n}</span>
                <h3 className="mt-2 font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 grid gap-6 lg:grid-cols-2">
          <div className="glass-card flex flex-col justify-center p-8">
            <div className="mb-3 flex items-center gap-2 text-brand">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">Demo gratuita</span>
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold">Ponto do Sabor</h3>
            <p className="mt-2 text-muted">
              Explore o cardápio, faça pedidos e veja o painel admin do {BRAND_NAME} funcionando.
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
            <div className="animate-float mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-brand/15 ring-1 ring-brand/30">
              <TrendingUp className="h-12 w-12 text-brand" />
            </div>
            <h3 className="font-[family-name:var(--font-display)] text-xl font-bold">Tudo da mesa, em um só lugar</h3>
            <p className="mt-2 max-w-xs text-sm text-muted">
              Cardápio, pedido, cozinha e operação conectados à mesa — sem complicação.
            </p>
            <Link
              href="#cadastro"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-semibold text-white"
            >
              Criar conta grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        <SignupSection />
      </main>

      <footer className="relative border-t border-white/5 py-8 text-center text-xs text-muted">
        {BRAND_NAME} · {BRAND_DESCRIPTION}
      </footer>
    </div>
  );
}
