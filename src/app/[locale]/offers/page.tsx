import React from "react";
import Link from "next/link";
import { Locale } from "@/types";
import { getTranslations } from "@/lib/i18n";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "bn" }];
}

interface OffersPageProps {
  params: Promise<{ locale: string }>;
}

export default async function OffersPage({ params }: OffersPageProps) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "bn" ? "bn" : "en") as Locale;
  const t = getTranslations(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#D7C5A5]/40 shadow-xs max-w-lg mx-auto space-y-5">
        <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#68734B] flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#292B26]">
          {locale === "bn" ? "বর্তমানে কোনো সক্রিয় অফার নেই" : "No Active Offers Right Now"}
        </h1>
        <p className="text-sm text-[#77786F] leading-relaxed">
          {locale === "bn"
            ? "আমরা সবসময় আমাদের প্রতিটি পণ্যের জন্য সবচেয়ে ন্যায্য এবং নির্ভরযোগ্য মূল্য নিশ্চিত করি।"
            : "We maintain fair, direct, and standard pricing on all our premium modest collections."}
        </p>
        <div className="pt-2">
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#68734B] hover:bg-[#465137] text-white font-semibold text-sm shadow-md transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.cart.continueShopping}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
