import { site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink py-12 text-paper/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="display text-2xl uppercase tracking-wide text-paper">
            {site.name}
          </p>
          <p className="mt-1 text-sm">{site.unit}</p>
        </div>

        <ul className="flex flex-wrap gap-6 text-sm">
          <li>
            <a
              href={site.links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-paper"
            >
              Instagram
            </a>
          </li>
          <li>
            <a
              href={site.links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-paper"
            >
              Facebook
            </a>
          </li>
          <li>
            <a
              href={site.links.delivery}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-paper"
            >
              Delivery
            </a>
          </li>
        </ul>

        <p className="text-xs">© {year} {site.name}. Capão Bonito — SP.</p>
      </div>
    </footer>
  );
}
