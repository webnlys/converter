/**
 * Currency Converter Utility
 * Converts numeric amounts to Bangla Taka words in both English and Bangla languages
 *
 * Large integers and decimals are handled via {@link ParsedCurrency} (string taka + paisa)
 * so JS float precision does not corrupt cheques (e.g. .21 vs .25).
 */

import type { ParsedCurrency } from "./banglaFormatter";
import { parseCurrencyInput } from "./banglaFormatter";

export type { ParsedCurrency } from "./banglaFormatter";
export { parseCurrencyInput };

// English words mapping
const englishOnes = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
];

const englishTeens = [
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];

const englishTens = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
];

// Bangla words mapping
const banglaOnes = [
  "",
  "এক",
  "দুই",
  "তিন",
  "চার",
  "পাঁচ",
  "ছয়",
  "সাত",
  "আট",
  "নয়",
];

/**
 * Bengali compound names for 1–99 (used for পয়সা; e.g. 45 → পঁয়তাল্লিশ, not চল্লিশ পাঁচ).
 * Index matches the number.
 */
const banglaCompound1To99: string[] = [
  "",
  "এক",
  "দুই",
  "তিন",
  "চার",
  "পাঁচ",
  "ছয়",
  "সাত",
  "আট",
  "নয়",
  "দশ",
  "এগারো",
  "বারো",
  "তেরো",
  "চৌদ্দ",
  "পনেরো",
  "ষোলো",
  "সতেরো",
  "আঠারো",
  "উনিশ",
  "বিশ",
  "একুশ",
  "বাইশ",
  "তেইশ",
  "চব্বিশ",
  "পঁচিশ",
  "ছাব্বিশ",
  "সাতাশ",
  "আটাশ",
  "উনত্রিশ",
  "ত্রিশ",
  "একত্রিশ",
  "বত্রিশ",
  "তেত্রিশ",
  "চৌত্রিশ",
  "পঁয়ত্রিশ",
  "ছত্রিশ",
  "সাইত্রিশ",
  "আটত্রিশ",
  "ঊনচল্লিশ",
  "চল্লিশ",
  "একচল্লিশ",
  "বয়াল্লিশ",
  "তৈতাল্লিশ",
  "চুয়াল্লিশ",
  "পঁয়তাল্লিশ",
  "ছেচল্লিশ",
  "সাতচল্লিশ",
  "আটচল্লিশ",
  "ঊনপঞ্চাশ",
  "পঞ্চাশ",
  "একান্ন",
  "বায়ান্ন",
  "তিপ্পান্ন",
  "চুয়ান্ন",
  "পঞ্চান্ন",
  "ছাপ্পান্ন",
  "সাতান্ন",
  "আটান্ন",
  "ঊনষাট",
  "ষাট",
  "একষট্টি",
  "বাষট্টি",
  "তেষট্টি",
  "চৌষট্টি",
  "পঁয়ষট্টি",
  "ছেষট্টি",
  "সাতষট্টি",
  "আটষট্টি",
  "ঊনসত্তর",
  "সত্তর",
  "একাত্তর",
  "বাহাত্তর",
  "তিয়াত্তর",
  "চুয়াত্তর",
  "পঁচাত্তর",
  "ছিয়াত্তর",
  "সাতাত্তর",
  "আটাত্তর",
  "ঊনআশি",
  "আশি",
  "একাশি",
  "বিরাশি",
  "তিরাশি",
  "চুরাশি",
  "পঁচাশি",
  "ছিয়াশি",
  "সাতাশি",
  "আটাশি",
  "ঊননব্বই",
  "নব্বই",
  "একানব্বই",
  "বিরানব্বই",
  "তিরানব্বই",
  "চুরানব্বই",
  "পঁচানব্বই",
  "ছিয়ানব্বই",
  "সাতানব্বই",
  "আটানব্বই",
  "নিরানব্বই",
];

/**
 * Convert a number less than 1000 to English words
 */
function convertHundredsToEnglish(num: number): string {
  if (num === 0) return "";

  let result = "";

  const hundreds = Math.floor(num / 100);
  if (hundreds > 0) {
    result += englishOnes[hundreds] + " Hundred";
  }

  const remainder = num % 100;
  if (remainder > 0) {
    if (result) result += " ";

    if (remainder < 10) {
      result += englishOnes[remainder];
    } else if (remainder < 20) {
      result += englishTeens[remainder - 10];
    } else {
      const tens = Math.floor(remainder / 10);
      const ones = remainder % 10;
      result += englishTens[tens];
      if (ones > 0) {
        result += " " + englishOnes[ones];
      }
    }
  }

  return result.trim();
}

/**
 * Convert a number less than 1000 to Bangla words using **compound** 21–99 forms
 * (e.g. ৩৪ → চৌত্রিশ, ৯৯ → নিরানব্বই, ২৫ → পঁচিশ), as used on Bangladesh cheques.
 */
function convertHundredsToBanglaCompound(num: number): string {
  if (num === 0) return "";

  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;
  let result = "";

  if (hundreds > 0) {
    result += banglaOnes[hundreds] + " শত";
  }

  if (remainder > 0) {
    if (result) result += " ";
    result += banglaCompound1To99[remainder] || "";
  }

  return result.trim();
}

function convertPaisaToBangla(paisa: number): string {
  if (paisa <= 0 || paisa > 99) return "";
  return banglaCompound1To99[paisa] || "";
}

/** Indian place-value groups from the right: 3 + 2 + 2 + … (chunk values 0–999 then 0–99). */
function splitIndianDigitGroups(integerStr: string): number[] {
  const t = integerStr.replace(/^0+/, "") || "0";
  if (t === "0") return [0];

  const groups: number[] = [];
  let s = t;

  const last3 = parseInt(s.slice(-3).padStart(3, "0"), 10);
  s = s.slice(0, -3);
  groups.push(last3);

  while (s.length > 0) {
    const chunk = parseInt(s.slice(-2).padStart(2, "0"), 10);
    s = s.slice(0, -2);
    groups.push(chunk);
  }

  return groups;
}

/** Index 1 = thousand, 2 = lakh, 3 = crore, … */
const ENGLISH_SCALES = [
  "",
  "Thousand",
  "Lakh",
  "Crore",
  "Arab",
  "Kharab",
  "Nil",
  "Padma",
  "Shankh",
  "Mahashankh",
  "Madh",
  "Maha Padma",
  "Jaladhi",
  "Maha Jaladhi",
  "Antya",
  "Madhya",
  "Parardha",
];

const BANGLA_SCALES = [
  "",
  "হাজার",
  "লাখ",
  "কোটি",
  "আরব",
  "খরব",
  "নীল",
  "পদ্ম",
  "শঙ্খ",
  "মহাশঙ্খ",
  "মধ",
  "মহাপদ্ম",
  "জলধি",
  "মহাজলধি",
  "অন্ত্য",
  "মধ্য",
  "পরার্ধ",
];

/** 100^exp as bigint (for crore-tier weights). */
function hundredPowForCroreTier(exp: number): bigint {
  let r = BigInt(1);
  const b = BigInt(100);
  for (let k = 0; k < exp; k++) {
    r *= b;
  }
  return r;
}

/**
 * Combine আরব/খরব… tiers into one **কোটি** count (1×100 + 99 = ১৯৯ কোটি), matching BD cheque style.
 */
function mergeCroreTier(groups: number[]): { g: [number, number, number]; crore: bigint } {
  const g0 = groups.length > 0 ? groups[0] : 0;
  const g1 = groups.length > 1 ? groups[1] : 0;
  const g2 = groups.length > 2 ? groups[2] : 0;
  let crore = BigInt(0);
  for (let i = 3; i < groups.length; i++) {
    crore += BigInt(groups[i]) * hundredPowForCroreTier(i - 3);
  }
  return { g: [g0, g1, g2], crore };
}

/** Build words from Indian groups (low→high indices) without merging — used for the crore multiplier itself. */
function englishWordsFromGroupsNoMerge(groups: number[]): string {
  let result = "";
  for (let i = groups.length - 1; i >= 0; i--) {
    const n = groups[i];
    if (n === 0) continue;
    const words = convertHundredsToEnglish(n);
    if (!words) continue;
    if (result) result += " ";
    if (i === 0) result += words;
    else result += `${words} ${ENGLISH_SCALES[i] ?? `Scale${i}`}`;
  }
  return result.trim();
}

function banglaWordsFromGroupsNoMerge(groups: number[]): string {
  let result = "";
  for (let i = groups.length - 1; i >= 0; i--) {
    const n = groups[i];
    if (n === 0) continue;
    const words = convertHundredsToBanglaCompound(n);
    if (!words) continue;
    if (result) result += " ";
    if (i === 0) result += words;
    else result += `${words} ${BANGLA_SCALES[i] ?? `স্তর-${i}`}`;
  }
  return result.trim();
}

function buildEnglishTakaWords(integerStr: string): string {
  const groups = splitIndianDigitGroups(integerStr);
  const { g, crore } = mergeCroreTier(groups);
  let result = "";

  if (crore > BigInt(0)) {
    const inner = englishWordsFromGroupsNoMerge(splitIndianDigitGroups(crore.toString()));
    if (inner) result += `${inner} Crore`;
  }

  for (const i of [2, 1, 0] as const) {
    const n = g[i];
    if (n === 0) continue;
    const words = convertHundredsToEnglish(n);
    if (!words) continue;
    if (result) result += " ";
    if (i === 0) result += words;
    else result += `${words} ${ENGLISH_SCALES[i]}`;
  }

  return result.trim();
}

function buildBanglaTakaWords(integerStr: string): string {
  const groups = splitIndianDigitGroups(integerStr);
  const { g, crore } = mergeCroreTier(groups);
  let result = "";

  if (crore > BigInt(0)) {
    const inner = banglaWordsFromGroupsNoMerge(splitIndianDigitGroups(crore.toString()));
    if (inner) result += `${inner} কোটি`;
  }

  for (const i of [2, 1, 0] as const) {
    const n = g[i];
    if (n === 0) continue;
    const words = convertHundredsToBanglaCompound(n);
    if (!words) continue;
    if (result) result += " ";
    if (i === 0) result += words;
    else result += `${words} ${BANGLA_SCALES[i]}`;
  }

  return result.trim();
}

/**
 * Convert amount to English words (Taka and Paisa)
 */
export function convertToEnglish(parsed: ParsedCurrency): string {
  const { integerStr, paisa } = parsed;

  if (integerStr === "0" && paisa === 0) return "Zero Taka";

  let result = "";

  if (integerStr !== "0") {
    result = buildEnglishTakaWords(integerStr);
    result += " Taka";
  }

  if (paisa > 0) {
    if (result) result += " and ";
    result += convertHundredsToEnglish(paisa) + " Paisa";
  }

  if (result) result += " only";

  return result.trim();
}

/**
 * Convert amount to Bangla words (Taka and Paisa)
 */
export function convertToBangla(parsed: ParsedCurrency): string {
  const { integerStr, paisa } = parsed;

  if (integerStr === "0" && paisa === 0) return "শূন্য টাকা";

  let result = "";

  if (integerStr !== "0") {
    result = buildBanglaTakaWords(integerStr);
    result += " টাকা";
  }

  if (paisa > 0) {
    if (result) result += " এবং ";
    result += convertPaisaToBangla(paisa) + " পয়সা মাত্র";
  } else if (result) {
    result += " মাত্র";
  }

  return result.trim();
}

/**
 * Validate and parse user input (exact string-based; prefer over parseFloat).
 */
export function parseAmount(input: string): ParsedCurrency | null {
  return parseCurrencyInput(input);
}

/**
 * Format amount for display with commas
 */
export function formatAmount(amount: number): string {
  return amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
