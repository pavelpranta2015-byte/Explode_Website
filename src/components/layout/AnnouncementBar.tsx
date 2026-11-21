"use client";

import React from "react";
import Link from "next/link";
import { Locale } from "@/types";
import { getTranslations } from "@/lib/i18n";
import { Phone, MessageCircle } from "lucide-react";

interface AnnouncementBarProps {
  locale: Locale;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ locale }) => {
  const t = getTranslations(locale);

  return (
    <div className="bg-[#465137] text-[#FAF7F2] text-xs py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
        <p className="font-medium text-center sm:text-left tracking-wide text-[11px] sm:text-xs truncate max-w-full">
          {t.announcement.message}
        </p>
        <div className="flex items-center justify-center gap-2 sm:gap-4 text-[11px] sm:text-xs flex-wrap">
          <a
            href="https://wa.me/8801999101157?text=Hello%20EXPLODE%20BD%2C%20I%20would%20like%20to%20order%20modest%20fashion%20products."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#D7C5A5] transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-[#D7C5A5]" />
            <span>WhatsApp: +880 1999-101157</span>
          </a>
          <span className="hidden md:inline text-white/30">|</span>
          <Link
            href={`/${locale}/track-order`}
            className="hidden md:inline hover:text-[#D7C5A5] transition-colors underline underline-offset-2"
          >
            {t.nav.trackOrder}
          </Link>
        </div>
      </div>
    </div>
  );
};
