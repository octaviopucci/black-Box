import { cn } from "@/lib/cn";

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  titleAs?: "h1" | "h2" | "h3";
};

export function SectionShell({
  id,
  eyebrow,
  title,
  children,
  className,
  titleAs: TitleTag = "h2",
}: SectionShellProps) {
  return (
    <section id={id} className={cn("scroll-mt-16 py-11", className)}>
      {eyebrow ? (
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-brand">{eyebrow}</p>
      ) : null}
      <TitleTag className="text-[clamp(1.35rem,3vw,1.85rem)] font-extrabold leading-tight">{title}</TitleTag>
      <div className="mt-4">{children}</div>
    </section>
  );
}
