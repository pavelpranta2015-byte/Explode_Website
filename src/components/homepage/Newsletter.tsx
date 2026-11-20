"use client";

import React, { useState } from "react";
import { Locale } from "@/types";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

interface NewsletterProps {
  locale: Locale;
}

export const Newsletter: React.FC<NewsletterProps> = ({ locale }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@") || !email.includes(".")) {
      setStatus("error");
      setErrorMessage(
        locale === "bn"
          ? "অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস লিখুন।"
          : "Please enter a valid email address."
      );
      return;
    }

    setStatus("success");
    setEmail("");
  };

  return (
    <section className="py-16 bg-[#465137] text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="text-xs uppercase tracking-widest text-[#D7C5A5] font-semibold">
          {locale === "bn" ? "এক্সপ্লোড সিস্টারহুড" : "EXPLODE BD Sisterhood"}
        </span>

        <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold">
          {locale === "bn"
            ? "নতুন আগমন ও বিশেষ অফারের আপডেট পেতে যুক্ত থাকুন"
            : "Stay Connected for Exclusive Modest Releases"}
        </h2>

        <p className="text-sm text-[#FAF7F2]/80 max-w-xl mx-auto">
          {locale === "bn"
            ? "আমাদের নতুন হিজাব ডিজাইন, সালাত স্যুটের স্টক ও ডিসকাউন্টের খবর সর্বপ্রথম আপনার ইনবক্সে পান।"
            : "Be the first to hear about new ready-to-wear hijab shades, prayer collections, and secret flash deals."}
        </p>

        {status === "success" ? (
          <div className="bg-[#FAF7F2] text-[#292B26] p-4 rounded-2xl max-w-md mx-auto flex items-center gap-3 shadow-md animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-6 h-6 text-[#68734B] shrink-0" />
            <div className="text-left text-xs sm:text-sm">
              <p className="font-semibold text-[#465137]">
                {locale === "bn" ? "ধন্যবাদ যুক্ত হওয়ার জন্য!" : "Thank you for subscribing!"}
              </p>
              <p className="text-[#77786F]">
                {locale === "bn"
                  ? "(ফ্রন্টএন্ড সাবস্ক্রিপশন সম্পন্ন; ব্যাকএন্ড ইন্টিগ্রেশন প্রস্তুত)"
                  : "(Frontend subscription validated; ready for Supabase backend hook)"}
              </p>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
          >
            <div className="relative w-full">
              <Mail className="w-5 h-5 text-[#77786F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder={
                  locale === "bn"
                    ? "আপনার ইমেইল এড্রেস লিখুন"
                    : "Enter your email address"
                }
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                className="w-full bg-white text-[#292B26] rounded-full pl-11 pr-4 py-3 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#D7C5A5]"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#D7C5A5] hover:bg-[#FAF7F2] text-[#292B26] font-semibold text-sm transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            >
              {locale === "bn" ? "সাবস্ক্রাইব করুন" : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-xs text-[#FAF7F2] bg-red-800/60 py-1.5 px-4 rounded-full inline-flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMessage}</span>
          </p>
        )}
      </div>
    </section>
  );
};
