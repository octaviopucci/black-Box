import Script from "next/script";
import { FAQ_ITEMS, FAQ_JSON_LD } from "@/components/landing/landing-data";
import { SectionShell } from "@/components/landing/section-shell";

export function FaqSection() {
  return (
    <SectionShell id="faq" title="Perguntas frequentes">
      <Script id="faq-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(FAQ_JSON_LD)}
      </Script>
      <div>
        {FAQ_ITEMS.map(({ question, answer }) => (
          <details key={question} className="border-b border-[#2a2a2a] py-3.5">
            <summary className="cursor-pointer list-none font-bold [&::-webkit-details-marker]:hidden">
              {question}
            </summary>
            <p className="mt-2 text-[0.95rem] text-muted">{answer}</p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}
