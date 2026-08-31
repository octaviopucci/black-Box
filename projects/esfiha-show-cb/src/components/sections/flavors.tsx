"use client";

import { motion, useReducedMotion } from "framer-motion";
import { site } from "@/data/site";

function FlavorRow({
  name,
  note,
  index,
}: {
  name: string;
  note: string;
  index: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.li
      className="group flex items-baseline justify-between gap-4 border-b border-ink/10 py-5 md:py-6"
      initial={reduceMotion ? false : { opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <span className="display text-3xl uppercase tracking-wide text-ink md:text-4xl">
        {name}
      </span>
      <span className="text-right text-sm text-mute md:text-base">{note}</span>
    </motion.li>
  );
}

export function Flavors() {
  return (
    <section id="sabores" className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Cardápio
            </p>
            <h2 className="display mt-4 text-[clamp(2.5rem,6vw,4.5rem)] uppercase text-ink">
              Sabores que dão show
            </h2>
            <p className="mt-5 max-w-sm text-mute">
              Esfihas abertas recheadas na hora e pizzas para dividir. O cardápio
              completo — combos, bebidas e promoções — está no delivery oficial.
            </p>
            <a
              href={site.links.delivery}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block text-sm font-semibold uppercase tracking-wider text-brand underline-offset-4 hover:underline"
            >
              Ver cardápio completo →
            </a>
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-mute">
              Esfihas abertas
            </p>
            <ul>
              {site.flavors.esfihas.map((item, i) => (
                <FlavorRow key={item.name} {...item} index={i} />
              ))}
            </ul>

            <p className="mb-2 mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-mute">
              Pizzas
            </p>
            <ul>
              {site.flavors.pizzas.map((item, i) => (
                <FlavorRow
                  key={item.name}
                  {...item}
                  index={i + site.flavors.esfihas.length}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
