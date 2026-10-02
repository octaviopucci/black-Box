"use client";

import { useSite } from "@/i18n/use-site";
import { Marquee } from "@/components/ui/marquee";

export function PrinciplesMarquee() {
  const siteData = useSite();
  return <Marquee items={siteData.principles} />;
}
