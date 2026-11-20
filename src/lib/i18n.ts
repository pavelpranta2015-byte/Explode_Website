import enTranslations from "@/translations/en.json";
import bnTranslations from "@/translations/bn.json";
import { Locale } from "@/types";

export const LOCALES: Locale[] = ["en", "bn"];
export const DEFAULT_LOCALE: Locale = "en";

export type Translations = typeof enTranslations;

export function isValidLocale(locale: string): locale is Locale {
  return LOCALES.includes(locale as Locale);
}

export function getTranslations(locale: Locale): Translations {
  if (locale === "bn") {
    return bnTranslations as unknown as Translations;
  }
  return enTranslations as unknown as Translations;
}

export function formatPrice(amount: number, locale: Locale = "en"): string {
  if (locale === "bn") {
    const banglaDigits: { [key: string]: string } = {
      "0": "০",
      "1": "১",
      "2": "২",
      "3": "৩",
      "4": "৪",
      "5": "৫",
      "6": "৬",
      "7": "৭",
      "8": "৮",
      "9": "৯",
    };
    const formatted = amount.toLocaleString("en-US");
    const banglaNum = formatted.replace(/[0-9]/g, (w) => banglaDigits[w] || w);
    return `৳${banglaNum}`;
  }
  return `৳${amount.toLocaleString("en-US")}`;
}
