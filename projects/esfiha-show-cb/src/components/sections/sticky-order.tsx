import { site } from "@/data/site";

export function StickyOrder() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-white/95 p-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden">
      <div className="flex gap-2">
        <a
          href={site.phone.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="display flex-1 rounded-lg border-2 border-show-green-dark py-3 text-center text-sm text-show-green-dark"
        >
          WhatsApp
        </a>
        <a
          href={site.links.delivery}
          target="_blank"
          rel="noopener noreferrer"
          className="display flex-[1.4] rounded-lg bg-show-orange py-3 text-center text-sm text-show-dark"
        >
          Fazer pedido
        </a>
      </div>
    </div>
  );
}
