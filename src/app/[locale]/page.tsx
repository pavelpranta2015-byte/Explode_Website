import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { productService, categoryService, reviewService } from "@/services/api";
import { HeroBanner } from "@/components/homepage/HeroBanner";
import { FeaturedCategories } from "@/components/homepage/FeaturedCategories";
import { BrandStory } from "@/components/homepage/BrandStory";
import { WhyChooseUs } from "@/components/homepage/WhyChooseUs";
import { CustomerReviews } from "@/components/homepage/CustomerReviews";
import { Newsletter } from "@/components/homepage/Newsletter";
import { ProductCard } from "@/components/products/ProductCard";
import { Sparkles, ArrowRight, ShieldCheck, Truck } from "lucide-react";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.brand.name} — ${t.brand.tagline}`,
    description: t.brand.shortDescription,
    alternates: {
      canonical: `https://explodebd.com/${locale}`,
      languages: {
        en: "https://explodebd.com/en",
        bn: "https://explodebd.com/bn",
      },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const t = getTranslations(locale);

  const [categories, bestSellers, newArrivals, reviews] = await Promise.all([
    categoryService.getFeaturedCategories(),
    productService.getBestSellers(4),
    productService.getNewArrivals(4),
    reviewService.getAllReviews(),
  ]);

  // Schema.org Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://explodebd.com/#organization",
        name: "EXPLODE BD",
        url: "https://explodebd.com",
        logo: "https://explodebd.com/images/explode-logo.png",
        slogan: "Increase your beauty with modesty.",
        sameAs: [
          "https://www.facebook.com/explodebd",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+8801999101157",
          contactType: "customer service",
          areaServed: "BD",
          availableLanguage: ["English", "Bengali"],
        },
      },
      {
        "@type": "WebSite",
        "@id": "https://explodebd.com/#website",
        url: "https://explodebd.com",
        name: "EXPLODE BD",
        description: "Premium modest fashion and hijab e-commerce in Bangladesh.",
        publisher: {
          "@id": "https://explodebd.com/#organization",
        },
        inLanguage: locale === "bn" ? "bn-BD" : "en-US",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <HeroBanner locale={locale} />

      <FeaturedCategories categories={categories} locale={locale} />

      {/* Best Sellers Section */}
      <section className="py-16 md:py-20 bg-white border-b border-[#D7C5A5]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#68734B]">
                {locale === "bn" ? "গ্রাহকদের সর্বাধিক পছন্দের" : "Most Loved"}
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#292B26] mt-1">
                {t.nav.bestSellers}
              </h2>
            </div>
            <Link
              href={`/${locale}/best-sellers`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#68734B] hover:text-[#465137] transition-colors group"
            >
              <span>{locale === "bn" ? "সবগুলো দেখুন" : "View All Best Sellers"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <BrandStory locale={locale} />

      {/* New Arrivals Section */}
      <section className="py-16 md:py-20 bg-[#FAF7F2] border-b border-[#D7C5A5]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#68734B] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "তাজা সংযোজন" : "Fresh In Stock"}</span>
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#292B26] mt-1">
                {t.nav.newArrivals}
              </h2>
            </div>
            <Link
              href={`/${locale}/new-arrivals`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#68734B] hover:text-[#465137] transition-colors group"
            >
              <span>{locale === "bn" ? "সকল নতুন কালেকশন" : "View All New Arrivals"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Modest Announcement Banner */}
      <section className="py-12 bg-gradient-to-r from-[#465137] via-[#596440] to-[#68734B] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="bg-[#D7C5A5] text-[#292B26] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide inline-block">
                {locale === "bn" ? "বিশেষ ডেলিভারি অফার" : "Special Modest Offer"}
              </span>
              <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold">
                {locale === "bn"
                  ? "২,০০০ টাকার অধিক অর্ডারে সমগ্র বাংলাদেশে ফ্রি ডেলিভারি!"
                  : "Free Nationwide Delivery on Orders Above ৳2,000"}
              </h3>
              <p className="text-xs sm:text-sm text-[#FAF7F2]/80 max-w-xl">
                {locale === "bn"
                  ? "আপনার পছন্দের হিজাব ও সালাত স্যুট বেছে নিন, ডেলিভারি চার্জ সম্পূর্ণ ফ্রি।"
                  : "Order your favorite ready-to-wear hijabs, prayer sets, and accessories with zero delivery cost."}
              </p>
            </div>
            <div className="shrink-0">
              <Link
                href={`/${locale}/offers`}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#FAF7F2] hover:bg-white text-[#465137] font-semibold text-sm shadow-md transition-all group"
              >
                <span>{locale === "bn" ? "অফার দেখুন" : "Explore Offers"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs locale={locale} />

      <CustomerReviews reviews={reviews} locale={locale} />

      <Newsletter locale={locale} />
    </>
  );
}
