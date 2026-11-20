import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { productService, categoryService } from "@/services/api";
import { ShopContainer } from "@/components/shop/ShopContainer";

interface NewArrivalsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: NewArrivalsPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.nav.newArrivals} | EXPLODE BD`,
    description: "Explore the latest modest fashion arrivals, new hijab colors, and modern prayer dresses.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/new-arrivals`,
      languages: {
        en: "https://explodebd.com/en/new-arrivals",
        bn: "https://explodebd.com/bn/new-arrivals",
      },
    },
  };
}

export default async function NewArrivalsPage({ params }: NewArrivalsPageProps) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const t = getTranslations(locale);

  const [products, categories] = await Promise.all([
    productService.getNewArrivals(20),
    categoryService.getAllCategories(),
  ]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <div className="bg-[#FAF7F2] border-b border-[#D7C5A5]/40 py-10 md:py-14 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#68734B] font-bold">
            {locale === "bn" ? "নতুন কালেকশন" : "Just Arrived"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#292B26]">
            {t.nav.newArrivals}
          </h1>
          <p className="text-sm text-[#77786F] max-w-xl mx-auto">
            {locale === "bn"
              ? "সর্বশেষ সংযোজিত প্রিমিয়াম রেডি হিজাব ও মার্জিত পোশাক।"
              : "Discover our freshest designs and newly restocked colors designed for effortless modesty."}
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
