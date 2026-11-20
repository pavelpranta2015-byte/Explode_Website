import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import { Truck, Clock, ShieldCheck, MapPin } from "lucide-react";

interface PolicyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PolicyPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.footer.policies.shipping} | EXPLODE BD`,
    description: "Official shipping rates, courier partners, and delivery timelines across Bangladesh.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/shipping-policy`,
      languages: {
        en: "https://explodebd.com/en/shipping-policy",
        bn: "https://explodebd.com/bn/shipping-policy",
      },
    },
  };
}

export default async function ShippingPolicyPage({ params }: PolicyPageProps) {
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
            {locale === "bn" ? "ডেলিভারি সংক্রান্ত নিয়মাবলী" : "Delivery Information"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#292B26]">
            {t.footer.policies.shipping}
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D7C5A5]/40 shadow-xs space-y-8 text-sm sm:text-base text-[#77786F] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif-heading font-bold text-xl text-[#292B26] flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#68734B]" />
              <span>{locale === "bn" ? "ডেলিভারি চার্জ ও সময়সীমা" : "Rates & Delivery Timelines"}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D7C5A5]/40 space-y-1">
                <span className="font-bold text-[#292B26] block">Inside Dhaka</span>
                <p className="text-xs text-[#465137] font-semibold">৳80 (24–48 Hours)</p>
                <p className="text-[11px] text-[#77786F]">Direct courier doorstep delivery</p>
              </div>
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D7C5A5]/40 space-y-1">
                <span className="font-bold text-[#292B26] block">Dhaka Suburbs</span>
                <p className="text-xs text-[#465137] font-semibold">৳100 (48–72 Hours)</p>
                <p className="text-[11px] text-[#77786F]">Gazipur, Narayanganj, Savar</p>
              </div>
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D7C5A5]/40 space-y-1">
                <span className="font-bold text-[#292B26] block">Outside Dhaka (All BD)</span>
                <p className="text-xs text-[#465137] font-semibold">৳130 (3–5 Working Days)</p>
                <p className="text-[11px] text-[#77786F]">All 64 district headquarters & upazilas</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading font-bold text-xl text-[#292B26] flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#68734B]" />
              <span>{locale === "bn" ? "অর্ডার প্রসেসিং ও কনফার্মেশন" : "Order Processing & Call Confirmation"}</span>
            </h2>
            <p>
              {locale === "bn"
                ? "আমাদের ওয়েবসাইটে অর্ডার সাবমিট করার পর, কুরিয়ারে পার্সেল হ্যান্ডওভার করার পূর্বে আমাদের কাস্টমার কেয়ার টিম ফোন করে ঠিকানা ও প্রোডাক্ট কনফার্ম করে নেবে। কোনো কারণে ফোনে সংযোগ না পাওয়া গেলে অর্ডারটি হোল্ড রাখা হতে পারে।"
                : "After placing an order, our customer care desk calls to confirm the delivery address and ordered items prior to courier dispatch. Please keep your contact phone active."}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-heading font-bold text-xl text-[#292B26] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#68734B]" />
              <span>{locale === "bn" ? "পার্সেল রিসিভ ও ডেলিভারি পার্টনার" : "Parcel Inspection & Couriers"}</span>
            </h2>
            <p>
              {locale === "bn"
                ? "আমরা বিশ্বস্ত কুরিয়ার পার্টনারদের (Steadfast Courier, RedX, Pathao) মাধ্যমে পণ্য ডেলিভারি করি। ডেলিভারিম্যানের সামনে পার্সেলটি দেখে চেক করে নেওয়ার অনুরোধ করা হচ্ছে।"
                : "We partner with verified couriers (Steadfast, RedX, Pathao) for safe nationwide delivery. You can verify the product condition upon delivery."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
