/**
 * Bangla Number Formatting Utility
 * Formats numbers according to Bangla/Indian numbering system
 * 
 * Format: 1,11,65,500.56
 * - Last 3 digits are grouped together
 * - Then groups of 2 digits
 * - Commas separate each group
 */

/**
 * Convert English digits to Bangla digits
 */
export function englishToBanglaDigits(num: string): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.replace(/\d/g, (digit) => banglaDigits[parseInt(digit)]);
}

/**
 * Convert Bangla digits to English digits
 */
export function banglaToBanglaDigits(num: string): string {
  const banglaDigits = ['০', '১', '२', '३', '४', '५', '६', '७', '८', '९'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let result = num;
  
  // Map Bangla digits to English
  for (let i = 0; i < 10; i++) {
    result = result.replace(new RegExp(String.fromCharCode(0x09E6 + i), 'g'), englishDigits[i]);
  }
  
  return result;
}

/**
 * Format number with Bangla comma style (Indian numbering system)
 * Examples:
 * 100 → 100
 * 1000 → 1,000
 * 11000 → 11,000
 * 111000 → 1,11,000
 * 1111000 → 11,11,000
 * 11111000 → 1,11,11,000
 * 111111000 → 11,11,11,000
 * 1111111000 → 1,11,11,11,000
 * 11165500.56 → 1,11,65,500.56
 */
export function formatBanglaComma(amount: number | string): string {
  // Convert to string and handle decimals
  const amountStr = typeof amount === 'number' ? amount.toString() : amount;
  const parts = amountStr.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // If less than 1000, no formatting needed
  if (integerPart.length <= 3) {
    return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
  }

  // Split into groups: last 3 digits, then groups of 2
  const lastThree = integerPart.slice(-3);
  const remaining = integerPart.slice(0, -3);

  // Split remaining into groups of 2 from right to left
  const groups: string[] = [];
  for (let i = remaining.length; i > 0; i -= 2) {
    const start = Math.max(0, i - 2);
    groups.unshift(remaining.slice(start, i));
  }

  // Combine all groups
  groups.push(lastThree);
  const formatted = groups.join(',');

  return decimalPart ? `${formatted}.${decimalPart}` : formatted;
}

/**
 * Western/international grouping (every three digits): e.g. 2300 → "2,300"; 11165500 → "11,165,500".
 */
export function formatWesternComma(amount: number): string {
  if (!Number.isFinite(amount)) return "";
  const rounded = Math.round(amount * 100) / 100;
  if (rounded === Math.floor(rounded)) {
    return rounded.toLocaleString("en-US", { maximumFractionDigits: 0 });
  }
  return rounded.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Indian/Bangladesh comma placement ({@link formatBanglaComma}) with Bengali numerals (২,৩০০).
 */
export function formatBanglaCommaBnDigits(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  const ascii =
    rounded === Math.floor(rounded)
      ? formatBanglaComma(Math.trunc(rounded))
      : formatBanglaComma(rounded.toFixed(2));
  return englishToBanglaDigits(ascii);
}

/** Strip paired wrappers like `"2300"` / `'2300'` / `"..."` (ASCII + common curly quotes). */
function stripOuterQuotes(s: string): string {
  let t = s.trim();
  while (t.length >= 2) {
    const a = t[0];
    const b = t[t.length - 1];
    const paired =
      (a === '"' && b === '"') ||
      (a === "'" && b === "'") ||
      (a === "\u201C" && b === "\u201D") ||
      (a === "\u2018" && b === "\u2019");
    if (!paired) break;
    t = t.slice(1, -1).trim();
  }
  return t;
}

/** Parsed amount: exact integer taka (digit string) and paise 0–99 (no float rounding). */
export interface ParsedCurrency {
  /** Integer taka, digits only, no leading zeros except `"0"` */
  integerStr: string;
  /** Fractional part in paisa, 0–99 */
  paisa: number;
}

/**
 * Parse user input without losing precision on large integers or decimal fractions.
 * Handles: 11165500.56, ১১১৬৫৫০০.৫৬, 11111111111111.21
 */
export function parseCurrencyInput(input: string): ParsedCurrency | null {
  let cleaned = input.trim();
  if (!cleaned) return null;

  cleaned = stripOuterQuotes(cleaned);
  if (!cleaned) return null;

  cleaned = banglaToBanglaDigits(cleaned);
  cleaned = cleaned.replace(/,/g, "");

  if (cleaned.startsWith("-")) return null;

  const dotIdx = cleaned.indexOf(".");
  let intRaw: string;
  let fracRaw: string | undefined;

  if (dotIdx === -1) {
    intRaw = cleaned;
    fracRaw = undefined;
  } else if (cleaned.indexOf(".", dotIdx + 1) !== -1) {
    return null;
  } else {
    intRaw = cleaned.slice(0, dotIdx);
    fracRaw = cleaned.slice(dotIdx + 1);
  }

  if (intRaw !== "" && !/^\d+$/.test(intRaw)) return null;
  if (fracRaw !== undefined && fracRaw !== "" && !/^\d+$/.test(fracRaw)) return null;

  const integerStr = (intRaw === "" ? "0" : intRaw.replace(/^0+/, "")) || "0";

  let paisa = 0;
  if (fracRaw !== undefined && fracRaw.length > 0) {
    const a = fracRaw[0] ?? "0";
    const b = fracRaw[1] ?? "0";
    paisa = parseInt(a + b, 10);
  }

  return { integerStr, paisa };
}

/**
 * @deprecated Prefer {@link parseCurrencyInput}; this uses `number` and loses precision for large values.
 */
export function parseUserInput(input: string): number | null {
  const p = parseCurrencyInput(input);
  if (!p) return null;
  const n = Number(p.integerStr) + p.paisa / 100;
  return Number.isFinite(n) ? n : null;
}

/**
 * Format currency display with Bangla comma style (exact decimals when given {@link ParsedCurrency}).
 */
export function formatCurrencyDisplay(amount: number): string;
export function formatCurrencyDisplay(parsed: ParsedCurrency): string;
export function formatCurrencyDisplay(amount: number | ParsedCurrency): string {
  if (typeof amount === "object" && amount !== null && "integerStr" in amount) {
    const dec = amount.paisa.toString().padStart(2, "0");
    return formatBanglaComma(`${amount.integerStr}.${dec}`);
  }
  const rounded = Math.round(amount * 100) / 100;
  return formatBanglaComma(rounded.toFixed(2));
}
