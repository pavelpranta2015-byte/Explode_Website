import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { ShieldCheck, Heart, Sparkles, Truck, CheckCircle2 } from "lucide-react";

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.nav.about} | EXPLODE BD`,
    description: "Learn about EXPLODE BD's philosophy, mission, and premium modest fashion craftsmanship in Bangladesh.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/about`,
      languages: {
        en: "https://explodebd.com/en/about",
        bn: "https://explodebd.com/bn/about",
      },
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const t = getTranslations(locale);

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      {/* Hero Header */}
      <div className="bg-[#465137] text-white py-14 md:py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#D7C5A5] font-semibold">
            {locale === "bn" ? "আমাদের পরিচিতি ও অঙ্গীকার" : "Our Heritage & Story"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold">
            {t.brand.name}
          </h1>
          <p className="font-serif-heading italic text-lg sm:text-xl text-[#D7C5A5]">
            &ldquo;{t.brand.tagline}&rdquo;
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-sm sm:text-base text-[#77786F] leading-relaxed">
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#292B26]">
              {locale === "bn" ? "শালীনতার সৌন্দর্যে আপনার আত্মবিশ্বাস" : "Modesty Meets Modern Elegance"}
            </h2>
            <p>
              {locale === "bn"
                ? "EXPLODE BD বাংলাদেশের নারীদের জন্য একটি খাঁটি মডেস্টি ফ্যাশন ব্র্যান্ড। আমরা বিশ্বাস করি, শালীনতা কেবল একটি পোশাকের পছন্দ নয় — এটি প্রতিটি নারীর মার্জিত ব্যক্তিত্ব ও আত্মবিশ্বাসের অনন্য বহিঃপ্রকাশ।"
                : "EXPLODE BD is a dedicated modest fashion sanctuary in Bangladesh. We believe that modesty is not merely an outfit choice — it is a reflection of dignity, personal grace, and inner peace."}
            </p>
            <p>
              {locale === "bn"
                ? "আমাদের প্রতিটি কালেকশন তৈরির পেছনে থাকে দীর্ঘ গবেষণা ও ফেব্রিক টেস্ট। বাংলাদেশের আর্দ্র আবহাওয়াকে মাথায় রেখে আমরা নিয়ে এসেছি পিন-মুক্ত রিবড কটন জার্সি রেডি হিজাব, অস্বচ্ছ কোরিয়ান মসক্রিপ এবং সম্পূর্ণ শালীন সালাত স্যুট ও খিমার সেট।"
                : "Every piece in our catalogue begins with exhaustive fabric research. Engineered for Bangladesh's tropical humidity, our collections feature snag-free ribbed jersey slip-on hijabs, opaque mosscrepe draperies, and lightweight prayer telekungs."}
            </p>
          </div>

          <div className="relative aspect-4/5 rounded-3xl overflow-hidden shadow-lg border-4 border-white">
            <Image
              src="/images/banners/modest-campaign.png"
              alt="EXPLODE BD Sisterhood"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Pillars / Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-[#D7C5A5]/40">
          <div className="bg-white p-6 rounded-2xl border border-[#D7C5A5]/40 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#68734B]/10 flex items-center justify-center text-[#68734B]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif-heading font-bold text-lg text-[#292B26]">
              {locale === "bn" ? "প্রিমিয়াম কাপড়ের নিশ্চয়তা" : "Breathable Craftsmanship"}
            </h3>
            <p className="text-xs sm:text-sm text-[#77786F] leading-relaxed">
              {locale === "bn"
                ? "কোনো নিম্নমানের পলিয়েস্টার নয়। আমরা শুধুমাত্র ১০০% পরীক্ষিত ও আরামদায়ক ফেব্রিক ব্যবহার করি।"
                : "No cheap translucent fabrics. We source tested, opaque, high-density cotton and crepe blends that breathe freely."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D7C5A5]/40 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#68734B]/10 flex items-center justify-center text-[#68734B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif-heading font-bold text-lg text-[#292B26]">
              {locale === "bn" ? "পরিপূর্ণ শালীন মাপ" : "Authentic Coverage"}
            </h3>
            <p className="text-xs sm:text-sm text-[#77786F] leading-relaxed">
              {locale === "bn"
                ? "প্রতিটি হিজাবের এল ও এক্সএল সাইজে বুক ও কাঁধের পরিপূর্ণ কভারেজের বাস্তব নিশ্চয়তা।"
                : "Every hijab size is cut with deliberate front and back measurements to ensure comfortable modest coverage."}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#D7C5A5]/40 space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#68734B]/10 flex items-center justify-center text-[#68734B]">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif-heading font-bold text-lg text-[#292B26]">
              {locale === "bn" ? "সিস্টারহুড সেবা" : "Dedicated Support"}
            </h3>
            <p className="text-xs sm:text-sm text-[#77786F] leading-relaxed">
              {locale === "bn"
                ? "আমাদের কাস্টমার কেয়ার টিম সবসময় আপনার সাইজ, রং ও স্টাইলিং সংক্রান্ত সহায়তায় প্রস্তুত।"
                : "Our responsive customer support team is always ready to guide you on sizing, styling, and color pairing."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
