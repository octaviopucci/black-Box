import type { MetadataRoute } from "next";
import { storeConfig } from "@/config/store";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${storeConfig.siteUrl}/sitemap.xml`,
  };
}
