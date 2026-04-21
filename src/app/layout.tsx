import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bangla Taka Converter - Convert Numbers to Bangla Currency Words",
  description:
    "Convert numeric amounts to Bangla Taka words in English and Bangla languages. Fast, accurate, and easy-to-use currency converter with clipboard copy feature.",
  keywords: [
    "Bangla Taka",
    "currency converter",
    "number to words",
    "Bengali currency",
    "Taka words",
    "Paisa",
    "converter tool",
  ],
  authors: [{ name: "Bangla Taka Converter" }],
  robots: "index, follow",
  openGraph: {
    type: "website",
    title: "Bangla Taka Converter - Convert Numbers to Currency Words",
    description:
      "Convert numeric amounts to Bangla Taka words in English and Bangla languages instantly.",
    url: "https://bangla-taka-converter.manus.space",
    siteName: "Bangla Taka Converter",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bangla Taka Converter",
    description: "Convert numbers to Bangla Taka words instantly in English and Bangla.",
  },
  alternates: {
    canonical: "https://bangla-taka-converter.manus.space",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
