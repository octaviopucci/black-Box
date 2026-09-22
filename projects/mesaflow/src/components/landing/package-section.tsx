import Image from "next/image";
import { SectionShell } from "@/components/landing/section-shell";
import { asset } from "@/lib/assets";

const KIT_IMAGES = [
  {
    src: "/landing/kit/kit-placa-peca-pelo-celular.webp",
    alt: "Placa NA MESA: Peça pelo celular",
  },
  {
    src: "/landing/kit/kit-placa-wifi-duplo.webp",
    alt: "Placa NA MESA: QR da mesa e Wi-Fi",
  },
  {
    src: "/landing/kit/kit-placa-como-usar.webp",
    alt: "Placa NA MESA: Como usar na mesa",
  },
] as const;

export function PackageSection() {
  return (
    <SectionShell id="pacote" title="Olhe o pacote inteiro">
      <p className="max-w-[38rem] text-muted">
        Por R$997 no ano: pedido QR, comanda, garçom no celular, gestão mesas, consumo, pedido de conta,
        taxa, divisão, ajustes, kit físico, implantação.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {KIT_IMAGES.map(({ src, alt }) => (
          <figure key={src} className="overflow-hidden rounded-xl border border-[#2a2a2a] bg-[#1a1a1a]">
            <Image
              src={asset(src)}
              alt={alt}
              width={600}
              height={750}
              loading="lazy"
              className="h-auto w-full"
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            />
          </figure>
        ))}
      </div>
    </SectionShell>
  );
}
