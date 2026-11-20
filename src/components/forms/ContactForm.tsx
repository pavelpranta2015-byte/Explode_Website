"use client";

import React, { useState } from "react";
import { Locale } from "@/types";
import { getTranslations } from "@/lib/i18n";
import { Send, CheckCircle2 } from "lucide-react";

interface ContactFormProps {
  locale: Locale;
}

export function ContactForm({ locale }: ContactFormProps) {
  const t = getTranslations(locale);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#68734B]/40 text-center space-y-3 animate-in fade-in duration-200">
        <CheckCircle2 className="w-10 h-10 text-[#68734B] mx-auto" />
        <h4 className="font-serif-heading font-bold text-base text-[#292B26]">
          {locale === "bn"
            ? "আপনার বার্তা সফলভাবে গ্রহণ করা হয়েছে!"
            : "Thank you for reaching out!"}
        </h4>
        <p className="text-xs text-[#77786F]">
          {locale === "bn"
            ? "আমাদের কাস্টমার কেয়ার প্রতিনিধি দ্রুতই আপনার সাথে যোগাযোগ করবেন।"
            : "Our sisterhood care desk will respond to your inquiry shortly."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#465137]">
            {t.checkout.fullName} *
          </label>
          <input
            type="text"
            required
            placeholder={t.checkout.fullNamePlaceholder}
            className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-3.5 py-2.5 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B]"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[#465137]">
            {t.checkout.phone} *
          </label>
          <input
            type="tel"
            required
            placeholder={t.checkout.phonePlaceholder}
            className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-3.5 py-2.5 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B]"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-[#465137]">
          {locale === "bn" ? "বিষয়:" : "Subject:"}
        </label>
        <input
          type="text"
          placeholder={
            locale === "bn"
              ? "যেমন: সাইজ পরামর্শ / অর্ডার অনুসন্ধান"
              : "e.g. Sizing query / Order tracking inquiry"
          }
          className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-3.5 py-2.5 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B]"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-[#465137]">
          {locale === "bn" ? "আপনার বার্তা:" : "Message:"} *
        </label>
        <textarea
          rows={4}
          required
          placeholder={
            locale === "bn"
              ? "আপনার মন্তব্য বা প্রশ্ন এখানে লিখুন..."
              : "Type your query or comments here..."
          }
          className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-3.5 py-2 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B]"
        />
      </div>

      <button
        type="submit"
        className="py-3 px-8 rounded-full bg-[#68734B] hover:bg-[#465137] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
      >
        <Send className="w-3.5 h-3.5" />
        <span>{locale === "bn" ? "বার্তা পাঠান" : "Submit Inquiry"}</span>
      </button>
    </form>
  );
}
