import { storeConfig } from "@/config/store";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const whatsappUrl = getWhatsAppUrl(
    `Olá! Quero receber ofertas e novidades da ${storeConfig.name}.`
  );

  return (
    <section className="bg-brand-black py-12 md:py-16">
      <div className="container-store text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          Receba ofertas exclusivas
        </h2>
        <p className="mx-auto mt-2 max-w-md text-brand-gray">
          Entre em contato pelo WhatsApp e fique por dentro das promoções da
          semana.
        </p>
        <div className="mt-6">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button>Quero receber ofertas</Button>
          </a>
        </div>
      </div>
    </section>
  );
}
