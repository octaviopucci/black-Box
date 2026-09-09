import type { Metadata } from "next";
import { InstitutionalLayout } from "@/components/layout/InstitutionalLayout";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = {
  title: "Política de privacidade",
};

export default function PrivacyPage() {
  return (
    <InstitutionalLayout title="Política de privacidade">
      <p>
        Esta política descreve como a {storeConfig.name} coleta, utiliza e
        protege suas informações pessoais.
      </p>
      <h2 className="!mt-8 !mb-2 text-lg font-bold text-brand-black">
        Dados coletados
      </h2>
      <p>
        Coletamos apenas informações fornecidas voluntariamente durante o
        atendimento, como nome, telefone e cidade, para processar seu pedido
        via WhatsApp.
      </p>
      <h2 className="!mt-8 !mb-2 text-lg font-bold text-brand-black">
        Uso dos dados
      </h2>
      <p>
        Os dados são utilizados exclusivamente para atendimento comercial e
        processamento de pedidos. Não compartilhamos informações com terceiros
        sem seu consentimento.
      </p>
      <h2 className="!mt-8 !mb-2 text-lg font-bold text-brand-black">
        Armazenamento local
      </h2>
      <p>
        O carrinho e favoritos são armazenados localmente no seu navegador
        (LocalStorage) e não são enviados a servidores externos.
      </p>
      <p className="!mt-8 text-sm italic">
        [Placeholder] Esta política deve ser revisada e personalizada por um
        profissional jurídico antes do lançamento oficial.
      </p>
    </InstitutionalLayout>
  );
}
