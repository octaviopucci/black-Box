"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { site } from "@/data/site";
import { openWhatsApp } from "@/lib/whatsapp";

export function WhatsAppFab() {
  return (
    <motion.a
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Olá, StudioClownTattoo! Gostaria de mais informações.")}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={(event) => {
        event.preventDefault();
        openWhatsApp("Olá, StudioClownTattoo! Gostaria de mais informações.");
      }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-paper shadow-lg shadow-black/40"
      aria-label="WhatsApp StudioClownTattoo"
    >
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  );
}
