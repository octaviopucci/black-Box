import Image from "next/image";
import Link from "next/link";
import { feedStrip, works } from "@/data/site";

export function Works() {
  return (
    <section aria-labelledby="works-heading">
      <div className="border-b-2 border-[var(--ink)] px-6 py-8 md:px-12">
        <h2
          id="works-heading"
          className="font-mono text-[11px] uppercase tracking-[0.45em] text-[var(--accent)]"
        >
          Trabalhos · feed @octaviopuccitattoo
        </h2>
      </div>

      {works.map((work, index) => (
        <article
          key={work.id}
          className={`grid border-b-2 border-[var(--ink)] md:grid-cols-2 ${
            index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          <Link
            href={work.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block min-h-[320px] overflow-hidden bg-[var(--paper-warm)] md:min-h-[480px]"
          >
            <Image
              src={work.image}
              alt={work.label ?? `Trabalho ${work.id}`}
              fill
              className="object-cover transition-[filter] duration-500 group-hover:brightness-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </Link>
          <div className="flex flex-col justify-center border-t-2 border-[var(--ink)] px-6 py-10 md:border-t-0 md:border-l-2 md:px-12 md:py-16">
            {work.label && (
              <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-[var(--accent)]">
                {work.label}
              </p>
            )}
            {work.note && (
              <p className="font-serif mt-4 text-2xl leading-snug text-[var(--ink)] md:text-3xl">
                {work.note}
              </p>
            )}
            <Link
              href={work.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--mute)] hover:text-[var(--ink)]"
            >
              Ver post →
            </Link>
          </div>
        </article>
      ))}

      <div className="overflow-x-auto border-b-2 border-[var(--ink)] bg-[var(--paper)]">
        <ul className="flex w-max gap-0">
          {feedStrip.map((item) => (
            <li key={item.id} className="border-r-2 border-[var(--ink)] last:border-r-0">
              <Link
                href={item.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Image
                  src={item.image}
                  alt={`Feed ${item.id}`}
                  width={240}
                  height={300}
                  className="h-[200px] w-[160px] object-cover md:h-[280px] md:w-[220px]"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
