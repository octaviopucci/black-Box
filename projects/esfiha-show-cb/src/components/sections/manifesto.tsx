import { site } from "@/data/site";

export function Manifesto() {
  return (
    <section className="border-y border-border bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-show-green-dark">
              Desde Capão Bonito
            </p>
            <h2 className="display mt-3 text-4xl text-show-dark md:text-5xl">
              Todo sabor dá um show
            </h2>
          </div>
          <p className="text-lg leading-relaxed text-show-muted md:text-xl">
            {site.manifesto}
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {site.features.map((f) => (
            <li key={f.label} className="border-l-4 border-show-green pl-4">
              <p className="display text-lg text-show-dark">{f.label}</p>
              <p className="mt-1 text-sm text-show-muted">{f.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
