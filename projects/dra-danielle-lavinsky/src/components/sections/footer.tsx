import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line/60 bg-paper py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 text-center text-sm text-mute md:px-10">
        <p>
          {site.name} · {site.cro} ·{" "}
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            {site.instagram.handle}
          </a>
        </p>
        <p className="text-xs">{site.legal.note}</p>
      </div>
    </footer>
  );
}
