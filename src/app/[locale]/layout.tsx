import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, LOCALES } from "@/lib/i18n";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/common/WhatsAppFloat";
import { CartGreetingModal } from "@/components/cart/CartGreetingModal";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const resolvedParams = await params;
  const rawLocale = resolvedParams.locale;

  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] relative w-full overflow-x-hidden">
      <Header locale={locale} />
      <main className="flex-1 w-full">{children}</main>
      <Footer locale={locale} />
      <WhatsAppFloat locale={locale} />
      <CartGreetingModal locale={locale} />
    </div>
  );
}
