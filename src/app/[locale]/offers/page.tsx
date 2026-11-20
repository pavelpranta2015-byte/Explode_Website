import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { productService } from "@/services/api";
import { ProductCard } from "@/components/products/ProductCard";
import { Tag, Sparkles, Copy, Truck, Gift } from "lucide-react";

interface OffersPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: OffersPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.nav.offers} | EXPLODE BD`,
    description: "Exclusive modest fashion deals, free delivery bundles, and promo coupons at EXPLODE BD.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/offers`,
      languages: {
        en: "https://explodebd.com/en/offers",
        bn: "https://explodebd.com/bn/offers",
      },
    },
  };
}

export default async function OffersPage({ params }: OffersPageProps) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const t = getTranslations(locale);

  const allProducts = await productService.getAllProducts();
  const discountedProducts = allProducts.filter(
    (p) => p.discountPercentage && p.discountPercentage > 0
  );

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      {/* Header */}
      <div className="bg-[#FAF7F2] border-b border-[#D7C5A5]/40 py-10 md:py-14 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#68734B] font-bold">
            {locale === "bn" ? "অফিসিয়াল ডিসকাউন্ট ও কুপন" : "Special Modest Perks"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#292B26]">
            {t.nav.offers}
          </h1>
          <p className="text-sm text-[#77786F] max-w-xl mx-auto">
            {locale === "bn"
              ? "চলমান সব নিশ্চিত অফার, ফ্রি ডেলিভারি বান্ডেল ও কুপন কোড।"
              : "Discover active delivery offers, bundle promotions, and valid coupons for your order."}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Active Vouchers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Free Delivery */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D7C5A5]/60 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#68734B]/10 flex items-center justify-center text-[#68734B]">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-serif-heading text-xl font-bold text-[#292B26]">
                {locale === "bn"
                  ? "সমগ্র বাংলাদেশে ফ্রি ডেলিভারি"
                  : "Nationwide Free Delivery"}
              </h3>
              <p className="text-sm text-[#77786F]">
                {locale === "bn"
                  ? "যেকোনো হিজাব বা পোশাকে ২,০০০ টাকা বা তার বেশি অর্ডার করলেই ডেলিভারি সম্পূর্ণ ফ্রি।"
                  : "Automatic zero delivery charge on all orders amounting to ৳2,000 or more."}
              </p>
            </div>
            <div className="pt-4 border-t border-[#D7C5A5]/30 flex items-center justify-between text-xs">
              <span className="font-semibold text-[#68734B]">
                {locale === "bn" ? "কোনো কোডের প্রয়োজন নেই" : "No coupon required"}
              </span>
              <Link
                href={`/${locale}/shop`}
                className="font-bold text-[#465137] hover:underline"
              >
                {t.nav.shop} →
              </Link>
            </div>
          </div>

          {/* Card 2: 10% Off Voucher */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D7C5A5]/60 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#D7C5A5]/20 flex items-center justify-center text-[#465137]">
                <Gift className="w-5 h-5" />
              </div>
              <h3 className="font-serif-heading text-xl font-bold text-[#292B26]">
                {locale === "bn" ? "১০% বিশেষ কুপন ছাড়" : "10% Sisterhood Voucher"}
              </h3>
              <p className="text-sm text-[#77786F]">
                {locale === "bn"
                  ? "১,০০০ টাকার অর্ডারে ১০% ছাড় উপভোগ করতে চেকআউটে ব্যবহার করুন:"
                  : "Enjoy 10% instant discount on cart value of ৳1,000 or above at checkout."}
              </p>
            </div>
            <div className="pt-4 border-t border-[#D7C5A5]/30 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 bg-[#FAF7F2] border border-dashed border-[#68734B] px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-[#465137]">
                <Tag className="w-3.5 h-3.5 text-[#68734B]" />
                <span>EXPLODE10</span>
              </div>
              <Link
                href={`/${locale}/cart`}
                className="text-xs font-bold text-[#465137] hover:underline"
              >
                {locale === "bn" ? "কার্টে প্রয়োগ করুন →" : "Apply in Cart →"}
              </Link>
            </div>
          </div>
        </div>

        {/* Discounted Products */}
        {discountedProducts.length > 0 && (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#68734B]">
                {locale === "bn" ? "বিশেষ মূল্যের পণ্য" : "Special Price Items"}
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#292B26] mt-1">
                {locale === "bn" ? "ছাড়যুক্ত কালেকশন" : "Discounted Collection"}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {discountedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
