"use client";

import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";
import { openWhatsApp } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Olá, StudioClownTattoo! Gostaria de mais informações.")}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => {
        event.preventDefault();
        openWhatsApp("Olá, StudioClownTattoo! Gostaria de mais informações.");
      }}
      className="whatsapp-fab fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-paper shadow-lg shadow-black/30 transition-transform duration-200 hover:scale-105 active:scale-95"
      aria-label="WhatsApp StudioClownTattoo"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
