import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { storeConfig } from "@/config/store";
import { brandAssets } from "@/data/images";

interface LogoProps {
  className?: string;
  imageClassName?: string;
  asLink?: boolean;
  showText?: boolean;
}

export function Logo({
  className,
  imageClassName,
  asLink = true,
  showText = true,
}: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image
        src={brandAssets.logo}
        alt={storeConfig.name}
        width={44}
        height={44}
        className={cn("h-10 w-10 rounded-full object-cover ring-2 ring-brand-neon/50 md:h-11 md:w-11", imageClassName)}
        priority
      />
      {showText && (
        <span className="font-display text-xl leading-none tracking-wide text-white md:text-2xl">
          {storeConfig.shortName}
          <span className="ml-1 text-sm font-sans font-medium normal-case tracking-normal text-brand-neon-cyan">
            acess
          </span>
        </span>
      )}
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" className="shrink-0">
      {content}
    </Link>
  );
}
