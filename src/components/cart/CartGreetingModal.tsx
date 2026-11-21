"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight, X } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/i18n";
import { Locale } from "@/types";

interface CartGreetingModalProps {
  locale: Locale;
}

export const CartGreetingModal: React.FC<CartGreetingModalProps> = ({ locale }) => {
  const lastAddedItem = useCartStore((state) => state.lastAddedItem);
  const isGreetingOpen = useCartStore((state) => state.isGreetingOpen);
  const closeGreeting = useCartStore((state) => state.closeGreeting);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const totalItems = useCartStore((state) => state.getTotalItems());

  // Auto-close after 6 seconds if customer does not interact
  useEffect(() => {
    if (!isGreetingOpen) return;
    const timer = setTimeout(() => {
      closeGreeting();
    }, 6000);
    return () => clearTimeout(timer);
  }, [isGreetingOpen, closeGreeting]);

  if (!isGreetingOpen || !lastAddedItem) return null;

  const itemTitle = locale === "bn" ? lastAddedItem.title.bn : lastAddedItem.title.en;
  const colorName = lastAddedItem.selectedColor
    ? locale === "bn"
      ? lastAddedItem.selectedColor.bn
      : lastAddedItem.selectedColor.en
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#D7C5A5]/60 text-center animate-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={closeGreeting}
          aria-label={locale === "bn" ? "বন্ধ করুন" : "Close"}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#77786F] hover:text-[#292B26] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Greeting Icon & Title */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-13 h-13 rounded-full bg-[#68734B]/10 text-[#68734B] flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-bold tracking-widest uppercase text-[#68734B]">
            {locale === "bn" ? "অর্ডারে যোগ হয়েছে" : "Added to Cart"}
          </span>
          <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#292B26]">
            {locale === "bn"
              ? "ধন্যবাদ! পণ্যটি আপনার কার্টে যুক্ত হয়েছে"
              : "Thank You! Added to Your Bag"}
          </h3>
        </div>

        {/* Product Preview Card */}
        <div className="mt-4 flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-2xl border border-[#D7C5A5]/40 text-left">
          <div className="relative w-14 h-16 shrink-0 rounded-xl overflow-hidden bg-white border border-[#D7C5A5]/30">
            <Image
              src={lastAddedItem.image || "/images/explode-logo.png"}
              alt={itemTitle}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[#292B26] truncate">
              {itemTitle}
            </p>
            <p className="text-[11px] text-[#77786F] mt-0.5">
              {colorName ? `${colorName} • ` : ""}
              {lastAddedItem.selectedSize ? `${lastAddedItem.selectedSize} • ` : ""}
              {locale === "bn" ? `পরিমাণ: ${lastAddedItem.quantity}` : `Qty: ${lastAddedItem.quantity}`}
            </p>
            <p className="text-xs font-bold text-[#465137] mt-1">
              {formatPrice(lastAddedItem.price * lastAddedItem.quantity, locale)}
            </p>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="mt-3 px-1 flex items-center justify-between text-xs text-[#77786F]">
          <span>
            {locale === "bn"
              ? `মোট পণ্য: ${totalItems} টি`
              : `Total Items: ${totalItems}`}
          </span>
          <span className="font-bold text-[#292B26]">
            {locale === "bn" ? "সাবটোটাল: " : "Subtotal: "}
            <span className="text-[#465137]">{formatPrice(subtotal, locale)}</span>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 space-y-2.5">
          <Link
            href={`/${locale}/checkout`}
            onClick={closeGreeting}
            className="w-full py-3 px-6 rounded-full bg-[#68734B] hover:bg-[#465137] text-white font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{locale === "bn" ? "অর্ডার সম্পন্ন করুন" : "Proceed to Checkout"}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/${locale}/cart`}
              onClick={closeGreeting}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#FAF7F2] hover:bg-[#D7C5A5]/30 text-[#465137] border border-[#D7C5A5] font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{locale === "bn" ? "কার্ট দেখুন" : "View Cart"}</span>
            </Link>

            <button
              type="button"
              onClick={closeGreeting}
              className="flex-1 py-2.5 px-4 rounded-full bg-white hover:bg-[#FAF7F2] text-[#77786F] hover:text-[#292B26] border border-[#D7C5A5]/60 font-semibold text-xs transition-colors cursor-pointer"
            >
              {locale === "bn" ? "আরো কেনাকাটা করুন" : "Keep Shopping"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
