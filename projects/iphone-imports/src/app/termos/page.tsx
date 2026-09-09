import type { Metadata } from "next";
import { InstitutionalLayout } from "@/components/layout/InstitutionalLayout";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = {
  title: "Termos de uso",
};

export default function TermsPage() {
  return (
    <InstitutionalLayout title="Termos de uso">
      <p>
        Ao utilizar o site da {storeConfig.name}, você concorda com os termos
        descritos abaixo.
      </p>
      <h2 className="!mt-8 !mb-2 text-lg font-bold text-brand-black">
        Uso do site
      </h2>
      <p>
        O site é destinado à consulta de produtos e montagem de pedidos. O
        pagamento e confirmação de compra são realizados via atendimento pelo
        WhatsApp.
      </p>
      <h2 className="!mt-8 !mb-2 text-lg font-bold text-brand-black">
        Preços e disponibilidade
      </h2>
      <p>
        Os preços exibidos são demonstrativos e podem ser alterados sem aviso
        prévio. A disponibilidade dos produtos deve ser confirmada no
        atendimento.
      </p>
      <h2 className="!mt-8 !mb-2 text-lg font-bold text-brand-black">
        Propriedade intelectual
      </h2>
      <p>
        Todo o conteúdo do site (textos, imagens, layout) é de propriedade da
        {storeConfig.name}, exceto imagens de produtos de fabricantes.
      </p>
      <p className="!mt-8 text-sm italic">
        [Placeholder] Termos comerciais específicos devem ser definidos pelo
        lojista e revisados juridicamente.
      </p>
    </InstitutionalLayout>
  );
}
