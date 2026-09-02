import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="mb-4 inline-flex rounded-full bg-ink/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-mute">
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl font-medium leading-[1.02] tracking-tight text-ink md:text-5xl lg:text-[3.25rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-mute md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
