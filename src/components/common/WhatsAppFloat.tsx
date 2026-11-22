"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Locale } from "@/types";

interface WhatsAppFloatProps {
  locale: Locale;
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ locale }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  const phoneNumber = "8801999101157";
  const message =
    locale === "bn"
      ? "আসসালামু আলাইকুম! আমি EXPLODE BD থেকে পণ্য অর্ডার ও বিস্তারিত জানতে চাই।"
      : "Hello EXPLODE BD! I would like to inquire about your modest fashion collection.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <aside aria-label="Customer Support" className="fixed bottom-20 md:bottom-6 right-5 md:right-6 z-40 flex items-center gap-3">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-white text-[#292B26] px-3.5 py-2 rounded-2xl shadow-lg border border-[#D7C5A5]/60 text-xs animate-fade-in">
          <span className="font-medium">
            {locale === "bn"
              ? "যেকোনো প্রশ্নে সরাসরি WhatsApp করুন"
              : "Chat with us on WhatsApp"}
          </span>
          <button
            onClick={() => setShowTooltip(false)}
            aria-label={locale === "bn" ? "টুলটিপ বন্ধ করুন" : "Dismiss message"}
            className="text-[#77786F] hover:text-[#292B26] ml-1 p-0.5 rounded cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white stroke-none" />
      </a>
    </aside>
  );
};
