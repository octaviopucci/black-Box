import { ShieldCheck, MessageCircle, ShoppingCart, Tag } from "lucide-react";

const benefits = [
  {
    icon: ShieldCheck,
    title: "Produtos selecionados",
    description: "Qualidade e procedência.",
  },
  {
    icon: MessageCircle,
    title: "Atendimento rápido",
    description: "Fale diretamente pelo WhatsApp.",
  },
  {
    icon: ShoppingCart,
    title: "Compra fácil",
    description: "Monte seu carrinho e envie seu pedido.",
  },
  {
    icon: Tag,
    title: "Ofertas especiais",
    description: "Promoções e condições exclusivas.",
  },
];

export function Benefits() {
  return (
    <section className="border-y border-brand-border bg-white py-8">
      <div className="container-store">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="flex flex-col items-center text-center md:flex-row md:items-start md:text-left md:gap-3">
              <div className="mb-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-yellow/15 md:mb-0">
                <benefit.icon className="h-5 w-5 text-brand-black" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-brand-black">
                  {benefit.title}
                </h3>
                <p className="mt-0.5 text-xs text-brand-gray">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
