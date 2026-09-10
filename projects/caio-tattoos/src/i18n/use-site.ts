"use client";

import { useMemo } from "react";
import { site } from "@/data/site";
import { useLocale } from "@/i18n/locale-provider";

export function useSite() {
  const { t } = useLocale();

  return useMemo(
    () => ({
      ...site,
      nav: t.nav,
      principles: t.principles,
      stats: t.stats,
      styles: site.styles.map((style, index) => ({
        image: style.image,
        anchor: style.anchor,
        title: t.styles[index]!.title,
        tagline: t.styles[index]!.tagline,
        desc: t.styles[index]!.desc,
      })),
      artistTags: t.artistTags,
      artistStory: t.artistStory,
      process: t.process,
      testimonials: t.testimonials,
      formOptions: t.formOptions,
      hours: t.hours,
    }),
    [t],
  );
}
