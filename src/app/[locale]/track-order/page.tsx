"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Locale } from "@/types";
import { getTranslations, isValidLocale } from "@/lib/i18n";
import { orderService } from "@/services/api";
import {
  Search,
  AlertCircle,
  Check,
} from "lucide-react";

function TrackOrderContent() {
  const params = useParams();
  const rawLocale = Array.isArray(params?.locale) ? params.locale[0] : params?.locale;
  const locale: Locale = isValidLocale(rawLocale as string) ? (rawLocale as Locale) : "en";
  const t = getTranslations(locale);

  const [orderQuery, setOrderQuery] = useState("");
  const [phoneQuery, setPhoneQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<{
    found: boolean;
    order?: any;
    statusText?: string;
  } | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim() && !phoneQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await orderService.trackOrder(orderQuery, phoneQuery);
      setResult(res);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <div className="bg-[#FAF7F2] border-b border-[#D7C5A5]/40 py-10 md:py-14 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#68734B] font-bold">
            {locale === "bn" ? "অর্ডার স্ট্যাটাস অনুসন্ধান" : "Real-time Shipment Check"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#292B26]">
            {t.trackOrder.title}
          </h1>
          <p className="text-sm text-[#77786F]">
            {t.trackOrder.subtitle}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
        {/* Search Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D7C5A5]/40 shadow-xs space-y-6">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#465137]">
                {t.trackOrder.orderNumber}
              </label>
              <input
                type="text"
                placeholder="e.g. EX-281940"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-4 py-2.5 text-xs text-[#292B26] font-mono uppercase focus:outline-hidden focus:border-[#68734B]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#465137]">
                {t.trackOrder.phone}
              </label>
              <input
                type="tel"
                placeholder="e.g. 017XXXXXXXX"
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-4 py-2.5 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B]"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching || (!orderQuery.trim() && !phoneQuery.trim())}
              className="w-full py-3.5 rounded-full bg-[#68734B] hover:bg-[#465137] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{isSearching ? t.common.loading : t.trackOrder.trackButton}</span>
            </button>
          </form>
        </div>

        {/* Results Box */}
        {result && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#68734B]/40 shadow-md space-y-6 animate-in fade-in duration-300">
            {result.found ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#D7C5A5]/30">
                  <div>
                    <span className="text-[11px] text-[#68734B] font-bold uppercase">
                      {t.trackOrder.orderFound}
                    </span>
                    <h3 className="font-mono text-lg font-bold text-[#292B26]">
                      {result.order?.orderNumber}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#68734B]/10 text-[#465137] text-xs font-semibold">
                    {result.order?.status === "confirmed"
                      ? locale === "bn"
                        ? "নিশ্চিতকৃত"
                        : "Confirmed"
                      : result.order?.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm">
                  <p className="text-[#465137] font-medium">
                    {result.statusText}
                  </p>
                  <p className="text-[#77786F]">
                    {t.trackOrder.deliveryPartner}
                  </p>
                  <p className="text-[#77786F]">
                    {t.trackOrder.estimatedDelivery}
                  </p>
                </div>

                {/* Tracking Progress Steps */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#D7C5A5]/30 text-center">
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-[#68734B] text-white flex items-center justify-center mx-auto text-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#292B26] block">
                      {locale === "bn" ? "অর্ডার গৃহীত" : "Placed"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-[#68734B] text-white flex items-center justify-center mx-auto text-xs">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#292B26] block">
                      {locale === "bn" ? "প্যাকিং সম্পন্ন" : "Packed"}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-[#D7C5A5] text-[#292B26] flex items-center justify-center mx-auto text-xs font-bold">
                      3
                    </div>
                    <span className="text-[11px] font-medium text-[#77786F] block">
                      {locale === "bn" ? "কুরিয়ারে হস্তান্তর" : "In Courier"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
                <h3 className="font-semibold text-base text-[#292B26]">
                  {locale === "bn"
                    ? "কোনো অর্ডার পাওয়া যায়নি"
                    : "No order record found"}
                </h3>
                <p className="text-xs text-[#77786F]">
                  {locale === "bn"
                    ? "অনুগ্রহ করে আপনার সঠিক ইনভয়েস নম্বর অথবা অর্ডার করার সময় ব্যবহৃত ফোন নম্বর প্রদান করুন।"
                    : "Please check your 6-digit order invoice ID or the phone number used when placing the order."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="bg-[#FAF7F2] min-h-screen py-20 text-center text-sm text-[#77786F]">Loading order tracker...</div>}>
      <TrackOrderContent />
    </Suspense>
  );
}
