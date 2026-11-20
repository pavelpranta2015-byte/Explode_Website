import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/types";
import { getTranslations } from "@/lib/i18n";
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";

interface HeroBannerProps {
  locale: Locale;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ locale }) => {
  const t = getTranslations(locale);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] to-[#F5F0E6] py-12 md:py-20 border-b border-[#D7C5A5]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#68734B]/10 border border-[#68734B]/20 text-[#465137] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#68734B]" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#292B26] tracking-tight leading-[1.15]">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-[#77786F] max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href={`/${locale}/shop`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#68734B] hover:bg-[#465137] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all duration-200 group"
              >
                <span>{t.hero.shopNow}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href={`/${locale}/shop#categories`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-[#68734B]/40 hover:border-[#68734B] text-[#465137] bg-white/60 hover:bg-white font-medium text-sm transition-colors"
              >
                {t.hero.explore}
              </Link>
            </div>

            {/* Micro Trust Proofs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-[#D7C5A5]/40 text-xs text-[#465137]">
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <ShieldCheck className="w-4 h-4 text-[#68734B] shrink-0" />
                <span>{locale === "bn" ? "১০০% অরিজিনাল ফেব্রিক" : "100% Authentic Fabric"}</span>
              </div>
              <div className="flex items-center gap-2 justify-center lg:justify-start">
                <HeartHandshake className="w-4 h-4 text-[#68734B] shrink-0" />
                <span>{locale === "bn" ? "পরিপূর্ণ শালীন কভারেজ" : "Full Modest Coverage"}</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center gap-2 justify-center lg:justify-start">
                <span className="w-2 h-2 rounded-full bg-[#68734B]" />
                <span>{locale === "bn" ? "দেশব্যাপী ক্যাশ অন ডেলিভারি" : "Cash on Delivery BD"}</span>
              </div>
            </div>
          </div>

          {/* Right Campaign Image Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white">
              <Image
                src="/images/banners/hero-banner.png"
                alt="EXPLODE BD Modest Campaign"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Floating Quote Card */}
              <div className="absolute bottom-5 inset-x-5 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-[#D7C5A5]/30">
                <p className="font-serif-heading italic text-xs sm:text-sm text-[#292B26] text-center">
                  &ldquo;{t.brand.tagline}&rdquo;
                </p>
                <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-[#D7C5A5]/30 text-[11px] text-[#68734B] font-semibold">
                  <span>EXPLODE BD Official</span>
                  <span>•</span>
                  <span>Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
