"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Locale } from "@/types";
import { getTranslations, isValidLocale } from "@/lib/i18n";
import {
  User,
  Package,
  MapPin,
  Gift,
  Info,
} from "lucide-react";

function AccountContent() {
  const params = useParams();
  const rawLocale = Array.isArray(params?.locale) ? params.locale[0] : params?.locale;
  const locale: Locale = isValidLocale(rawLocale as string) ? (rawLocale as Locale) : "en";
  const t = getTranslations(locale);

  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses" | "points">("profile");

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <div className="bg-[#FAF7F2] border-b border-[#D7C5A5]/40 py-8 md:py-12 text-center">
        <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-[#292B26]">
          {t.account.title}
        </h1>
        <p className="text-xs sm:text-sm text-[#77786F] mt-1">
          {t.account.subtitle}
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Backend Ready Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-8 flex items-start gap-3 text-xs text-amber-900 shadow-2xs">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">
              {locale === "bn"
                ? "ব্যাকএন্ড ইন্টিগ্রেশন ইন্টারফেস প্রস্তুত:"
                : "Backend-Ready Architecture Notice:"}
            </p>
            <p className="text-amber-800 mt-0.5">
              {t.account.backendNotice}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <aside className="md:col-span-4 bg-white rounded-3xl p-6 border border-[#D7C5A5]/40 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-[#D7C5A5]/30">
              <div className="w-12 h-12 rounded-full bg-[#68734B]/10 text-[#68734B] flex items-center justify-center font-bold text-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#292B26]">
                  {t.account.demoName}
                </h3>
                <span className="text-xs text-[#77786F]">
                  {t.account.demoPhone}
                </span>
              </div>
            </div>

            <nav className="space-y-1 text-xs sm:text-sm font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-[#68734B] text-white font-semibold"
                    : "text-[#292B26] hover:bg-[#FAF7F2]"
                }`}
              >
                <User className="w-4 h-4" />
                <span>{t.account.profile}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-[#68734B] text-white font-semibold"
                    : "text-[#292B26] hover:bg-[#FAF7F2]"
                }`}
              >
                <Package className="w-4 h-4" />
                <span>{t.account.orders}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("addresses")}
                className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === "addresses"
                    ? "bg-[#68734B] text-white font-semibold"
                    : "text-[#292B26] hover:bg-[#FAF7F2]"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>{t.account.addresses}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("points")}
                className={`w-full text-left px-4 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer ${
                  activeTab === "points"
                    ? "bg-[#68734B] text-white font-semibold"
                    : "text-[#292B26] hover:bg-[#FAF7F2]"
                }`}
              >
                <Gift className="w-4 h-4" />
                <span>{t.account.points}</span>
              </button>
            </nav>
          </aside>

          {/* Tab Content Display */}
          <main className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#D7C5A5]/40 shadow-xs">
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h3 className="font-serif-heading font-bold text-xl text-[#292B26] border-b border-[#D7C5A5]/30 pb-3">
                  {t.account.profile}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-[#465137]">
                      {t.checkout.fullName}
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={t.account.demoName}
                      className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-3 py-2 text-[#292B26]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-[#465137]">
                      {t.checkout.phone}
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={t.account.demoPhone}
                      className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-3 py-2 text-[#292B26]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#D7C5A5]/30 text-xs text-[#77786F]">
                  <p>
                    {locale === "bn"
                      ? "প্রোফাইল তথ্য ও মোবাইল নম্বর ভেরিফিকেশন পরবর্তী ফেজে ওটিপি (OTP) ও সুপাবেস অথেনটিকেশনের মাধ্যমে সচল হবে।"
                      : "Customer profile and phone verification is prepared for direct Supabase Auth integration."}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                <h3 className="font-serif-heading font-bold text-xl text-[#292B26] border-b border-[#D7C5A5]/30 pb-3">
                  {t.account.orders}
                </h3>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D7C5A5]/50 flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <span className="font-mono font-bold text-[#465137]">
                      EX-918234
                    </span>
                    <p className="text-[#77786F]">1x Ribbed Jersey Ready Hijab (Olive Green)</p>
                    <span className="text-[11px] text-[#68734B] font-semibold">
                      Delivered • ৳670
                    </span>
                  </div>
                  <Link
                    href={`/${locale}/track-order`}
                    className="text-xs font-bold text-[#68734B] hover:underline"
                  >
                    Track →
                  </Link>
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="space-y-6">
                <h3 className="font-serif-heading font-bold text-xl text-[#292B26] border-b border-[#D7C5A5]/30 pb-3">
                  {t.account.addresses}
                </h3>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#D7C5A5]/50 text-xs space-y-1">
                  <span className="bg-[#68734B] text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                    Default Delivery Address
                  </span>
                  <p className="font-bold text-[#292B26] pt-1">
                    House #12, Road #4, Dhanmondi, Dhaka - 1205
                  </p>
                  <p className="text-[#77786F]">Contact: +880 1700-000000</p>
                </div>
              </div>
            )}

            {activeTab === "points" && (
              <div className="space-y-6">
                <h3 className="font-serif-heading font-bold text-xl text-[#292B26] border-b border-[#D7C5A5]/30 pb-3">
                  {t.account.points}
                </h3>

                <div className="p-6 rounded-2xl bg-gradient-to-r from-[#465137] to-[#68734B] text-white space-y-2">
                  <span className="text-xs text-[#D7C5A5] uppercase font-bold tracking-wider">
                    EXPLODE BD Sisterhood Rewards
                  </span>
                  <p className="text-2xl font-bold">{t.account.pointsBalance}</p>
                  <p className="text-xs text-[#FAF7F2]/80">
                    {locale === "bn"
                      ? "প্রতিটি ক্রয়ে পয়েন্ট অর্জন করুন এবং পরবর্তী অর্ডারে ডিসকাউন্ট হিসেবে ব্যবহার করুন।"
                      : "Earn 1 point for every ৳100 spent. Redeem points for instant discounts on future orders."}
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="bg-[#FAF7F2] min-h-screen py-20 text-center text-sm text-[#77786F]">Loading account portal...</div>}>
      <AccountContent />
    </Suspense>
  );
}
