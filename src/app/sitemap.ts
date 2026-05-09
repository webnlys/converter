import type { MetadataRoute } from "next";
import {
  PROGRAMMATIC_ALIAS_SLUGS,
  PROGRAMMATIC_PREGENERATED_AMOUNTS,
} from "@/lib/programmaticTakaPages";
import { getSiteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const programmaticUrls: MetadataRoute.Sitemap = [];

  const numericSlugs = new Set<string>();
  for (const n of PROGRAMMATIC_PREGENERATED_AMOUNTS) {
    numericSlugs.add(String(n));
  }
  for (const target of Object.values(PROGRAMMATIC_ALIAS_SLUGS)) {
    numericSlugs.add(target.replace(/^0+/, "") || "0");
  }

  for (const slug of numericSlugs) {
    if (slug === "0") continue;
    programmaticUrls.push({
      url: `${base}/taka-in-words/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    });
  }

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...programmaticUrls,
  ];
}
