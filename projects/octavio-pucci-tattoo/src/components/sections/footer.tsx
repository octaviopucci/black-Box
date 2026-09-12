import Link from "next/link";

import { siteConfig } from "@/lib/site-config";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-center text-sm text-muted-foreground md:flex-row md:px-8 md:text-left">
        <p>
          © {new Date().getFullYear()} {siteConfig.businessName} ·{" "}
          {siteConfig.city}, {siteConfig.state}
        </p>
        <Link
          href={siteConfig.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
        >
          <InstagramIcon className="size-4" />
          {siteConfig.instagramHandle}
        </Link>
      </div>
    </footer>
  );
}
