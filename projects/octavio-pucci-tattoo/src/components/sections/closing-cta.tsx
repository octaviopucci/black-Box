"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

export function ClosingCta() {
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <section className="relative overflow-hidden bg-[var(--brand-ink)] py-20 md:py-28">
      <div className="grain pointer-events-none absolute inset-0 opacity-20" />
      <div className="relative mx-auto max-w-6xl px-6 text-center md:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-heading mx-auto max-w-2xl text-[clamp(2rem,5vw,3.25rem)] leading-tight text-[var(--brand-paper)] uppercase"
        >
          {siteConfig.heroPromise}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-14 bg-[#25D366] px-10 text-lg font-semibold text-white hover:bg-[#20bd5a]",
            )}
          >
            <MessageCircle className="size-6" />
            Chamar no WhatsApp agora
          </a>
        </motion.div>
      </div>
    </section>
  );
}
