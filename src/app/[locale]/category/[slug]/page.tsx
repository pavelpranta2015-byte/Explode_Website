import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations, LOCALES } from "@/lib/i18n";
import { productService, categoryService } from "@/services/api";
import { CATEGORIES } from "@/data/categories";
import { ShopContainer } from "@/components/shop/ShopContainer";
import { ChevronRight, Home } from "lucide-react";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    for (const cat of CATEGORIES) {
      params.push({ locale, slug: cat.slug });
    }
  }
  return params;
}

interface CategoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const category = await categoryService.getCategoryBySlug(slug);

  if (!category) return {};

  return {
    title: `${category.name[locale]} | EXPLODE BD`,
    description: category.description[locale],
    alternates: {
      canonical: `https://explodebd.com/${locale}/category/${slug}`,
      languages: {
        en: `https://explodebd.com/en/category/${slug}`,
        bn: `https://explodebd.com/bn/category/${slug}`,
      },
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const t = getTranslations(locale);

  const category = await categoryService.getCategoryBySlug(slug);
  if (!category) {
    notFound();
  }

  const [products, allCategories] = await Promise.all([
    productService.getAllProducts({ categorySlug: slug }),
    categoryService.getAllCategories(),
  ]);

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.nav.home,
        item: `https://explodebd.com/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t.nav.shop,
        item: `https://explodebd.com/${locale}/shop`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name[locale],
        item: `https://explodebd.com/${locale}/category/${slug}`,
      },
    ],
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-[#D7C5A5]/30 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#77786F]">
            <Link
              href={`/${locale}`}
              className="hover:text-[#68734B] flex items-center gap-1"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t.nav.home}</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D7C5A5]" />
            <Link href={`/${locale}/shop`} className="hover:text-[#68734B]">
              {t.nav.shop}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D7C5A5]" />
            <span className="text-[#292B26] font-semibold">
              {category.name[locale]}
            </span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#FAF7F2] py-8 md:py-12 border-b border-[#D7C5A5]/30 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#68734B] font-bold">
            {locale === "bn" ? "ক্যাটাগরি কালেকশন" : "Category Collection"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#292B26]">
            {category.name[locale]}
          </h1>
          <p className="text-sm text-[#77786F]">
            {category.description[locale]}
          </p>
        </div>
      </div>

      {/* Filter and Product Grid */}
      <ShopContainer
        initialProducts={products}
        categories={allCategories}
        locale={locale}
        initialCategorySlug={slug}
      />
    </div>
  );
}
