/**
 * Programmatic SEO: amount-specific URLs under /taka-in-words/[slug].
 * Expand PROGRAMMATIC_PREGENERATED_AMOUNTS over time; aliases capture natural-language slugs.
 */

/** Integer string after normalization (no leading zeros, never "0"). */
export type ResolvedProgrammaticSlug = {
  integerStr: string;
  /** Always numeric slug — canonical URL path segment */
  canonicalSlug: string;
};

/** Built at build time + listed on sitemap; visiting other valid integers still works when dynamicParams is true. */
export const PROGRAMMATIC_PREGENERATED_AMOUNTS: readonly number[] = [
  100, 500, 1000, 2500, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 40000,
  50000, 60000, 75000, 80000, 90000, 100000, 110000, 125000, 150000, 175000,
  200000, 225000, 250000, 300000, 350000, 400000, 450000, 500000, 600000,
  750000, 800000, 900000, 1000000, 1500000, 2000000, 2500000, 5000000,
  10000000, 25000000, 50000000, 100000000,
];

/**
 * Friendly slugs → integer digit string (canonical URL uses numeric slug only).
 */
export const PROGRAMMATIC_ALIAS_SLUGS: Readonly<Record<string, string>> = {
  "1-crore": "10000000",
  "one-crore": "10000000",
  "half-crore": "5000000",
  "1-lakh": "100000",
  "one-lakh": "100000",
  "10-lakh": "1000000",
  "125-thousand": "125000",
};

const MAX_INTEGER_DIGITS = 15;

export function formatWesternCommaDigits(integerStr: string): string {
  return integerStr.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** Short list for homepage internal links */
export const PROGRAMMATIC_HOME_HIGHLIGHTS: readonly number[] = [
  50000, 125000, 100000, 500000, 1000000, 10000000,
];

export function normalizeTakaIntegerString(raw: string): string | null {
  const stripped = raw.replace(/^0+/, "") || "0";
  if (stripped === "0") return null;
  if (!/^\d+$/.test(stripped)) return null;
  if (stripped.length > MAX_INTEGER_DIGITS) return null;
  return stripped;
}

export function resolveProgrammaticSlug(
  slug: string,
): ResolvedProgrammaticSlug | null {
  const key = decodeURIComponent(slug).trim().toLowerCase();
  if (!key) return null;

  const aliasTarget = PROGRAMMATIC_ALIAS_SLUGS[key];
  if (aliasTarget !== undefined) {
    const normalized = normalizeTakaIntegerString(aliasTarget);
    if (!normalized) return null;
    return { integerStr: normalized, canonicalSlug: normalized };
  }

  if (!/^\d+$/.test(key)) return null;
  const normalized = normalizeTakaIntegerString(key);
  if (!normalized) return null;
  return { integerStr: normalized, canonicalSlug: normalized };
}

export function getRelatedCanonicalSlugs(
  canonicalSlug: string,
  limit = 8,
): string[] {
  const sorted = [...PROGRAMMATIC_PREGENERATED_AMOUNTS].sort((a, b) => a - b);
  let target: bigint;
  try {
    target = BigInt(canonicalSlug);
  } catch {
    return sorted.slice(0, limit).map((n) => String(n));
  }

  const withDist = sorted.map((n) => {
    const bn = BigInt(n);
    const d = target > bn ? target - bn : bn - target;
    return { n, d };
  });

  withDist.sort((a, b) => {
    if (a.d < b.d) return -1;
    if (a.d > b.d) return 1;
    return a.n < b.n ? -1 : a.n > b.n ? 1 : 0;
  });

  const seen = new Set<string>([canonicalSlug]);
  const out: string[] = [];
  for (const { n } of withDist) {
    const s = String(n);
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
    if (out.length >= limit) break;
  }
  return out;
}
