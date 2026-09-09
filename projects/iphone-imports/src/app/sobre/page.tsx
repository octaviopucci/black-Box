import type { Metadata } from "next";
import { InstitutionalLayout } from "@/components/layout/InstitutionalLayout";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = {
  title: "Sobre nós",
  description: `Conheça a ${storeConfig.name} — iPhones, acessórios e eletrônicos com atendimento personalizado.`,
};

export default function AboutPage() {
  return (
    <InstitutionalLayout title="Sobre nós">
      <p>
        A <strong className="text-brand-black">{storeConfig.name}</strong> é uma
        loja independente especializada em smartphones, iPhones, acessórios e
        eletrônicos selecionados.
      </p>
      <p>
        Nosso compromisso é oferecer produtos de qualidade com atendimento
        rápido e personalizado, diretamente pelo WhatsApp. Trabalhamos com
        curadoria criteriosa para garantir a melhor experiência de compra.
      </p>
      <p>
        <em className="text-sm">
          [Placeholder] Adicione aqui a história da loja, missão e valores
          específicos da iPhone Imports.
        </em>
      </p>
    </InstitutionalLayout>
  );
}
