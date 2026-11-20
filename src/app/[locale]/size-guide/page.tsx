import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { Ruler, ShieldCheck } from "lucide-react";

interface SizeGuidePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SizeGuidePageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.footer.policies.sizeGuide} | EXPLODE BD`,
    description: "Detailed measurement and sizing charts for EXPLODE BD ready hijabs, salat suits, khimars, and abayas.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/size-guide`,
      languages: {
        en: "https://explodebd.com/en/size-guide",
        bn: "https://explodebd.com/bn/size-guide",
      },
    },
  };
}

export default async function SizeGuidePage({ params }: SizeGuidePageProps) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const t = getTranslations(locale);

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <div className="bg-[#FAF7F2] border-b border-[#D7C5A5]/40 py-10 md:py-14 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#68734B] font-bold">
            {locale === "bn" ? "নিখুঁত পরিমাপের নিশ্চয়তা" : "Flawless Modest Fit"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#292B26]">
            {t.footer.policies.sizeGuide}
          </h1>
          <p className="text-sm text-[#77786F]">
            {locale === "bn"
              ? "আপনার প্রয়োজনীয় কভারেজ ও উচ্চতা অনুযায়ী সঠিক সাইজ বেছে নেওয়ার সম্পূর্ণ চার্ট।"
              : "Comprehensive sizing chart and measurement reference for our modest fashion items."}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Ready Hijabs Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D7C5A5]/40 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#465137]">
            <Ruler className="w-5 h-5 text-[#68734B]" />
            <h2 className="font-serif-heading font-bold text-xl text-[#292B26]">
              {locale === "bn" ? "১. রেডি হিজাব সাইজ চার্ট (L ও XL)" : "1. Ready-to-Wear Hijabs (L & XL)"}
            </h2>
          </div>
          <p className="text-xs text-[#77786F]">
            {locale === "bn"
              ? "আমাদের রেডি হিজাবগুলো থুতনির নিচ থেকে সামনে এবং মাথার ওপর থেকে পেছনের অংশ পর্যন্ত পরিমাপ করা হয়।"
              : "Measured from beneath the chin down the front, and from crown of head down the back."}
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] text-[#465137] border-b border-[#D7C5A5]/60">
                  <th className="py-3 px-4 font-bold">Size</th>
                  <th className="py-3 px-4 font-bold">Front Length (ইঞ্চি)</th>
                  <th className="py-3 px-4 font-bold">Back Length (ইঞ্চি)</th>
                  <th className="py-3 px-4 font-bold">Recommended Modest Coverage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D7C5A5]/20">
                <tr>
                  <td className="py-3 px-4 font-bold text-[#292B26]">Size L</td>
                  <td className="py-3 px-4 text-[#77786F]">30–31 Inches</td>
                  <td className="py-3 px-4 text-[#77786F]">34–35 Inches</td>
                  <td className="py-3 px-4 text-[#465137]">Regular everyday chest coverage</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#292B26]">Size XL</td>
                  <td className="py-3 px-4 text-[#77786F]">34–35 Inches</td>
                  <td className="py-3 px-4 text-[#77786F]">38–39 Inches</td>
                  <td className="py-3 px-4 text-[#465137]">Extended full chest & waist coverage</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Salat Suits & Khimar Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D7C5A5]/40 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#465137]">
            <Ruler className="w-5 h-5 text-[#68734B]" />
            <h2 className="font-serif-heading font-bold text-xl text-[#292B26]">
              {locale === "bn" ? "২. সালাত স্যুট ও খিমার সেট" : "2. Salat Suits (Telekung) & Khimar Sets"}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] text-[#465137] border-b border-[#D7C5A5]/60">
                  <th className="py-3 px-4 font-bold">Product Type</th>
                  <th className="py-3 px-4 font-bold">Top Length</th>
                  <th className="py-3 px-4 font-bold">Skirt Length / Span</th>
                  <th className="py-3 px-4 font-bold">Fit Guide</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D7C5A5]/20">
                <tr>
                  <td className="py-3 px-4 font-bold text-[#292B26]">Salat Suit (Telekung)</td>
                  <td className="py-3 px-4 text-[#77786F]">50–52 Inches</td>
                  <td className="py-3 px-4 text-[#77786F]">48–50 Inches (Elastic waist)</td>
                  <td className="py-3 px-4 text-[#465137]">Fits height 5&apos;0&quot; to 5&apos;7&quot; effortlessly</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#292B26]">Kaftan Khimar Set</td>
                  <td className="py-3 px-4 text-[#77786F]">Front 44&quot; / Back 52&quot;</td>
                  <td className="py-3 px-4 text-[#77786F]">60&quot; Wingspan Drape</td>
                  <td className="py-3 px-4 text-[#465137]">Universal Free Drape with Tie-backs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Abayas Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D7C5A5]/40 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#465137]">
            <Ruler className="w-5 h-5 text-[#68734B]" />
            <h2 className="font-serif-heading font-bold text-xl text-[#292B26]">
              {locale === "bn" ? "৩. আবায়া দৈর্ঘ্য নির্দেশিকা" : "3. Abaya Length & Height Guide"}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2] text-[#465137] border-b border-[#D7C5A5]/60">
                  <th className="py-3 px-4 font-bold">Abaya Size</th>
                  <th className="py-3 px-4 font-bold">Total Length</th>
                  <th className="py-3 px-4 font-bold">Recommended Body Height</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D7C5A5]/20">
                <tr>
                  <td className="py-3 px-4 font-bold text-[#292B26]">Size 52</td>
                  <td className="py-3 px-4 text-[#77786F]">52 Inches</td>
                  <td className="py-3 px-4 text-[#465137]">5&apos;0&quot; – 5&apos;2&quot;</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#292B26]">Size 54</td>
                  <td className="py-3 px-4 text-[#77786F]">54 Inches</td>
                  <td className="py-3 px-4 text-[#465137]">5&apos;3&quot; – 5&apos;4&quot;</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#292B26]">Size 56</td>
                  <td className="py-3 px-4 text-[#77786F]">56 Inches</td>
                  <td className="py-3 px-4 text-[#465137]">5&apos;5&quot; – 5&apos;7&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
