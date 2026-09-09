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
    <section className="py-12 md:py-16">
      <div className="container-store">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">O que dizem nossos clientes</h2>
          <p className="mt-2 text-sm text-brand-gray">
            Depoimentos ilustrativos — substitua por avaliações reais
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-brand-border bg-white p-6"
            >
              <Rating value={t.rating} demo className="mb-3" />
              <p className="mb-4 text-sm leading-relaxed text-brand-gray">
                &ldquo;{t.text}&rdquo;
              </p>
              <p className="text-sm font-semibold">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
