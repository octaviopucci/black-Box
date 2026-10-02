import Link from 'next/link'
import { siteConfig } from '@/site.config'

export function FooterCta() {
  const { footerCta } = siteConfig
  return (
    <section className="bg-accent py-20 text-center text-white md:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="text-section font-bold">{footerCta.title}</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href={footerCta.ctaPrimary.href}
            className="btn-shine rounded-xl bg-white px-6 py-3 font-semibold text-accent"
          >
            {footerCta.ctaPrimary.label}
          </Link>
          <Link
            href={footerCta.ctaSecondary.href}
            className="rounded-xl border border-white/40 px-6 py-3 font-semibold"
          >
            {footerCta.ctaSecondary.label}
          </Link>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  const { contact, nav } = siteConfig
  return (
    <footer className="bg-ink py-16 text-white/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-white">{siteConfig.name}</p>
          <p className="mt-2 text-sm">{siteConfig.description}</p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="text-sm">
          <p>{contact.phone}</p>
          <p className="mt-1">{contact.address}</p>
          <a
            href={`https://wa.me/${contact.whatsapp}`}
            className="mt-3 inline-block text-white hover:underline"
          >
            WhatsApp
          </a>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-6xl border-t border-white/10 px-6 pt-8 text-center text-xs">
        © {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.
      </p>
    </footer>
  )
}
