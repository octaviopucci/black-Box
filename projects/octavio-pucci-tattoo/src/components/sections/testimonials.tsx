import { testimonials } from "@/lib/site-config";

export function Testimonials() {
  return (
    <section id="avaliacoes" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <h2 className="font-heading text-3xl text-foreground uppercase md:text-4xl">
          Quem já tatuou
        </h2>

        <ul className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((item) => (
            <li
              key={item.name}
              className="border-l-2 border-[var(--brand-accent)] pl-6"
            >
              <p className="text-foreground leading-relaxed">&ldquo;{item.text}&rdquo;</p>
              <footer className="mt-4">
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.detail}</p>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
