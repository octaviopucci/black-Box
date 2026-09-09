"use client";

import { MessageCircle } from "lucide-react";
import { storeConfig } from "@/config/store";
import { getWhatsAppUrl } from "@/lib/whatsapp";

export function WhatsAppButton() {
  const url = getWhatsAppUrl(
    `Olá! Gostaria de mais informações sobre a ${storeConfig.name}.`
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-4 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-transform duration-200 hover:scale-105 active:scale-95 md:bottom-8 md:right-6"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden text-sm font-semibold sm:inline">Fale conosco</span>
    </a>
  );
}
