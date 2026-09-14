"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Image from "next/image";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <section
      id="topo"
      className="relative min-h-[92svh] overflow-hidden bg-[var(--brand-ink)]"
    >
      <Image
        src="https://images.unsplash.com/photo-1598371839698-5c5cee11711d?auto=format&fit=crop&w=1920&q=80"
        alt="Close de agulha de tatuagem em pele"
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-ink)] via-[var(--brand-ink)]/80 to-[var(--brand-ink)]/60" />
      <div className="grain pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-end px-6 pb-16 pt-28 md:px-8 md:pb-24">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-sm font-medium tracking-[0.2em] text-[var(--brand-accent)] uppercase"
        >
          {siteConfig.tagline}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading max-w-3xl text-[clamp(2.5rem,8vw,4.75rem)] leading-[0.95] text-[var(--brand-paper)] uppercase"
        >
          {siteConfig.heroPromise}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-10"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ size: "lg" }),
              "h-14 w-full max-w-md bg-[#25D366] px-8 text-lg font-semibold text-white hover:bg-[#20bd5a] sm:w-auto",
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
