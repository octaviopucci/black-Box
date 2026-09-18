import Link from "next/link";
import { SignupSection } from "@/components/auth/signup-section";
import { Logo } from "@/components/brand/logo";
import { ComparisonTable } from "@/components/landing/comparison-table";
import { DemoSection } from "@/components/landing/demo-section";
import { FeatureHighlights } from "@/components/landing/feature-highlights";
import { HowItWorks } from "@/components/landing/how-it-works";
import { KitOperation } from "@/components/landing/kit-operation";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { ArrowRight, Sparkles } from "lucide-react";

const AUDIENCE = ["rodízios", "bares", "casas de carne", "padarias com mesa", "restaurantes presenciais"];

export default function HomePage() {
  return (
    <div className="relative min-h-dvh overflow-hidden bg-surface">
      <div className="pointer-events-none absolute inset-0 mesh-bg" />
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-40 h-64 w-64 rounded-full bg-brand-soft/10 blur-3xl" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Logo showTagline />
        <div className="flex items-center gap-3">
          <Link
            href="/admin/login"
            className="hidden text-sm font-medium text-muted transition hover:text-ink sm:block"
          >
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
        {/* Hero */}
        <section className="text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            {BRAND_TAGLINE}
          </div>
          <h1 className="mx-auto max-w-4xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.08] sm:text-6xl">
            <span className="text-gradient">{BRAND_NAME}</span>
            <span className="mt-2 block text-2xl font-semibold text-ink/90 sm:text-4xl">
              A camada digital de mesa para quem vive do salão
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Sessão na mesa → pedido no KDS → conta parcial ou individual → OK do restaurante antes de
            liberar. Kit físico elegante, operação completa e suporte próximo —{" "}
            <strong className="font-semibold text-ink">mais por menos</strong>.
          </p>
          <p className="mx-auto mt-4 text-sm text-muted/80">
            Para {AUDIENCE.join(", ")} — onde a dor é giro de mesa e divisão de conta, não delivery.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="#cadastro"
              className="inline-flex items-center gap-2 rounded-2xl bg-brand px-8 py-4 text-base font-semibold text-white shadow-xl shadow-brand/25 transition hover:bg-brand-dark"
            >
              Quero NA MESA no meu restaurante
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

        <ComparisonTable />
        <HowItWorks />
        <KitOperation />
        <FeatureHighlights />
        <DemoSection />

        {/* Final CTA */}
        <section className="mt-24 text-center">
          <div className="glass-panel mx-auto max-w-2xl p-10">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold sm:text-3xl">
              Pronto para acelerar o giro de mesa?
            </h2>
            <p className="mt-3 text-muted">
              Plano de entrada já inclui o que o mercado trata como premium. Cadastre-se ou explore a demo
              — sem compromisso.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="#cadastro"
                className="inline-flex items-center gap-2 rounded-2xl bg-brand px-8 py-4 font-semibold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-dark"
              >
                Criar conta grátis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-8 py-4 font-semibold transition hover:bg-white/5"
              >
                Ver demo ao vivo
              </Link>
            </div>
          </div>
        </section>

        <SignupSection />
      </main>

      <footer className="relative border-t border-white/5 py-8 text-center text-xs text-muted">
        {BRAND_NAME} · Camada digital de mesa · Seu pedido, sem espera.
      </footer>
    </div>
  );
}
