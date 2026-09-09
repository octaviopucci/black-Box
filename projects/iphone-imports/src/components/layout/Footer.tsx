import Link from "next/link";
import { storeConfig } from "@/config/store";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { Logo } from "./Logo";

const institutional = [
  { label: "Sobre nós", href: "/sobre" },
  { label: "Contato", href: "/contato" },
  { label: "Política de privacidade", href: "/politica-de-privacidade" },
  { label: "Termos", href: "/termos" },
  { label: "Trocas e devoluções", href: "/trocas-e-devolucoes" },
];

const footerCategories = [
  { label: "iPhones", href: "/categoria/iphones" },
  { label: "Acessórios", href: "/categoria/eletronicos" },
  { label: "Fones", href: "/categoria/airpods-fones" },
  { label: "Carregadores", href: "/categoria/carregadores" },
  { label: "Capinhas", href: "/categoria/capinhas" },
  { label: "Ofertas", href: "/ofertas" },
];

export function Footer() {
  const whatsappUrl = getWhatsAppUrl(
    `Olá! Gostaria de mais informações sobre a ${storeConfig.name}.`
  );

  return (
    <footer className="border-t border-brand-yellow/20 bg-brand-black text-white">
      <div className="container-store py-12 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4">
              <Logo asLink={false} className="text-lg" />
            </div>
            <p className="text-sm leading-relaxed text-brand-gray">
              {storeConfig.description}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Institucional
            </h4>
            <ul className="space-y-2">
              {institutional.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-gray transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Categorias
            </h4>
            <ul className="space-y-2">
              {footerCategories.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-brand-gray transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider">
              Atendimento
            </h4>
            <ul className="space-y-2 text-sm text-brand-gray">
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-brand-yellow"
                >
                  WhatsApp
                </a>
              </li>
              {storeConfig.instagram && (
                <li>
                  <a
                    href={storeConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-brand-yellow"
                  >
                    Instagram {storeConfig.instagram}
                  </a>
                </li>
              )}
              <li>{storeConfig.hours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-brand-gray">
          © {new Date().getFullYear()} {storeConfig.name}. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  );
}
