import { site } from "@/data/site";

// Server component: ano fica fixo no export estático (sem mismatch de hidratação).
const year = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-line/40 bg-paper py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
          © {year} {site.legalName} · CNPJ {site.cnpj}
        </p>
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute/50">
          {site.city}
        </p>
      </div>
    </footer>
  );
}
