import Image from "next/image";
import { Button } from "@/components/ui/Button";

const heroProducts = [
  {
    src: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-3inch-naturaltitanium?wid=600&hei=600&fmt=png-alpha&qlt=80",
    alt: "iPhone",
    className: "top-0 right-0 w-[45%] z-10",
  },
  {
    src: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2-hero-select-202409?wid=400&hei=400&fmt=png-alpha&qlt=80",
    alt: "AirPods Pro",
    className: "bottom-[10%] left-[5%] w-[30%] z-20",
  },
  {
    src: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/apple-watch-series-10-46mm-rose-gold-aluminum-rose-clover-sport-band-46mm-rose-clover-202409?wid=400&hei=400&fmt=png-alpha&qlt=80",
    alt: "Apple Watch",
    className: "bottom-[5%] right-[15%] w-[28%] z-20",
  },
  {
    src: "https://images.unsplash.com/photo-1591290619769-c4d8d281d761?w=300&h=300&fit=crop",
    alt: "Carregador",
    className: "top-[20%] left-[10%] w-[22%] z-10",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-light">
      <div className="container-store">
        <div className="grid items-center gap-8 py-12 md:grid-cols-2 md:py-20 lg:py-24">
          <div className="fade-in">
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-brand-black md:text-5xl lg:text-[3.25rem]">
              Tecnologia que combina com você.
            </h1>
            <p className="mt-4 max-w-md text-base text-brand-gray md:text-lg">
              iPhones, acessórios e eletrônicos selecionados com ofertas
              especiais e atendimento rápido pelo WhatsApp.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/ofertas">Ver ofertas</Button>
              <Button href="/categoria/iphones" variant="secondary">
                Comprar iPhones
              </Button>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-md md:max-w-none">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-brand-white to-brand-border/50" />
            {heroProducts.map((product) => (
              <div
                key={product.alt}
                className={`absolute ${product.className}`}
              >
                <Image
                  src={product.src}
                  alt={product.alt}
                  width={300}
                  height={300}
                  className="h-auto w-full drop-shadow-lg"
                  priority={product.alt === "iPhone"}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
