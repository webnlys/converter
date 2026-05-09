import { SEO_FAQ_ITEMS } from "@/lib/faqContent";
import { getSiteUrl } from "@/lib/site";

const SITE_URL = getSiteUrl();

const ogImageUrl = `${SITE_URL}/opengraph-image`;

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Bangla In Words Converter",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: ogImageUrl,
        width: 1200,
        height: 630,
      },
      areaServed: {
        "@type": "Country",
        name: "Bangladesh",
        identifier: "BD",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Bangla In Words Converter",
      alternateName: [
        "টাকার অংক/সংখা কথায় লিখুন",
        "Bangladesh Taka Amount to Words",
        "taka in words",
        "amount to words bd",
      ],
      description:
        "বাংলাদেশি টাকার সংখ্যাকে ইংরেজি ও বাংলায় কথায় রূপান্তর করুন। টেক্সট থেকে সংখ্যায় ও বিপরীত রূপান্তর। ফ্রি অনলাইন টুল।",
      url: SITE_URL,
      inLanguage: ["bn-BD", "en"],
      publisher: { "@id": `${SITE_URL}/#organization` },
      about: { "@id": `${SITE_URL}/#webapp` },
    },
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: "Bangla In Words Converter",
      alternateName: "টাকার অংক/সংখা কথায় লিখুন",
      url: SITE_URL,
      image: ogImageUrl,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      publisher: { "@id": `${SITE_URL}/#organization` },
      description:
        "Convert Bangladesh Taka amounts between figures and words in English and Bangla (Bengali). Bidirectional number ↔ text with lac–crore grouping.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "BDT",
      },
      audience: {
        "@type": "Audience",
        geographicArea: {
          "@type": "Country",
          name: "Bangladesh",
          identifier: "BD",
        },
      },
      inLanguage: ["bn-BD", "en"],
      isAccessibleForFree: true,
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      url: SITE_URL,
      mainEntity: SEO_FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.schema.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.schema.answer,
        },
      })),
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
