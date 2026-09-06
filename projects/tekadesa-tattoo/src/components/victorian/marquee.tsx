"use client";

import { useSite } from "@/i18n/use-site";
import { Marquee } from "@/components/ui/marquee";

export function VictorianMarquee() {
  const site = useSite();
  return <Marquee items={site.principles} className="vic-marquee" />;
}
