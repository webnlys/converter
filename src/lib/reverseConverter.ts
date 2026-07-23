/**
 * Reverse Currency Converter Utility
 * Converts Bangla Taka words (English or Bangla) back to numeric format
 * 
 * Example:
 * "One Lac Seven Thousand Three Hundred Fifty Taka only" → 107350
 * "এক লাখ সাত হাজার তিনশত পঞ্চাশ টাকা" → 107350
 */

import { banglaCompound1To99 } from "./currencyConverter";

// English words to number mapping
const englishWordMap: { [key: string]: number } = {
  // Ones
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  
  // Teens
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
  
  // Tens
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
  
  // Scales
  hundred: 100,
  thousand: 1000,
  lac: 100000,
  lakh: 100000,
  crore: 10000000,
};

// Bangla words to number mapping
const banglaWordMap: { [key: string]: number } = {
  // Ones
  শূন্য: 0,
  এক: 1,
  দুই: 2,
  তিন: 3,
  চার: 4,
  পাঁচ: 5,
  ছয়: 6,
  সাত: 7,
  আট: 8,
  নয়: 9,
  
  // Teens
  দশ: 10,
  এগারো: 11,
  বারো: 12,
  তেরো: 13,
  চৌদ্দ: 14,
  পনেরো: 15,
  ষোলো: 16,
  সতেরো: 17,
  আঠারো: 18,
  উনিশ: 19,
  
  // Tens
  বিশ: 20,
  ত্রিশ: 30,
  চল্লিশ: 40,
  পঞ্চাশ: 50,
  ষাট: 60,
  সত্তর: 70,
  আশি: 80,
  নব্বই: 90,
  
  // Scales
  শত: 100,
  শতক: 100,
  হাজার: 1000,
  লাখ: 100000,
  কোটি: 10000000,

  // Compound hundreds (for cases like "তিনশত" instead of "তিন শত")
  একশত: 100,
  দুইশত: 200,
  তিনশত: 300,
  চারশত: 400,
  পাঁচশত: 500,
  ছয়শত: 600,
  সাতশত: 700,
  আটশত: 800,
  নয়শত: 900,
};

// The forward converter renders 20–99 as single compound words (e.g. তিরানব্বই = 93,
// পঁচিশ = 25) rather than "tens ones". Register them so the reverse parser recognizes
// them too, instead of silently skipping them as unknown words.
banglaCompound1To99.forEach((word, value) => {
  if (word && !(word in banglaWordMap)) {
    banglaWordMap[word] = value;
  }
});

/** Compound hundreds like তিনশত (300): add atomically; do not treat as শত multiplier. */
const BANGLA_ATOMIC_HUNDREDS = new Set([
  "একশত",
  "দুইশত",
  "তিনশত",
  "চারশত",
  "পাঁচশত",
  "ছয়শত",
  "সাতশত",
  "আটশত",
  "নয়শত",
]);

/**
 * Sum a run of words into a scaled integer (hundred/thousand/lac/crore multipliers).
 * Shared by the taka portion and the paisa portion of both parsers.
 */
function computeScaleValue(
  words: string[],
  wordMap: { [key: string]: number },
  atomicHundreds?: Set<string>
): number {
  let result = 0;
  let current = 0;

  for (const word of words) {
    const value = wordMap[word];

    if (value === undefined) {
      // Unknown word, skip
      continue;
    }

    if (atomicHundreds?.has(word)) {
      current += value;
      continue;
    }

    // Handle different scale levels
    if (value < 100) {
      // Ones, teens, tens - add to current
      current += value;
    } else if (value === 100) {
      // Hundred - multiply current
      current *= 100;
    } else if (value === 1000) {
      // Thousand - multiply current and add to result
      current *= 1000;
      result += current;
      current = 0;
    } else if (value === 100000) {
      // Lac/Lakh - multiply current and add to result
      current *= 100000;
      result += current;
      current = 0;
    } else if (value === 10000000) {
      // Crore - multiply current and add to result
      current *= 10000000;
      result += current;
      current = 0;
    }
  }

  // Add any remaining current value
  result += current;

  return result;
}

/**
 * Parse English text to number with correct scale handling
 * Example: "One Lac Seven Thousand Three Hundred Fifty" → 107350
 * "One Hundred Taka and Fifty Paisa Only" → 100.5
 *
 * Algorithm:
 * 1. Split the text on the "taka" / "paisa" markers so paisa words are
 *    parsed as their own (0–99) value instead of folding into the taka total
 * 2. Apply scales (hundred, thousand, lac, crore) correctly on the taka portion
 * 3. Combine as taka + paisa/100
 */
export function parseEnglishText(text: string): number | null {
  if (!text || text.trim().length === 0) return null;

  // Normalize; keep "taka"/"paisa" as markers, only strip pure filler words
  const cleanText = text
    .toLowerCase()
    .replace(/\band\b/g, " ")
    .replace(/\bonly\b/g, " ")
    .replace(/\bmatra\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanText.split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return null;

  const takaIdx = words.indexOf("taka");
  const paisaIdx = words.indexOf("paisa");

  let takaWords: string[];
  let paisaWords: string[];

  if (takaIdx !== -1) {
    takaWords = words.slice(0, takaIdx);
    paisaWords = paisaIdx !== -1 && paisaIdx > takaIdx ? words.slice(takaIdx + 1, paisaIdx) : [];
  } else if (paisaIdx !== -1) {
    // No "taka" marker, but a "paisa" one (e.g. "Five Paisa only") - it's paisa-only
    takaWords = [];
    paisaWords = words.slice(0, paisaIdx);
  } else {
    takaWords = words;
    paisaWords = [];
  }

  const takaValue = computeScaleValue(takaWords, englishWordMap);
  const paisaValue = computeScaleValue(paisaWords, englishWordMap);

  if (takaValue === 0 && paisaValue === 0) return null;

  return paisaValue > 0 ? takaValue + paisaValue / 100 : takaValue;
}

/**
 * Parse Bangla text to number with correct scale handling
 * Example: "এক লাখ সাত হাজার তিনশত পঞ্চাশ" → 107350
 * "একশত টাকা এবং পঞ্চাশ পয়সা মাত্র" → 100.5
 */
export function parseBanglaText(text: string): number | null {
  if (!text || text.trim().length === 0) return null;

  // Normalize; keep "টাকা"/"পয়সা" as markers, only strip pure filler words
  const cleanText = text
    .replace(/এবং/g, " ")
    .replace(/মাত্র/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleanText.split(/\s+/).filter((w) => w.length > 0);
  if (words.length === 0) return null;

  const takaIdx = words.indexOf("টাকা");
  const paisaIdx = words.indexOf("পয়সা");

  let takaWords: string[];
  let paisaWords: string[];

  if (takaIdx !== -1) {
    takaWords = words.slice(0, takaIdx);
    paisaWords = paisaIdx !== -1 && paisaIdx > takaIdx ? words.slice(takaIdx + 1, paisaIdx) : [];
  } else if (paisaIdx !== -1) {
    takaWords = [];
    paisaWords = words.slice(0, paisaIdx);
  } else {
    takaWords = words;
    paisaWords = [];
  }

  const takaValue = computeScaleValue(takaWords, banglaWordMap, BANGLA_ATOMIC_HUNDREDS);
  const paisaValue = computeScaleValue(paisaWords, banglaWordMap, BANGLA_ATOMIC_HUNDREDS);

  if (takaValue === 0 && paisaValue === 0) return null;

  return paisaValue > 0 ? takaValue + paisaValue / 100 : takaValue;
}

/**
 * Detect if text is in English or Bangla
 */
export function detectLanguage(text: string): "english" | "bangla" | "mixed" {
  const banglaRegex = /[\u0980-\u09FF]/g;
  const englishRegex = /[a-zA-Z]/g;

  const banglaMatches = text.match(banglaRegex) || [];
  const englishMatches = text.match(englishRegex) || [];

  if (banglaMatches.length > 0 && englishMatches.length === 0) {
    return "bangla";
  } else if (englishMatches.length > 0 && banglaMatches.length === 0) {
    return "english";
  } else if (banglaMatches.length > 0 && englishMatches.length > 0) {
    return "mixed";
  }

  return "english"; // Default
}

/**
 * Convert text to number (auto-detect language)
 */
export function convertTextToNumber(text: string): number | null {
  const language = detectLanguage(text);

  if (language === "bangla") {
    return parseBanglaText(text);
  } else if (language === "english") {
    return parseEnglishText(text);
  } else if (language === "mixed") {
    // Try English first, then Bangla
    const englishResult = parseEnglishText(text);
    if (englishResult !== null) return englishResult;
    return parseBanglaText(text);
  }

  return null;
}

export default {
  parseEnglishText,
  parseBanglaText,
  detectLanguage,
  convertTextToNumber,
};
