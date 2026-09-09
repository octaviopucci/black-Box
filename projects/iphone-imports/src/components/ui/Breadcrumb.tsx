import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-brand-gray">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-brand-black"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-brand-black">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
