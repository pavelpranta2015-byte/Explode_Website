import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { RotateCcw, CheckCircle, AlertTriangle, MessageCircle } from "lucide-react";

interface PolicyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PolicyPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.footer.policies.returns} | EXPLODE BD`,
    description: "7-day return and exchange policy terms for modest fashion items at EXPLODE BD.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/return-exchange-policy`,
      languages: {
        en: "https://explodebd.com/en/return-exchange-policy",
        bn: "https://explodebd.com/bn/return-exchange-policy",
      },
    },
  };
}

export default async function ReturnExchangePolicyPage({ params }: PolicyPageProps) {
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
            {locale === "bn" ? "এক্সচেঞ্জ ও রিটার্ন গ্যারান্টি" : "Customer Satisfaction First"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#292B26]">
            {t.footer.policies.returns}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D7C5A5]/40 shadow-xs space-y-8 text-sm sm:text-base text-[#77786F] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif-heading font-bold text-xl text-[#292B26] flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-[#68734B]" />
              <span>{locale === "bn" ? "৭ দিনের সহজ এক্সচেঞ্জ সুবিধা" : "7-Day Exchange Window"}</span>
            </h2>
            <p>
              {locale === "bn"
                ? "EXPLODE BD গ্রাহকদের সন্তুষ্টিকে সর্বোচ্চ গুরুত্ব দিয়ে থাকে। আপনি পার্সেল হাতে পাওয়ার দিন থেকে পরবর্তী ৭ (সাত) দিনের মধ্যে যেকোনো ত্রুটি বা সাইজ পরিবর্তনের জন্য এক্সচেঞ্জের আবেদন করতে পারবেন।"
                : "At EXPLODE BD, your peace of mind is paramount. You can initiate an exchange request within 7 calendar days of parcel delivery if there is a defect or size mismatch."}
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif-heading font-bold text-lg text-[#292B26]">
              {locale === "bn" ? "এক্সচেঞ্জের শর্তাবলী:" : "Eligible Conditions for Exchange:"}
            </h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>{locale === "bn" ? "পণ্যটি অব্যবহৃত এবং অবিকৃত অবস্থায় থাকতে হবে।" : "The item must remain unworn, unwashed, and in its original pristine condition."}</li>
              <li>{locale === "bn" ? "মূল ট্যাগ এবং প্যাকেজিং অক্ষত থাকতে হবে।" : "Original tags, seal, and packaging must be intact."}</li>
              <li>{locale === "bn" ? "প্রোডাক্টে কোনো সেলাই ত্রুটি বা ছেঁড়া থাকলে ডেলিভারির দিনই ছবি পাঠিয়ে জানাতে হবে।" : "Any fabrication flaws must be reported with a photo upon delivery."}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif-heading font-bold text-lg text-[#292B26]">
              {locale === "bn" ? "যেসব ক্ষেত্রে এক্সচেঞ্জ প্রযোজ্য নয়:" : "Non-Exchangeable Items:"}
            </h3>
            <p>
              {locale === "bn"
                ? "ব্যক্তিগত স্বাস্থ্য সুরক্ষাজনিত কারণে ইনার ক্যাপ (Inner Cap) এবং মাস্ক হিজাব একবার পরার পর রিটার্ন গ্রহণ করা হয় না (যদি না উৎপাদনে ত্রুটি থাকে)।"
                : "For hygiene and personal health guidelines, worn inner caps and personal mask hijabs cannot be returned unless verified as defective upon arrival."}
            </p>
          </section>

          {/* Quick Help Card */}
          <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#D7C5A5]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="font-bold text-[#292B26] block">
                {locale === "bn" ? "এক্সচেঞ্জ করতে সহায়তা প্রয়োজন?" : "Need Help with an Exchange?"}
              </span>
              <p className="text-xs text-[#77786F]">
                WhatsApp: +880 1700-000000 | Email: support@explodebd.com
              </p>
            </div>
            <a
              href="https://wa.me/8801700000000?text=I%20would%20like%20to%20request%20an%20exchange%20for%20my%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#68734B] hover:bg-[#465137] text-white text-xs font-semibold shrink-0 shadow-xs flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{locale === "bn" ? "হোয়াটসঅ্যাপে জানান" : "Message on WhatsApp"}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
