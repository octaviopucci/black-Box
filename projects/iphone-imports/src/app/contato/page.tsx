import type { Metadata } from "next";
import { InstitutionalLayout } from "@/components/layout/InstitutionalLayout";
import { storeConfig } from "@/config/store";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description: `Entre em contato com a ${storeConfig.name} pelo WhatsApp ou Instagram.`,
};

export default function ContactPage() {
  const whatsappUrl = getWhatsAppUrl(
    `Olá! Gostaria de mais informações sobre a ${storeConfig.name}.`
  );

  return (
    <InstitutionalLayout title="Contato">
      <p>
        Fale conosco pelo WhatsApp para tirar dúvidas, consultar disponibilidade
        e condições de pagamento.
      </p>
      <div className="space-y-3 !text-brand-black">
        <p>
          <strong>WhatsApp:</strong>{" "}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-black underline hover:text-brand-silver"
          >
            Clique para conversar
          </a>
        </p>
        {storeConfig.instagram && (
          <p>
            <strong>Instagram:</strong>{" "}
            <a
              href={storeConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-brand-silver"
            >
              {storeConfig.instagram}
            </a>
          </p>
        )}
        <p>
          <strong>Horário de atendimento:</strong> {storeConfig.hours}
        </p>
        {storeConfig.email && (
          <p>
            <strong>E-mail:</strong> {storeConfig.email}
          </p>
        )}
        {storeConfig.address && (
          <p>
            <strong>Endereço:</strong> {storeConfig.address}
            {storeConfig.city && ` — ${storeConfig.city}`}
            {storeConfig.state && `/${storeConfig.state}`}
          </p>
        )}
        {!storeConfig.address && (
          <p className="text-sm italic text-brand-gray">
            [Placeholder] Endereço da loja a ser configurado em
            src/config/store.ts
          </p>
        )}
      </div>
    </InstitutionalLayout>
  );
}
