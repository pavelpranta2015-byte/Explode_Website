"use client";

import React, { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Locale } from "@/types";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

function LanguageSwitcherContent({
  currentLocale,
  className = "",
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === currentLocale) return;

    if (!pathname) {
      router.push(`/${newLocale}`);
      return;
    }

    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      router.push(`/${newLocale}`);
      return;
    }

    if (segments[0] === "en" || segments[0] === "bn") {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }

    router.push(`/${segments.join("/")}`);
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border border-[#D7C5A5]/60 bg-[#FAF7F2] p-0.5 text-xs font-medium shadow-xs ${className}`}
    >
      <button
        type="button"
        onClick={() => switchLocale("en")}
        aria-label="Switch language to English"
        className={`px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
          currentLocale === "en"
            ? "bg-[#68734B] text-white shadow-xs font-semibold"
            : "text-[#77786F] hover:text-[#292B26]"
        }`}
      >
        EN
      </button>
      <span className="text-[#D7C5A5] mx-0.5 font-light">/</span>
      <button
        type="button"
        onClick={() => switchLocale("bn")}
        aria-label="Switch language to Bangla"
        className={`px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
          currentLocale === "bn"
            ? "bg-[#68734B] text-white shadow-xs font-semibold font-bengali-text"
            : "text-[#77786F] hover:text-[#292B26] font-bengali-text"
        }`}
      >
        বাংলা
      </button>
    </div>
  );
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div
          className={`inline-flex items-center rounded-full border border-[#D7C5A5]/60 bg-[#FAF7F2] p-0.5 text-xs font-medium ${
            props.className || ""
          }`}
        >
          <span className="px-2.5 py-1 text-[#465137] font-semibold">
            {props.currentLocale === "bn" ? "বাংলা" : "EN"}
          </span>
        </div>
      }
    >
      <LanguageSwitcherContent {...props} />
    </Suspense>
  );
};
