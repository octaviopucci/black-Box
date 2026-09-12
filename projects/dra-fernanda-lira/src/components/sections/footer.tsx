import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line/60 px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-2xl text-ink">{site.name}</p>
          <p className="mt-1 text-sm text-mute">{site.tagline}</p>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-accent transition-colors hover:text-ink"
          >
            {site.instagram.handle}
          </a>
        </div>

        <div className="max-w-md text-xs leading-relaxed text-mute">
          <p>{site.legal.note}</p>
          <p className="mt-2">{site.legal.crm}</p>
        </div>
      </div>
    </footer>
  );
}
