import { site } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-show-dark py-12 text-white/70">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 md:flex-row md:items-center md:justify-between md:px-8">
        <div>
          <p className="display text-2xl text-white">{site.name}</p>
          <p className="mt-1">{site.unit} · {site.address.city} — {site.address.state}</p>
          <p className="mt-2 text-sm">{site.hours.display} · {site.phone.landline}</p>
        </div>

        <ul className="flex flex-wrap gap-6 text-sm">
          <li>
            <a href={site.links.delivery} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Delivery
            </a>
          </li>
          <li>
            <a href={site.links.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Instagram
            </a>
          </li>
          <li>
            <a href={site.links.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              Facebook
            </a>
          </li>
          <li>
            <a href={site.links.website} target="_blank" rel="noopener noreferrer" className="hover:text-white">
              esfihashow.com
            </a>
          </li>
        </ul>

        <p className="text-xs">© {year} {site.name}. Cardápio sujeito a alterações.</p>
      </div>
    </footer>
  );
}
