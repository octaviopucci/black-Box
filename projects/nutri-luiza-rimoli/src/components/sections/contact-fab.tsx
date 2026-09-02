"use client";

import { site } from "@/data/site";
import { contactUrl } from "@/lib/contact";

export function ContactFab() {
  return (
    <a
      href={contactUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar pelo Instagram"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-[0_12px_40px_rgba(90,115,72,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-95"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    </a>
  );
}
