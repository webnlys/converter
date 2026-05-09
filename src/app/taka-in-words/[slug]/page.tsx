import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { convertToBangla, convertToEnglish } from "@/lib/currencyConverter";
import { formatBanglaComma, formatCurrencyDisplay } from "@/lib/banglaFormatter";
import type { ParsedCurrency } from "@/lib/banglaFormatter";
import { getSiteUrl } from "@/lib/site";
import {
  PROGRAMMATIC_ALIAS_SLUGS,
  PROGRAMMATIC_PREGENERATED_AMOUNTS,
  formatWesternCommaDigits,
  getRelatedCanonicalSlugs,
  resolveProgrammaticSlug,
} from "@/lib/programmaticTakaPages";

const SITE_URL = getSiteUrl();

export const dynamicParams = true;

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  const slugs = new Set<string>();
  for (const n of PROGRAMMATIC_PREGENERATED_AMOUNTS) {
    slugs.add(String(n));
  }
  for (const k of Object.keys(PROGRAMMATIC_ALIAS_SLUGS)) {
    slugs.add(k);
  }
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = resolveProgrammaticSlug(slug);
  if (!resolved) notFound();

  const parsed: ParsedCurrency = {
    integerStr: resolved.integerStr,
    paisa: 0,
  };
  const english = convertToEnglish(parsed);
  const bangla = convertToBangla(parsed);
  const western = formatWesternCommaDigits(resolved.integerStr);
  const canonicalPath = `/taka-in-words/${resolved.canonicalSlug}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  const title = `${western} Taka in Words — English & Bangla | Bangladesh`;
  const description = `${western} taka in words (English): ${english}. Bangla: ${bangla.replace(/\s+/g, " ").slice(0, 120)}…`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      locale: "bn_BD",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

function ProgrammaticFaqJsonLd(props: {
  questionEn: string;
  answerEn: string;
  answerBn: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: props.questionEn,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${props.answerEn} Bangla: ${props.answerBn}`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function ProgrammaticTakaPage({ params }: PageProps) {
  const { slug } = await params;
  const resolved = resolveProgrammaticSlug(slug);
  if (!resolved) notFound();

  const parsed: ParsedCurrency = {
    integerStr: resolved.integerStr,
    paisa: 0,
  };

  const english = convertToEnglish(parsed);
  const bangla = convertToBangla(parsed);
  const bdCommaFormatted = formatCurrencyDisplay(parsed);
  const western = formatWesternCommaDigits(resolved.integerStr);
  const bdCommaInt = formatBanglaComma(resolved.integerStr);
  const canonicalPath = `/taka-in-words/${resolved.canonicalSlug}`;
  const isAlias = slug.toLowerCase() !== resolved.canonicalSlug.toLowerCase();

  const questionEn = `How do you write ${resolved.integerStr} in words (Bangladesh Taka)?`;
  const related = getRelatedCanonicalSlugs(resolved.canonicalSlug);

  return (
    <>
      <ProgrammaticFaqJsonLd
        questionEn={questionEn}
        answerEn={english}
        answerBn={bangla}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
          <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <Link
              href="/"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              ← Bangla In Words Converter
            </Link>
            <Link
              href="/#faq"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              FAQ
            </Link>
          </div>
        </header>

        <main className="container mx-auto max-w-3xl px-4 py-12">
          <article className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-emerald-700">
              Amount → words (programmatic)
            </p>
            <h1 className="mb-2 text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
              {western} taka in words
            </h1>
            <p className="mb-8 text-lg text-slate-600">
              Bangladesh BDT — lac/crore wording in English and Bangla (
              {bdCommaInt} টাকা).
            </p>

            {isAlias && (
              <p className="mb-6 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-700">
                Canonical URL for this amount:{" "}
                <Link href={canonicalPath} className="font-semibold text-emerald-700">
                  /taka-in-words/{resolved.canonicalSlug}
                </Link>
              </p>
            )}

            <section className="mb-8 rounded-xl border border-orange-100 bg-orange-50/80 p-6">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                English (cheque-style)
              </h2>
              <p className="text-lg leading-relaxed text-slate-800">{english}</p>
            </section>

            <section className="mb-8 rounded-xl border border-green-100 bg-green-50/80 p-6">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">
                বাংলা
              </h2>
              <p className="text-lg leading-relaxed text-slate-800">{bangla}</p>
            </section>

            <section className="mb-10 rounded-xl border border-blue-100 bg-blue-50/80 p-6">
              <h2 className="mb-2 text-lg font-semibold text-slate-900">
                Bangladesh comma format (figures)
              </h2>
              <p className="text-2xl font-semibold tracking-tight text-blue-700">
                {bdCommaFormatted}
              </p>
            </section>

            <section className="mb-10 border-t border-slate-100 pt-8">
              <h2 className="text-xl font-semibold text-slate-900">{questionEn}</h2>
              <p className="mt-3 text-base leading-relaxed text-slate-800">
                {english}
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-800">
                Bangla: {bangla}
              </p>
            </section>

            <section aria-labelledby="related-heading" className="border-t border-slate-100 pt-8">
              <h2
                id="related-heading"
                className="mb-4 text-xl font-semibold text-slate-900"
              >
                Nearby amounts
              </h2>
              <ul className="flex flex-wrap gap-2">
                {related.map((s) => (
                  <li key={s}>
                    <Link
                      href={`/taka-in-words/${s}`}
                      className="inline-block rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-800 hover:border-emerald-300 hover:bg-emerald-50"
                    >
                      {formatWesternCommaDigits(s)} taka
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <p className="mt-10 text-center">
              <Link
                href="/"
                className="inline-flex rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Open full converter
              </Link>
            </p>
          </article>
        </main>
      </div>
    </>
  );
}
