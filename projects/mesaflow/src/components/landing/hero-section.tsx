import Link from "next/link";
import { GuestMenuMockup } from "@/components/landing/product-mockups";

export function HeroSection() {
  return (
    <section className="py-9 sm:py-12">
      <div className="grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr] md:gap-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand">
            NA MESA · sistema de pedidos para salão
          </p>
          <h1 className="mt-3 text-[clamp(1.65rem,4.5vw,2.55rem)] font-extrabold leading-[1.12] tracking-tight">
            Seu cliente já está com o celular na mão. Por que ele ainda precisa chamar alguém para pedir?
          </h1>
          <div className="mt-4 max-w-[36rem] space-y-3 text-[1.02rem] text-muted">
            <p>
              Com o NA MESA, o cliente escaneia o QR da mesa, escolhe o que quer e envia o pedido pelo próprio
              celular.
            </p>
            <p>O pedido entra na operação da casa e chega para quem precisa preparar.</p>
            <p>Sem depender de garçom correndo de mesa em mesa.</p>
            <p>Sem pedido anotado no bloco.</p>
            <p>Sem transformar o rush em telefone sem fio.</p>
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              href="#contato"
              className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-[0.95rem] font-bold text-[#111] transition hover:bg-brand-dark"
            >
              Quero ver o NA MESA funcionando
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-full border border-[#444] bg-transparent px-5 py-3 text-[0.95rem] font-bold transition hover:border-brand/40"
            >
              Como funciona
            </Link>
          </div>
          <p className="mt-4 text-sm font-semibold text-brand">Pedido na mesa. Comanda na cozinha.</p>
        </div>
        <div className="md:justify-self-end">
          <GuestMenuMockup />
        </div>
      </div>
    </section>
  );
}
