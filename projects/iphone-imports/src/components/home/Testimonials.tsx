import { Rating } from "@/components/ui/Rating";

const testimonials = [
  {
    name: "Cliente demo 1",
    text: "Atendimento rápido e produto conforme o anunciado. Recomendo!",
    rating: 5,
  },
  {
    name: "Cliente demo 2",
    text: "Comprei meu iPhone e chegou rapidinho. Muito satisfeito.",
    rating: 5,
  },
  {
    name: "Cliente demo 3",
    text: "Ótimos preços nos acessórios. Já é minha loja de confiança.",
    rating: 4,
  },
];

export function Testimonials() {
  return (
    <section className="section-white py-14 md:py-20">
      <div className="container-store">
        <div className="mb-10 text-center">
          <div className="accent-line mx-auto mb-4" />
          <h2 className="text-2xl font-black md:text-3xl">O que dizem nossos clientes</h2>
          <p className="mt-2 text-sm text-brand-muted">
            Depoimentos ilustrativos — substitua por avaliações reais
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-brand-border-light bg-brand-light p-6 transition-all hover:border-brand-silver/50 hover:shadow-[0_8px_30px_rgba(209,213,219,0.1)]"
            >
              <Rating value={t.rating} demo className="mb-4" />
              <p className="mb-4 text-sm leading-relaxed text-brand-muted">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="text-sm font-bold text-brand-black">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
