import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

interface CheckoutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CheckoutPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.checkout.title} | EXPLODE BD`,
    description: "Complete your order with Cash on Delivery or bKash/Nagad nationwide across Bangladesh.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/checkout`,
      languages: {
        en: "https://explodebd.com/en/checkout",
        bn: "https://explodebd.com/bn/checkout",
      },
    },
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
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
          {t.checkout.title}
        </h1>
      </div>

      <CheckoutForm locale={locale} />
    </div>
  );
}
