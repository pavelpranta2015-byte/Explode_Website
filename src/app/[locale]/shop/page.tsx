import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { productService, categoryService } from "@/services/api";
import { ShopContainer } from "@/components/shop/ShopContainer";

interface ShopPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ShopPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.shop.title} | EXPLODE BD`,
    description: t.shop.subtitle,
    alternates: {
      canonical: `https://explodebd.com/${locale}/shop`,
      languages: {
        en: "https://explodebd.com/en/shop",
        bn: "https://explodebd.com/bn/shop",
      },
    },
  };
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const t = getTranslations(locale);

  const [products, categories] = await Promise.all([
    productService.getAllProducts(),
    categoryService.getAllCategories(),
  ]);

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      {/* Page Header */}
      <div className="bg-[#FAF7F2] border-b border-[#D7C5A5]/40 py-10 md:py-14 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#68734B] font-bold">
            {locale === "bn" ? "এক্সপ্লোড বিডি স্টোর" : "EXPLODE BD Official Catalogue"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#292B26]">
            {t.shop.title}
          </h1>
          <p className="text-sm text-[#77786F] max-w-xl mx-auto">
            {t.shop.subtitle}
          </p>
        </div>
      </div>

      {/* Interactive Shop Filters & Grid wrapped in Suspense */}
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-[#77786F]">
            Loading modest catalogue...
          </div>
        }
      >
        <ShopContainer
          initialProducts={products}
          categories={categories}
          locale={locale}
        />
      </Suspense>
    </div>
  );
}
