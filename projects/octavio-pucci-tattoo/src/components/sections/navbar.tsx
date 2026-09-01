"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/lib/site-config";

export function Navbar() {
  const whatsappUrl = buildWhatsAppUrl();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-8">
        <Link
          href="#topo"
          className="font-heading text-lg tracking-wide text-foreground uppercase md:text-xl"
        >
          {siteConfig.shortName}
        </Link>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ size: "lg" }),
            "h-11 bg-[var(--brand-accent)] px-5 text-base font-semibold text-[var(--brand-ink)] hover:bg-[var(--brand-accent)]/90",
          )}
        >
          <MessageCircle className="size-5" />
          WhatsApp
        </a>
      </div>
    </header>
  );
}
