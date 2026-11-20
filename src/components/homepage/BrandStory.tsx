import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/types";
import { getTranslations } from "@/lib/i18n";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface BrandStoryProps {
  locale: Locale;
}

export const BrandStory: React.FC<BrandStoryProps> = ({ locale }) => {
  const t = getTranslations(locale);

  return (
    <section className="py-16 md:py-24 bg-white border-y border-[#D7C5A5]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Visual Column */}
          <div className="lg:col-span-5 relative order-2 lg:order-1">
            <div className="relative aspect-4/5 w-full rounded-3xl overflow-hidden shadow-xl border-4 border-[#FAF7F2]">
              <Image
                src="/images/banners/modest-campaign.png"
                alt="EXPLODE BD Brand Philosophy"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#292B26]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 inset-x-6 text-white text-center">
                <span className="font-serif-heading text-lg font-bold">EXPLODE BD</span>
                <p className="text-xs text-[#D7C5A5] mt-1">{t.brand.tagline}</p>
              </div>
            </div>
          </div>

          {/* Text Column */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#68734B]">
                {locale === "bn" ? "আমাদের দর্শন ও গল্প" : "Our Heritage & Philosophy"}
              </span>
              <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#292B26] leading-tight">
                {locale === "bn"
                  ? "শালীনতার সাথে সৌন্দর্য বিকাশের বিশ্বস্ত সঙ্গী"
                  : "Empowering Modest Women Across Bangladesh"}
              </h2>
            </div>

            <p className="text-sm sm:text-base text-[#77786F] leading-relaxed">
              {locale === "bn"
                ? "EXPLODE BD যাত্রা শুরু করেছে এক অনন্য লক্ষ্য নিয়ে — আধুনিক মুসলিম নারীদের জন্য এমন পোশাক ও হিজাব উপহার দেওয়া, যা প্রতিদিনের জীবনে নিয়ে আসবে পরম স্বস্তি, আত্মবিশ্বাস এবং পরিপূর্ণ শালীনতা। আমাদের প্রতিটি ফেব্রিক অত্যন্ত যত্নসহকারে নির্বাচিত যাতে দীর্ঘ ব্যবহারে নষ্ট না হয় এবং সারাদিন মাথায় নিখুঁতভাবে সেট থাকে।"
                : "At EXPLODE BD, we believe modesty and elegance go hand-in-hand. Founded with a vision to make daily modest dressing effortless, our collections celebrate modesty without compromising on comfort, drape, or sophistication. From our signature pin-free Ribbed Jersey to full-coverage cooling Salat Suits, each piece is crafted with genuine attention to fabric and fit."}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#68734B] shrink-0 mt-0.5" />
                <p className="text-sm text-[#292B26]">
                  <strong>{locale === "bn" ? "আরামদায়ক ও শ্বাসযোগ্য ফেব্রিক:" : "Breathable & Non-Slip:"}</strong>{" "}
                  {locale === "bn"
                    ? "গরমেও শীতল অনুভূতি দেয় এমন প্রিমিয়াম কটন ও মসক্রিপ ফেব্রিক।"
                    : "Curated materials tested for Bangladesh's humid weather and daily routine."}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#68734B] shrink-0 mt-0.5" />
                <p className="text-sm text-[#292B26]">
                  <strong>{locale === "bn" ? "সঠিক পরিমাপ ও বুক কভারেজ:" : "Full Modest Coverage:"}</strong>{" "}
                  {locale === "bn"
                    ? "প্রতিটি হিজাবে পর্যাপ্ত দৈর্ঘ্য ও চওড়া পরিমাপ নিশ্চিত করা হয়।"
                    : "Specially tailored front and back dimensions designed for genuine modest coverage."}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#68734B] shrink-0 mt-0.5" />
                <p className="text-sm text-[#292B26]">
                  <strong>{locale === "bn" ? "সরাসরি যোগাযোগ ও সহায়তা:" : "Personal Sisterhood Care:"}</strong>{" "}
                  {locale === "bn"
                    ? "অর্ডার থেকে শুরু করে ডেলিভারি ও সাইজ পরামর্শে আমাদের আন্তরিক টিম।"
                    : "Dedicated customer support over WhatsApp and Facebook Messenger for styling tips."}
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#68734B] hover:text-[#465137] hover:underline"
              >
                <span>{locale === "bn" ? "আমাদের বিস্তারিত গল্প পড়ুন" : "Learn More About Us"}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
