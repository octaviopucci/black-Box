import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle, Shield, Star, Wrench } from "lucide-react";
import { storeConfig } from "@/config/store";
import { brandAssets } from "@/data/images";

export function Hero() {
  return (
    <section className="relative overflow-hidden text-white">
      <Image
        src={brandAssets.heroBackground}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />
      <div className="absolute inset-0 brand-gradient-bg opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-brand-blue/30" />
      <div className="absolute inset-0 grid-pattern opacity-25" />
      <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-brand-neon/20 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-blue/30 blur-3xl" />

      <div className="container-store relative z-10">
        <div className="grid items-center gap-10 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-20 lg:py-24">
          <div className="fade-in text-center md:text-left">
            <div className="mb-6 flex justify-center md:justify-start">
              <Image
                src={brandAssets.logo}
                alt={storeConfig.name}
                width={200}
                height={200}
                priority
                className="h-28 w-28 rounded-full object-cover ring-4 ring-brand-neon/40 glow-purple md:h-36 md:w-36"
              />
            </div>

            <h1 className="font-display text-5xl leading-[0.95] tracking-wide md:text-6xl lg:text-7xl neon-glow">
              {storeConfig.name}
            </h1>

            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/85 md:mx-0 md:text-lg">
              {storeConfig.description}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center md:justify-start">
              <a href={storeConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <MessageCircle className="h-4 w-4" />
                Fale com a gente pelo WhatsApp
              </a>
              <a
                href={storeConfig.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <Star className="h-4 w-4" />
                Avalie a loja no Google
              </a>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
              <Link href="/ofertas" className="btn-outline-light text-sm">
                Ver ofertas
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/categoria/eletronicos" className="btn-outline-light text-sm">
                Explorar catálogo
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-brand-gray md:justify-start">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple/30 ring-1 ring-brand-neon/30">
                  <Wrench className="h-5 w-5 text-brand-neon-cyan" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">Assistência técnica</p>
                  <p className="text-xs">iPhone e smartphones</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-purple/30 ring-1 ring-brand-neon/30">
                  <Shield className="h-5 w-5 text-brand-neon" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">Acessórios</p>
                  <p className="text-xs">Peças e gadgets selecionados</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-[2rem] border border-brand-neon/30 bg-brand-black/30 backdrop-blur-sm glow-purple" />
            <div className="absolute inset-6 flex items-center justify-center">
              <Image
                src={brandAssets.logo}
                alt=""
                width={320}
                height={320}
                className="h-auto w-full max-w-[280px] object-contain drop-shadow-[0_0_40px_rgba(188,0,255,0.35)]"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
