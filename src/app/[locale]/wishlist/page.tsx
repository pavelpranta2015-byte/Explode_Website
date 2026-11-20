import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { WishlistView } from "@/components/wishlist/WishlistView";

interface WishlistPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: WishlistPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.wishlist.title} | EXPLODE BD`,
    description: "View your saved modest fashion favorites, ready hijabs, and prayer dresses.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/wishlist`,
      languages: {
        en: "https://explodebd.com/en/wishlist",
        bn: "https://explodebd.com/bn/wishlist",
      },
    },
  };
}

export default async function WishlistPage({ params }: WishlistPageProps) {
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
          {t.wishlist.title}
        </h1>
      </div>

      <WishlistView locale={locale} />
    </div>
  );
}
