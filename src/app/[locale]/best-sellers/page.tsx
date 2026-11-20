import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { productService, categoryService } from "@/services/api";
import { ShopContainer } from "@/components/shop/ShopContainer";

interface BestSellersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: BestSellersPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.nav.bestSellers} | EXPLODE BD`,
    description: "Browse our top-selling modest fashion items, viral ribbed jersey hijabs, and prayer sets.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/best-sellers`,
      languages: {
        en: "https://explodebd.com/en/best-sellers",
        bn: "https://explodebd.com/bn/best-sellers",
      },
    },
  };
}

export default async function BestSellersPage({ params }: BestSellersPageProps) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const t = getTranslations(locale);

  const [products, categories] = await Promise.all([
    productService.getBestSellers(20),
    categoryService.getAllCategories(),
  ]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="bg-[#FAF7F2] border-b border-[#D7C5A5]/40 py-10 md:py-14 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#68734B] font-bold">
            {locale === "bn" ? "সর্বাধিক প্রশংসিত" : "Customer Favorites"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#292B26]">
            {t.nav.bestSellers}
          </h1>
          <p className="text-sm text-[#77786F] max-w-xl mx-auto">
            {locale === "bn"
              ? "হাজারো বোনের বিশ্বস্ত পছন্দ: রিবড জার্সি হিজাব ও সালাত স্যুট কালেকশন।"
              : "Our most popular modest wear items trusted by sisters all across Bangladesh."}
          </p>
        </div>
      </div>

      <ShopContainer
        initialProducts={products}
        categories={categories}
        locale={locale}
      />
    </div>
  );
}
