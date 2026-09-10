import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Shield, Zap } from "lucide-react";
import { heroImages, heroBackground } from "@/data/images";

const floating = [
  { src: heroImages.iphone, alt: "Smartphone", className: "right-[2%] top-[5%] w-[52%] z-20", priority: true },
  { src: heroImages.airpods, alt: "Fones", className: "left-[0%] bottom-[18%] w-[34%] z-30" },
  { src: heroImages.watch, alt: "Smartwatch", className: "right-[18%] bottom-[8%] w-[30%] z-30" },
  { src: heroImages.charger, alt: "Carregador", className: "left-[12%] top-[22%] w-[24%] z-10" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      <Image
        src={heroBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/92 to-brand-black/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-brand-black/40" />
      <div className="absolute inset-0 grid-pattern opacity-40" />
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-purple/15 blur-3xl" />

      <div className="container-store relative z-10">
        <div className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-20 lg:py-28">
          <div className="fade-in">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-purple/40 bg-brand-purple/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-purple-glow backdrop-blur-sm">
              <Zap className="h-3.5 w-3.5" />
              W-Tube · tech premium
            </span>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              Tecnologia que
              <br />
              combina com{" "}
              <span className="text-brand-purple">você</span>
              <span className="text-brand-purple">.</span>
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-brand-gray md:text-lg">
              Eletrônicos, acessórios e gadgets selecionados.
              Atendimento rápido pelo WhatsApp.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/ofertas" className="btn-primary">
                Ver ofertas
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/categoria/eletronicos" className="btn-secondary">
                Explorar catálogo
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-brand-gray">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple/15">
                  <Shield className="h-5 w-5 text-brand-purple" />
                </div>
                <div>
                  <p className="font-bold text-white">Garantia</p>
                  <p className="text-xs">Produtos originais</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple/15">
                  <MessageCircle className="h-5 w-5 text-brand-purple" />
                </div>
                <div>
                  <p className="font-bold text-white">WhatsApp</p>
                  <p className="text-xs">Resposta rápida</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-lg">
            <div className="absolute inset-4 rounded-[2rem] border border-brand-purple/25 bg-brand-black/40 glow-purple backdrop-blur-sm" />
            {floating.map((item) => (
              <div
                key={item.alt}
                className={`absolute drop-shadow-2xl transition-transform duration-500 hover:scale-105 ${item.className}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={400}
                  height={400}
                  priority={item.priority}
                  className="h-auto w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
