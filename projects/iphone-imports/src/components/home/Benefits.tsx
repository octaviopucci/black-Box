import { ShieldCheck, MessageCircle, ShoppingCart, Tag } from "lucide-react";

const benefits = [
  { icon: ShieldCheck, title: "Produtos selecionados", desc: "Qualidade e procedência" },
  { icon: MessageCircle, title: "Atendimento rápido", desc: "Fale direto pelo WhatsApp" },
  { icon: ShoppingCart, title: "Compra fácil", desc: "Monte o carrinho e envie o pedido" },
  { icon: Tag, title: "Ofertas especiais", desc: "Promoções exclusivas" },
];

export function Benefits() {
  return (
    <section className="border-y border-brand-border bg-brand-dark">
      <div className="container-store py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-4"
            >
              <div className="mb-3 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-yellow shadow-[0_0_20px_rgba(255,212,0,0.3)] md:mb-0">
                <b.icon className="h-5 w-5 text-brand-black" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{b.title}</h3>
                <p className="mt-0.5 text-xs text-brand-gray">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
