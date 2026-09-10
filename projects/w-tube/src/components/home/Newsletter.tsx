import { storeConfig } from "@/config/store";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

export function Newsletter() {
  const whatsappUrl = getWhatsAppUrl(
    `Olá! Quero receber ofertas e novidades da ${storeConfig.name}.`
  );

  return (
    <section className="relative overflow-hidden bg-brand-black py-16 md:py-20">
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent" />

      <div className="container-store relative text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-purple shadow-[0_0_30px_rgba(147,51,234,0.4)]">
          <MessageCircle className="h-7 w-7 text-brand-black" />
        </div>
        <h2 className="text-2xl font-black text-white md:text-4xl">
          Receba ofertas exclusivas
        </h2>
        <p className="mx-auto mt-3 max-w-md text-brand-gray">
          Entre em contato pelo WhatsApp e fique por dentro das promoções da
          semana.
        </p>
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 inline-flex">
          Quero receber ofertas
        </a>
      </div>
    </section>
  );
}
