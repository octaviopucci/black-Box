import type { Metadata } from "next";
import { InstitutionalLayout } from "@/components/layout/InstitutionalLayout";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = {
  title: "Trocas e devoluções",
};

export default function ReturnsPage() {
  return (
    <InstitutionalLayout title="Trocas e devoluções">
      <p>
        A {storeConfig.name} trabalha para garantir sua satisfação em cada
        compra. Consulte abaixo as diretrizes gerais para trocas e devoluções.
      </p>
      <h2 className="!mt-8 !mb-2 text-lg font-bold text-brand-black">
        Prazo para troca
      </h2>
      <p>
        [Placeholder] Defina o prazo de troca conforme a política comercial da
        loja (ex.: 7 dias para arrependimento conforme CDC).
      </p>
      <h2 className="!mt-8 !mb-2 text-lg font-bold text-brand-black">
        Condições
      </h2>
      <p>
        O produto deve estar em perfeitas condições, com embalagem original e
        todos os acessórios inclusos. Produtos com sinais de uso podem não ser
        elegíveis para troca.
      </p>
      <h2 className="!mt-8 !mb-2 text-lg font-bold text-brand-black">
        Como solicitar
      </h2>
      <p>
        Entre em contato pelo WhatsApp informando o número do pedido, motivo da
        troca/devolução e fotos do produto, se necessário.
      </p>
      <p className="!mt-8 text-sm italic">
        [Placeholder] Regras comerciais específicas devem ser configuradas pelo
        lojista.
      </p>
    </InstitutionalLayout>
  );
}
