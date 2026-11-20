import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations, LOCALES } from "@/lib/i18n";
import { productService } from "@/services/api";
import { PRODUCTS } from "@/data/products";
import { ProductDetailClient } from "@/components/products/ProductDetailClient";
import { ProductCard } from "@/components/products/ProductCard";
import { ChevronRight, Home, ShieldCheck, Sparkles } from "lucide-react";

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of LOCALES) {
    for (const prod of PRODUCTS) {
      params.push({ locale, slug: prod.slug });
    }
  }
  return params;
}

interface ProductPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const product = await productService.getProductBySlug(slug);

  if (!product) return {};

  return {
    title: `${product.title[locale]} | EXPLODE BD`,
    description: product.shortDescription[locale],
    alternates: {
      canonical: `https://explodebd.com/${locale}/product/${slug}`,
      languages: {
        en: `https://explodebd.com/en/product/${slug}`,
        bn: `https://explodebd.com/bn/product/${slug}`,
      },
    },
    openGraph: {
      title: `${product.title[locale]} | EXPLODE BD`,
      description: product.shortDescription[locale],
      images: [
        {
          url: product.images[0] || "/images/explode-logo.png",
          width: 800,
          height: 1000,
          alt: product.title[locale],
        },
      ],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale: rawLocale, slug } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const t = getTranslations(locale);

  const product = await productService.getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const relatedProducts = await productService.getRelatedProducts(
    product.categorySlug,
    product.id,
    4
  );

  // Schema.org Product Structured Data
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title.en,
    image: product.images.map((img) => `https://explodebd.com${img}`),
    description: product.description.en,
    sku: product.variants[0]?.sku || `EX-${product.id}`,
    brand: {
      "@type": "Brand",
      name: "EXPLODE BD",
    },
    offers: {
      "@type": "Offer",
      url: `https://explodebd.com/${locale}/product/${slug}`,
      priceCurrency: "BDT",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "EXPLODE BD",
      },
    },
  };

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
        name: product.categoryName[locale],
        item: `https://explodebd.com/${locale}/category/${product.categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title[locale],
        item: `https://explodebd.com/${locale}/product/${slug}`,
      },
    ],
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-[#D7C5A5]/30 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-[#77786F] overflow-x-auto whitespace-nowrap">
            <Link
              href={`/${locale}`}
              className="hover:text-[#68734B] flex items-center gap-1 shrink-0"
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t.nav.home}</span>
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D7C5A5] shrink-0" />
            <Link
              href={`/${locale}/category/${product.categorySlug}`}
              className="hover:text-[#68734B] shrink-0"
            >
              {product.categoryName[locale]}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#D7C5A5] shrink-0" />
            <span className="text-[#292B26] font-semibold truncate">
              {product.title[locale]}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <ProductDetailClient product={product} locale={locale} />
      </div>

      {/* Product In-Depth Description & Specifications */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D7C5A5]/40 shadow-xs space-y-8">
          <div>
            <h2 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#292B26] mb-4">
              {locale === "bn" ? "পণ্যের বিবরণ ও বৈশিষ্ট্য" : "Detailed Product Description"}
            </h2>
            <p className="text-sm sm:text-base text-[#77786F] leading-relaxed">
              {product.description[locale]}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#D7C5A5]/30 text-sm">
            <div className="space-y-2">
              <h3 className="font-serif-heading font-semibold text-base text-[#465137]">
                {t.product.fabricMaterial}
              </h3>
              <p className="text-[#77786F]">{product.material[locale]}</p>
            </div>

            {product.careInstructions && (
              <div className="space-y-2">
                <h3 className="font-serif-heading font-semibold text-base text-[#465137]">
                  {t.product.care}
                </h3>
                <p className="text-[#77786F]">{product.careInstructions[locale]}</p>
              </div>
            )}
          </div>

          {/* Guarantee Banner */}
          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D7C5A5]/40 flex items-center gap-3 text-xs sm:text-sm text-[#465137]">
            <ShieldCheck className="w-5 h-5 text-[#68734B] shrink-0" />
            <span>
              {locale === "bn"
                ? "এক্সপ্লোড বিডি নিশ্চয়তা: শতভাগ অরিজিনাল ফেব্রিক এবং পার্সেল পাওয়ার ৭ দিনের মধ্যে যেকোনো সাইজ বা রঙ পরিবর্তন সুবিধা।"
                : "EXPLODE BD Guarantee: 100% genuine modest fabric with hassle-free 7-day exchange support."}
            </span>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#68734B]">
              {locale === "bn" ? "সম্পর্কিত কালেকশন" : "Matching Modest Wear"}
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#292B26] mt-1">
              {t.product.relatedProducts}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <ProductCard
                key={relProduct.id}
                product={relProduct}
                locale={locale}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
