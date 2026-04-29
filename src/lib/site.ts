/** Canonical origin for SEO, sitemap, robots, and JSON-LD. Set NEXT_PUBLIC_SITE_URL in production. */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://convert.webnlys.com";
  return raw.replace(/\/$/, "");
}
