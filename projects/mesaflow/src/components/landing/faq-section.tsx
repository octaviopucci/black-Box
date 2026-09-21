import Script from "next/script";
import { FAQ_ITEMS, FAQ_JSON_LD } from "@/components/landing/landing-data";

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-16 py-11">
      <Script id="faq-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(FAQ_JSON_LD)}
      </Script>
      <h2 className="text-[clamp(1.35rem,3vw,1.85rem)] font-extrabold leading-tight">
        Perguntas que o lojista faz
      </h2>
      <div className="mt-2">
        {FAQ_ITEMS.map(({ question, answer }) => (
          <details key={question} className="border-b border-[#2a2a2a] py-3.5">
            <summary className="cursor-pointer list-none font-bold [&::-webkit-details-marker]:hidden">
              {question}
            </summary>
            <p className="mt-2 text-[0.95rem] text-muted">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
