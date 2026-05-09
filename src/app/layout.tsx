import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "@/components/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const SITE_URL = getSiteUrl();

const title =
  "Bangla In Words Converter | টাকার অংক/সংখা কথায় লিখুন — ফ্রি টাকা টু ওয়ার্ডস";

const description =
  "বাংলাদেশি টাকার সংখ্যাকে ইংরেজি ও বাংলায় কথায় লিখুন—লক্ষ, কোটি, পয়সা সহ। চেক ও ডকুমেন্টের জন্য দ্রুত রূপান্তর। সংখ্যা ↔ কথায় বিপরীত রূপান্তরও একই টুলে।";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s | Bangla In Words Converter",
  },
  description,
  keywords: [
    "টাকা কথায়",
    "টাকার অংক কথায় লিখুন",
    "সংখ্যা কথায় বাংলা",
    "বাংলা টাকা টু ওয়ার্ডস",
    "Bangla amount in words",
    "Bangladesh Taka words",
    "number to words Bengali",
    "টাকা ইংরেজিতে লেখা",
    "চেক অ্যামাউন্ট বাংলায়",
    "lac crore taka converter",
    "BDT words converter",
    "taka in words",
    "amount to words bd",
    "cheque lekhar niyom",
    "চেকে টাকার পরিমাণ লেখার নিয়ম",
    "সংখ্যাকে ইংরেজিতে লিখুন",
    "Banglish taka converter",
  ],
  authors: [{ name: "Bangla In Words Converter", url: SITE_URL }],
  creator: "Bangla In Words Converter",
  publisher: "Bangla In Words Converter",
  applicationName: "Bangla In Words Converter",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  category: "finance",
  verification: {
    google: "wPZtgxGlObmFLdD1sL3jPeLabHE3gHcUagL3tnddoVs",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "bn-BD": SITE_URL,
      en: SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    alternateLocale: ["en_US"],
    title:
      "Bangla In Words Converter — টাকার অংক/সংখা কথায় লিখুন | বাংলাদেশ টাকা",
    description,
    url: SITE_URL,
    siteName: "Bangla In Words Converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bangla In Words Converter | টাকা সংখ্যা কথায়",
    description:
      "ফ্রি টুল: টাকার পরিমাণ ইংরেজি ও বাংলায় কথায়। সংখ্যা ও টেক্সট উভয় দিকে রূপান্তর।",
  },
  appleWebApp: {
    capable: true,
    title: "Bangla In Words Converter",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "geo.region": "BD",
    "geo.placename": "Bangladesh",
    "geo.position": "23.685;90.3563",
    ICBM: "23.685, 90.3563",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn-BD" suppressHydrationWarning>
      <body>
        <JsonLd />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
