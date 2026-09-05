"use client";

import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";
import { openWhatsApp } from "@/lib/whatsapp";

const defaultMessage =
  "Olá André! Gostaria de solicitar um orçamento de tatuagem.";

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(defaultMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        event.preventDefault();
        openWhatsApp(defaultMessage);
      }}
      className="whatsapp-fab fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform duration-200 hover:scale-105 active:scale-95"
      aria-label={`WhatsApp ${site.name}`}
    >
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366]/40" />
      <MessageCircle className="relative h-6 w-6" />
    </a>
  );
}
