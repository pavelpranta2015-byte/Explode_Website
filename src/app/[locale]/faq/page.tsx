import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { HelpCircle, ChevronDown } from "lucide-react";

interface FAQPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: FAQPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.footer.policies.faq} | EXPLODE BD`,
    description: "Frequently Asked Questions about orders, sizes, delivery, and payment at EXPLODE BD.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/faq`,
      languages: {
        en: "https://explodebd.com/en/faq",
        bn: "https://explodebd.com/bn/faq",
      },
    },
  };
}

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const t = getTranslations(locale);

  const faqs = [
    {
      q: {
        en: "Are your ready-to-wear hijabs transparent or see-through?",
        bn: "আপনাদের রেডি হিজাবগুলো কি পাতলা বা ভিতরের অংশ দেখা যায়?",
      },
      a: {
        en: "No. All our fabrics—especially the Korean Mosscrepe and high-density Ribbed Cotton Jersey—are carefully chosen for maximum opacity and modest coverage.",
        bn: "না, একেবারেই না। আমাদের প্রতিটি ফেব্রিক (বিশেষ করে কোরিয়ান মসক্রিপ ও ডেনসিটি রিবড জার্সি) সম্পূর্ণ অস্বচ্ছ ও শালীন কভারেজ নিশ্চিত করে।",
      },
    },
    {
      q: {
        en: "Do I need safety pins to wear the Ribbed Jersey Hijab?",
        bn: "রিবড জার্সি রেডি হিজাব পরতে কি কোনো সেফটিপিনের প্রয়োজন হয়?",
      },
      a: {
        en: "No pins are required! The ribbed cotton fabric naturally clings gently to your head and inner cap without slipping, making it an effortless slip-on experience.",
        bn: "কোনো পিনের প্রয়োজন নেই! রিবড কটন ফেব্রিক মাথায় খুব সুন্দরভাবে বসে থাকে এবং পিছলে যায় না। অনায়াসে মুহূর্তেই পরে ফেলা যায়।",
      },
    },
    {
      q: {
        en: "How long does delivery take inside and outside Dhaka?",
        bn: "ঢাকার ভেতরে ও বাইরে ডেলিভারি পেতে কতদিন সময় লাগে?",
      },
      a: {
        en: "Inside Dhaka City, delivery typically takes 24–48 hours (৳80). For Dhaka Suburbs (Gazipur, Narayanganj), it takes 48–72 hours (৳100). For all other Bangladesh districts, delivery takes 3–5 working days (৳130).",
        bn: "ঢাকা সিটির ভেতরে ২৪-৪৮ ঘণ্টার মধ্যে (৳৮০), ঢাকা সাব-আর্বানে ৪৮-৭২ ঘণ্টায় (৳১০০) এবং ঢাকার বাইরে যেকোনো জেলা শহরে ৩-৫ কার্যদিবসে (৳১৩০) হোম ডেলিভারি পৌঁছে দেওয়া হয়।",
      },
    },
    {
      q: {
        en: "Can I inspect the parcel before paying Cash on Delivery?",
        bn: "ক্যাশ অন ডেলিভারিতে পার্সেল চেক করে কি টাকা পরিশোধ করা যাবে?",
      },
      a: {
        en: "Yes, you can inspect the package in the presence of the courier rider to verify product condition and color before paying.",
        bn: "হ্যাঁ, ডেলিভারিম্যানের সামনে পার্সেলটি চেক করে ফেব্রিক ও কালার ঠিক আছে কি না নিশ্চিত হয়ে মূল্য পরিশোধ করতে পারবেন।",
      },
    },
    {
      q: {
        en: "What if the size doesn't fit or there is a defect?",
        bn: "সাইজ না মিললে বা কোনো ত্রুটি থাকলে কি পরিবর্তন করা যাবে?",
      },
      a: {
        en: "We offer a 7-day hassle-free exchange policy. Just contact us via WhatsApp (+880 1999-101157) or Facebook Messenger with your order number.",
        bn: "অবশ্যই! পার্সেল পাওয়ার ৭ দিনের মধ্যে সাইজ বা ত্রুটির জন্য সহজ এক্সচেঞ্জ সুবিধা রয়েছে। আমাদের হোয়াটসঅ্যাপ বা ফেসবুক ইনবক্সে জানালেই আমরা এক্সচেঞ্জ প্রসেস করে দেব।",
      },
    },
    {
      q: {
        en: "How can I get Free Delivery?",
        bn: "ফ্রি ডেলিভারি পেতে হলে কত টাকার অর্ডার করতে হবে?",
      },
      a: {
        en: "Any order of ৳2,000 or above automatically qualifies for Free Delivery all across Bangladesh!",
        bn: "যেকোনো হিজাব বা পোশাকে ২,০০০ টাকা বা তার বেশি অর্ডার করলেই সমগ্র বাংলাদেশে ডেলিভারি সম্পূর্ণ ফ্রি।",
      },
    },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <div className="bg-[#FAF7F2] border-b border-[#D7C5A5]/40 py-10 md:py-14 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#68734B] font-bold">
            {locale === "bn" ? "প্রয়োজনীয় তথ্যাবলী" : "Help & Questions"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#292B26]">
            {t.footer.policies.faq}
          </h1>
          <p className="text-sm text-[#77786F]">
            {locale === "bn"
              ? "অর্ডার, সাইজ, ডেলিভারি ও ফেব্রিক সংক্রান্ত বহুল জিজ্ঞাসিত প্রশ্নগুলোর উত্তর।"
              : "Common questions about our modest collections, shipping timelines, and fabrics."}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 border border-[#D7C5A5]/40 shadow-xs space-y-2"
          >
            <h3 className="font-serif-heading font-semibold text-base sm:text-lg text-[#292B26] flex items-start gap-2">
              <HelpCircle className="w-5 h-5 text-[#68734B] shrink-0 mt-0.5" />
              <span>{faq.q[locale]}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#77786F] leading-relaxed pl-7">
              {faq.a[locale]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
