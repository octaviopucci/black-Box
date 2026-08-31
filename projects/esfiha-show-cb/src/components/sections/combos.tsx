import { menuCategories, formatPrice } from "@/data/menu";
import { site } from "@/data/site";

const combos = menuCategories.find((c) => c.id === "combos")!.items;

export function Combos() {
  return (
    <section id="combos" className="bg-show-dark py-16 text-white md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-show-yellow">
            Economia
          </p>
          <h2 className="display mt-2 text-4xl md:text-5xl">Combos e caixas</h2>
          <p className="mt-4 text-white/75">
            Caixas de 5 ou 10 esfihas com ingredientes extras, ou combos completos com
            refrigerante 2L para a família.
          </p>
        </div>

        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {combos.map((combo) => (
            <li
              key={combo.name}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div>
                <p className="display text-xl leading-snug text-show-yellow">
                  {combo.name}
                </p>
                {combo.description && (
                  <p className="mt-3 text-sm leading-relaxed text-white/70">
                    {combo.description}
                  </p>
                )}
              </div>
              <p className="price mt-6 text-2xl text-show-green">{formatPrice(combo.price)}</p>
            </li>
          ))}
        </ul>

        <div className="mt-10 text-center">
          <a
            href={site.links.delivery}
            target="_blank"
            rel="noopener noreferrer"
            className="display inline-block rounded-lg bg-show-orange px-10 py-4 text-lg text-show-dark"
          >
            Montar combo no delivery
          </a>
        </div>
      </div>
    </section>
  );
}
