import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { CartView } from "@/components/cart/CartView";

interface CartPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CartPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.cart.title} | EXPLODE BD`,
    description: "Review your selected modest fashion hijabs, prayer sets, and accessories.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/cart`,
      languages: {
        en: "https://explodebd.com/en/cart",
        bn: "https://explodebd.com/bn/cart",
      },
    },
  };
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const t = getTranslations(locale);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="bg-[#FAF7F2] border-b border-[#D7C5A5]/40 py-8 md:py-12 text-center">
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#292B26]">
          {t.cart.title}
        </h1>
      </div>

      <CartView locale={locale} />
    </div>
  );
}
