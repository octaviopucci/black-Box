import { site } from "@/data/site";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

export function Proof() {
  return (
    <section id="prova" className="border-t border-line/60 bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <Reveal>
          <SectionHeader
            eyebrow="Credenciais"
            title="Números que importam"
            description="Dados públicos do perfil e da clínica."
          />
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {site.proof.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08}>
              <div className="border-t-2 border-accent pt-6">
                <p className="whitespace-pre-line font-display text-5xl font-medium leading-none text-accent md:text-6xl">
                  {item.value}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-mute">
                  {item.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
