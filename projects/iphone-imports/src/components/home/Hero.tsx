import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Shield, Zap } from "lucide-react";
import { heroImages } from "@/data/images";

const floating = [
  { src: heroImages.iphone, alt: "iPhone", className: "right-[2%] top-[5%] w-[52%] z-20", priority: true },
  { src: heroImages.airpods, alt: "AirPods", className: "left-[0%] bottom-[18%] w-[34%] z-30" },
  { src: heroImages.watch, alt: "Apple Watch", className: "right-[18%] bottom-[8%] w-[30%] z-30" },
  { src: heroImages.charger, alt: "Carregador", className: "left-[12%] top-[22%] w-[24%] z-10" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      <div className="absolute inset-0 grid-pattern opacity-60" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-yellow/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-brand-yellow/5 blur-3xl" />

      <div className="container-store relative">
        <div className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-20 lg:py-28">
          <div className="fade-in">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-yellow">
              <Zap className="h-3.5 w-3.5" />
              Ofertas da semana
            </span>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              Tecnologia que
              <br />
              combina com{" "}
              <span className="text-brand-yellow">você</span>
              <span className="text-brand-yellow">.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-brand-gray md:text-lg">
              iPhones, acessórios e eletrônicos selecionados. Atendimento rápido
              pelo WhatsApp e condições especiais.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ofertas" className="btn-primary">
                Ver ofertas
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/categoria/iphones" className="btn-secondary">
                Comprar iPhones
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-yellow/15">
                  <Shield className="h-5 w-5 text-brand-yellow" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Produtos selecionados</p>
                  <p className="text-xs text-brand-muted">Qualidade e procedência</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-yellow/15">
                  <MessageCircle className="h-5 w-5 text-brand-yellow" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Atendimento rápido</p>
                  <p className="text-xs text-brand-muted">Direto no WhatsApp</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <div className="absolute inset-4 rounded-[2rem] border border-brand-yellow/20 bg-brand-surface/50 glow-yellow" />
            <div className="absolute inset-0 rounded-[2rem] product-image-bg opacity-40" />
            {floating.map((item) => (
              <div key={item.alt} className={`absolute ${item.className}`}>
                <div className="rounded-2xl bg-brand-surface/80 p-3 ring-1 ring-white/10 backdrop-blur-sm">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={400}
                    height={400}
                    className="h-auto w-full drop-shadow-2xl"
                    priority={item.priority}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
