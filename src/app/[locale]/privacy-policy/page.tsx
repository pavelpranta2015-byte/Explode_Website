import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { ShieldCheck, Lock, UserCheck } from "lucide-react";

interface PolicyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PolicyPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.footer.policies.privacy} | EXPLODE BD`,
    description: "Official privacy policy and customer data protection principles of EXPLODE BD.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/privacy-policy`,
      languages: {
        en: "https://explodebd.com/en/privacy-policy",
        bn: "https://explodebd.com/bn/privacy-policy",
      },
    },
  };
}

export default async function PrivacyPolicyPage({ params }: PolicyPageProps) {
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
            {locale === "bn" ? "তথ্য সুরক্ষা ও গোপনীয়তা" : "Data Protection"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#292B26]">
            {t.footer.policies.privacy}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D7C5A5]/40 shadow-xs space-y-8 text-sm sm:text-base text-[#77786F] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif-heading font-bold text-xl text-[#292B26] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#68734B]" />
              <span>{locale === "bn" ? "গ্রাহকের ব্যক্তিগত তথ্যের সুরক্ষা" : "Customer Privacy Commitment"}</span>
            </h2>
            <p>
              {locale === "bn"
                ? "EXPLODE BD আপনার ব্যক্তিগত তথ্যের সর্বোচ্চ সুরক্ষা নিশ্চিত করে। অর্ডার সম্পন্ন করা, ডেলিভারি পৌঁছে দেওয়া এবং কাস্টমার সেবার বাইরে আপনার নাম, মোবাইল নম্বর কিংবা ঠিকানা কখনোই কোনো তৃতীয় পক্ষের কাছে বিক্রি বা হস্তান্তর করা হয় না।"
                : "EXPLODE BD strictly respects customer confidentiality. Your personal information—including name, mobile contact, and residential address—is used solely for order processing and courier delivery fulfillment. We never sell or share your data."}
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif-heading font-bold text-lg text-[#292B26]">
              {locale === "bn" ? "আমরা কী ধরনের তথ্য সংগ্রহ করি:" : "Information We Collect:"}
            </h3>
            <ul className="space-y-2 list-disc list-inside">
              <li>{locale === "bn" ? "গ্রাহকের নাম ও মোবাইল নম্বর (অর্ডার কনফার্মেশনের জন্য)।" : "Customer full name and mobile number for verification."}</li>
              <li>{locale === "bn" ? "সম্পূর্ণ ডেলিভারি ঠিকানা (কুরিয়ার মাধ্যমে পার্সেল পৌঁছানোর জন্য)।" : "Accurate shipping address and district for courier routing."}</li>
              <li>{locale === "bn" ? "বিকাশ বা নগদ ট্রানজেকশন আইডি (ম্যানুয়াল পেমেন্ট ভেরিফিকেশনের জন্য)।" : "Transaction IDs (TrxID) exclusively for validating manual payments."}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h3 className="font-serif-heading font-bold text-lg text-[#292B26]">
              {locale === "bn" ? "নিরাপদ সংযোগ:" : "Secure Browsing:"}
            </h3>
            <p>
              {locale === "bn"
                ? "আমাদের ওয়েবসাইট সম্পূর্ণ নিরাপদ এনক্রিপ্টেড (SSL/TLS) প্রোটোকল ব্যবহার করে, যা আপনার ব্রাউজিংকে রাখে সম্পূর্ণ সুরক্ষিত।"
                : "Our platform operates under industry-standard SSL/TLS encryption ensuring safe interaction across every page."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
