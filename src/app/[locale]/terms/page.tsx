import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { FileText, Scale } from "lucide-react";

interface PolicyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PolicyPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.footer.policies.terms} | EXPLODE BD`,
    description: "Official terms and conditions for shopping at EXPLODE BD.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/terms`,
      languages: {
        en: "https://explodebd.com/en/terms",
        bn: "https://explodebd.com/bn/terms",
      },
    },
  };
}

export default async function TermsPage({ params }: PolicyPageProps) {
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
            {locale === "bn" ? "ব্যবহারের শর্তাবলী" : "User Agreement"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#292B26]">
            {t.footer.policies.terms}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D7C5A5]/40 shadow-xs space-y-8 text-sm sm:text-base text-[#77786F] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif-heading font-bold text-xl text-[#292B26] flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#68734B]" />
              <span>{locale === "bn" ? "১. সাধারণ শর্তাবলী" : "1. General Overview"}</span>
            </h2>
            <p>
              {locale === "bn"
                ? "EXPLODE BD ওয়েবসাইট (explodebd.com) ব্যবহার এবং এখান থেকে অর্ডার করার মাধ্যমে আপনি আমাদের শর্তাবলীর সাথে সম্মতি প্রকাশ করছেন। সকল পণ্যের মূল্য বাংলাদেশী টাকায় (BDT ৳) নির্ধারিত।"
                : "By accessing and placing orders through explodebd.com, you agree to comply with our commercial terms. All prices are denominated in Bangladeshi Taka (BDT ৳)."}
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif-heading font-bold text-lg text-[#292B26]">
              {locale === "bn" ? "২. পণ্যের বিবরণ ও রঙ" : "2. Product Imagery & Color Accuracy"}
            </h3>
            <p>
              {locale === "bn"
                ? "আমরা প্রতিটি পণ্যের প্রকৃত ছবি ও প্রাকৃতিক রঙের উপস্থাপনা নিশ্চিত করার সর্বোচ্চ চেষ্টা করি। তবে আপনার ব্যবহৃত ফোন বা কম্পিউটারের স্ক্রিনের উজ্জ্বলতা ও ডিসপ্লে সেটিংসের কারণে রঙের সামান্য তারতম্য দেখা যেতে পারে।"
                : "We strive to display product colors as authentically as possible under studio and natural lighting. Slight variations may occasionally appear depending on display calibration."}
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif-heading font-bold text-lg text-[#292B26]">
              {locale === "bn" ? "৩. অর্ডার ও বাতিলকরণ" : "3. Orders & Cancellations"}
            </h3>
            <p>
              {locale === "bn"
                ? "অর্ডার প্লেস করার পর আমাদের কনফার্মেশন কল চলাকালীন সময়ে আপনি যেকোনো অর্ডার কোনো চার্জ ছাড়াই বাতিল করতে পারবেন। তবে পার্সেল কুরিয়ারে হস্তান্তরের পর অনাকাঙ্ক্ষিত বাতিলকরণ গ্রহণযোগ্য নয়।"
                : "You may cancel your order free of charge during our initial telephone confirmation. Once the parcel is dispatched with the courier, standard shipping terms apply."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
