"use client";

/**
 * Home Page - Bangla In Words Converter (Bidirectional)
 * 
 * Design Philosophy: Modern Minimalist with Gradient Accents
 * - Bidirectional conversion: Number ↔ Text
 * - Dual conversion display: English and Bangla simultaneously
 * - Bangla comma formatting for currency display
 * - Real-time conversion counter with local state
 * - Professional financial aesthetics with contemporary feel
 */

import { useState, useEffect } from "react";
import { Copy, RotateCw, ArrowRightLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  convertToEnglish,
  convertToBangla,
  parseCurrencyInput,
} from "@/lib/currencyConverter";
import { formatCurrencyDisplay, formatWesternComma, formatBanglaCommaBnDigits } from "@/lib/banglaFormatter";
import { convertTextToNumber } from "@/lib/reverseConverter";

interface ConversionResult {
  english: string;
  bangla: string;
  formattedAmount: string;
}

interface ReverseConversionResult {
  englishFormat: string;
  banglaFormat: string;
}

type ConversionMode = "number-to-text" | "text-to-number";

export default function Home() {
  const [mode, setMode] = useState<ConversionMode>("number-to-text");
  const [input, setInput] = useState<string>("");
  const [conversions, setConversions] = useState<ConversionResult | null>(null);
  const [reverseConversions, setReverseConversions] = useState<ReverseConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionCount, setConversionCount] = useState<number>(0);

  const parsedInputPreview =
    mode === "number-to-text" ? parseCurrencyInput(input) : null;

  // Handle number to text conversion
  useEffect(() => {
    if (mode !== "number-to-text") return;

    if (!input.trim()) {
      setConversions(null);
      return;
    }

    setIsConverting(true);

    const timer = setTimeout(() => {
      const parsedAmount = parseCurrencyInput(input);

      if (parsedAmount === null) {
        setConversions(null);
        toast.error("Invalid amount. Please enter a valid number.");
      } else {
        const englishResult = convertToEnglish(parsedAmount);
        const banglaResult = convertToBangla(parsedAmount);
        const formattedAmount = formatCurrencyDisplay(parsedAmount);

        setConversions({
          english: englishResult,
          bangla: banglaResult,
          formattedAmount,
        });

        incrementConversionCount();
      }

      setIsConverting(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [input, mode]);

  // Handle text to number conversion
  useEffect(() => {
    if (mode !== "text-to-number") return;

    if (!input.trim()) {
      setReverseConversions(null);
      return;
    }

    setIsConverting(true);

    const timer = setTimeout(() => {
      const parsedNumber = convertTextToNumber(input);

      if (parsedNumber === null) {
        setReverseConversions(null);
        toast.error("Could not parse the text. Please enter valid Bangla Taka words.");
      } else {
        setReverseConversions({
          englishFormat: formatWesternComma(parsedNumber),
          banglaFormat: formatBanglaCommaBnDigits(parsedNumber),
        });

        incrementConversionCount();
      }

      setIsConverting(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [input, mode]);

  // Increment conversion counter (local)
  const incrementConversionCount = () => {
    setConversionCount((prev) => prev + 1);
  };

  // Copy to clipboard
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  // Clear input
  const handleClear = () => {
    setInput("");
    setConversions(null);
    setReverseConversions(null);
  };

  // Toggle conversion mode
  const toggleMode = () => {
    setMode(mode === "number-to-text" ? "text-to-number" : "number-to-text");
    setInput("");
    setConversions(null);
    setReverseConversions(null);
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url('https://d2xsxph8kpxj0f.cloudfront.net/310419663031586734/cPZSnP3HKaaNG44LbXfHcf/conversion-pattern-6Jc8cMLjJLyfrBodX7CsJW.webp')",
            backgroundSize: "400px 400px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 text-white font-bold">
              ৳
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Bangla In Words Converter
              </h1>
              <p className="text-xs text-slate-600">
                টাকার অংক/সংখা কথায় লিখুন
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
            <TrendingUp className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-slate-700">
              {conversionCount} conversions
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-4xl font-bold text-slate-900">
            টাকার সংখ্যা{" "}
            <span className="text-emerald-600">কথায় লিখুন</span>
          </h2> 
          <h3 className="mb-3 text-4xl font-bold text-slate-900">
            Convert amount{" "}
            <span className="text-emerald-600">in English and Bangla into words.</span>
          </h3> 
           
          <p className="text-lg text-slate-600">
            যেকোনো পরিমাণ ইংরেজি ও বাংলায় কথায়—লক্ষ–কোটি–পয়সা ফরম্যাট ও অনুলিপি এক ক্লিকে
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-1">
            <button
              onClick={() => mode === "text-to-number" && toggleMode()}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                mode === "number-to-text"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🔢 Number → Text</span>
            </button>
            <button
              onClick={toggleMode}
              className="mx-2 p-2 text-slate-400 hover:text-slate-600 transition-colors"
              title="Toggle conversion mode"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => mode === "number-to-text" && toggleMode()}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                mode === "text-to-number"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>📝 Text → Number</span>
            </button>
          </div>
        </div>

        {/* Input Card */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-sm">
              ✓
            </div>
            <label className="font-semibold text-slate-900">
              {mode === "number-to-text" ? "Your number:" : "Paste text here:"}
            </label>
          </div>

          <div className="mb-4 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                mode === "number-to-text"
                  ? "e.g., 11165500.56 or ১১১৬৫৫০০.৫৬"
                  : "e.g., One Lac Seven Thousand Three Hundred Fifty Taka"
              }
              className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {mode === "number-to-text" && input && (
              <div className="flex items-center rounded-lg bg-slate-100 px-4 py-3 font-semibold text-slate-700">
                {parsedInputPreview ? formatCurrencyDisplay(parsedInputPreview) : "—"}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleClear}
              variant="outline"
              className="flex-1"
            >
              Clear
            </Button>
            <Button
              onClick={() => setInput("")}
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-slate-600"
            >
              <RotateCw className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Number to Text Conversion Results */}
        {mode === "number-to-text" && (
          <>
            {/* Bangla Comma Format */}
            {conversions && (
              <div className="mb-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xl">👉</span>
                  <h3 className="font-semibold text-slate-900">
                    Correct Bangla currency comma format:
                  </h3>
                </div>
                <div className="mb-3 text-3xl font-bold text-blue-600">
                  {conversions.formattedAmount}
                </div>
                <p className="text-sm text-slate-600">
                  📌 How it works: Last 3 digits → groups of 2 → separated by commas
                </p>
              </div>
            )}

            {/* Conversion Results */}
            {conversions ? (
              <div className="grid gap-6 md:grid-cols-2">
                {/* English Result */}
                <div className="rounded-xl border border-orange-200 bg-orange-50 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-2xl">🇬🇧</span>
                    <h3 className="font-bold text-slate-900">English</h3>
                  </div>
                  <p className="mb-4 text-slate-700 leading-relaxed">
                    {conversions.english}
                  </p>
                  <Button
                    onClick={() => handleCopy(conversions.english)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                </div>

                {/* Bangla Result */}
                <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-2xl">🇧🇩</span>
                    <h3 className="font-bold text-slate-900">বাংলা</h3>
                  </div>
                  <p className="mb-4 text-slate-700 leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {conversions.bangla}
                  </p>
                  <Button
                    onClick={() => handleCopy(conversions.bangla)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    অনুলিপি করুন
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-slate-500">
                  Enter an amount above to see conversions in both English and Bangla
                </p>
              </div>
            )}
          </>
        )}

        {/* Text to Number Conversion Results */}
        {mode === "text-to-number" && (
          <>
            {reverseConversions ? (
              <div className="grid gap-6 md:grid-cols-2">
                {/* English-style grouping */}
                <div className="rounded-xl border border-purple-200 bg-purple-50 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔢</span>
                    <h3 className="font-bold text-slate-900">English Format</h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-slate-600 mb-2">
                      Western grouping (every three digits):
                    </p>
                    <p className="text-3xl font-bold text-purple-600">
                      {reverseConversions.englishFormat}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleCopy(reverseConversions.englishFormat)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy English Format
                  </Button>
                </div>

                {/* Bangla lac–crore comma style + Bengali digits */}
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <span className="text-2xl">👉</span>
                    <h3 className="font-bold text-slate-900">Bangla Format</h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-slate-600 mb-2">
                      Bangladesh-style commas + Bengali numerals:
                    </p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {reverseConversions.banglaFormat}
                    </p>
                  </div>
                  <Button
                    onClick={() => handleCopy(reverseConversions.banglaFormat)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Bangla Format
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-slate-500">
                  Paste Bangla Taka words (English or Bangla) to convert to numeric format
                </p>
              </div>
            )}
          </>
        )}

        {/* Features Section */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
            <div className="mb-3 text-3xl">⚡</div>
            <h3 className="mb-2 font-bold text-slate-900">Instant</h3>
            <p className="text-sm text-slate-600">Real-time conversion</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
            <div className="mb-3 text-3xl">✓</div>
            <h3 className="mb-2 font-bold text-slate-900">Accurate</h3>
            <p className="text-sm text-slate-600">Precise calculations</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-center">
            <div className="mb-3 text-3xl">🌐</div>
            <h3 className="mb-2 font-bold text-slate-900">Bilingual</h3>
            <p className="text-sm text-slate-600">English & Bangla</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/80 backdrop-blur-sm py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-slate-600">
            Bangla In Words Converter • সংখ্যা ↔ কথায়  রূপান্তর • 
            <span>
              Designed and Developed by <a href="https://webnlyst.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600">Webnlys</a>
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
}
