"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/types";
import { getTranslations, formatPrice } from "@/lib/i18n";
import { useCartStore } from "@/store/useCartStore";
import { couponService } from "@/services/api";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Tag,
  Check,
  AlertCircle,
  Truck,
} from "lucide-react";

interface CartViewProps {
  locale: Locale;
}

export const CartView: React.FC<CartViewProps> = ({ locale }) => {
  const t = getTranslations(locale);

  const { items, updateQuantity, removeItem, clearCart, getSubtotal } =
    useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    description: string;
  } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  const subtotal = getSubtotal();

  // Free shipping threshold: 2,000 BDT
  

  // Standard shipping fee inside Dhaka (80 BDT), free if subtotal >= 2000
  const estimatedShipping = subtotal === 0 ? 0 : 80;

  const discountValue = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, subtotal - discountValue + estimatedShipping);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplying(true);
    setCouponError("");

    try {
      const coupon = await couponService.validateCoupon(couponCode);
      if (!coupon) {
        setCouponError(
          locale === "bn"
            ? "অকার্যকর কুপন কোড।"
            : "Invalid or expired coupon code."
        );
        return;
      }

      if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
        setCouponError(
          locale === "bn"
            ? `এই কুপনের জন্য সর্বনিম্ন অর্ডারের পরিমাণ ৳${coupon.minOrderAmount}`
            : `Minimum order amount for this voucher is ৳${coupon.minOrderAmount}`
        );
        return;
      }

      const discount =
        coupon.discountType === "percentage"
          ? Math.round((subtotal * coupon.discountValue) / 100)
          : coupon.discountValue;

      setAppliedCoupon({
        code: coupon.code,
        discountAmount: discount,
        description: coupon.description[locale],
      });
      setCouponCode("");
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-12 border border-[#D7C5A5]/40 shadow-xs max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#68734B] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-serif-heading text-2xl font-bold text-[#292B26]">
            {t.cart.emptyTitle}
          </h2>
          <p className="text-sm text-[#77786F]">
            {t.cart.emptySubtitle}
          </p>
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#68734B] hover:bg-[#465137] text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.cart.continueShopping}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Cart Table Header */}
          <div className="bg-white rounded-2xl border border-[#D7C5A5]/40 overflow-hidden shadow-xs">
            <div className="p-4 sm:p-6 border-b border-[#D7C5A5]/30 flex items-center justify-between">
              <h2 className="font-serif-heading font-bold text-lg text-[#292B26]">
                {t.cart.title} ({items.length})
              </h2>
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-800 font-medium hover:underline cursor-pointer"
              >
                {t.common.clearAll}
              </button>
            </div>

            {/* Items List */}
            <div className="divide-y divide-[#D7C5A5]/20">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#D7C5A5]/30">
                      <Image
                        src={item.image}
                        alt={item.title[locale]}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <Link
                        href={`/${locale}/product/${item.slug}`}
                        className="font-serif-heading font-semibold text-sm sm:text-base text-[#292B26] hover:text-[#68734B] transition-colors"
                      >
                        {item.title[locale]}
                      </Link>

                      {/* Variant Details */}
                      <div className="text-xs text-[#77786F] flex flex-wrap gap-2">
                        {item.selectedSize && (
                          <span className="bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#D7C5A5]/40">
                            Size: {item.selectedSize}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#D7C5A5]/40 flex items-center gap-1">
                            {item.selectedColor.hex && (
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: item.selectedColor.hex }}
                              />
                            )}
                            {item.selectedColor[locale]}
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-bold text-[#465137] sm:hidden pt-1">
                        {formatPrice(item.price, locale)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0">
                    <div className="flex items-center border border-[#D7C5A5]/60 rounded-full bg-white p-0.5 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#292B26] hover:bg-[#FAF7F2] font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-[#292B26]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[#292B26] hover:bg-[#FAF7F2] font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right hidden sm:block min-w-20">
                      <span className="text-base font-bold text-[#465137]">
                        {formatPrice(item.price * item.quantity, locale)}
                      </span>
                      {item.quantity > 1 && (
                        <span className="block text-[11px] text-[#77786F]">
                          {formatPrice(item.price, locale)} each
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      className="p-2 text-[#77786F] hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Link
              href={`/${locale}/shop`}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#68734B] hover:text-[#465137]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.cart.continueShopping}</span>
            </Link>
          </div>
        </div>

        {/* Right: Order Summary Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D7C5A5]/50 shadow-xs space-y-6">
            <h3 className="font-serif-heading font-bold text-lg text-[#292B26] pb-3 border-b border-[#D7C5A5]/30">
              {t.cart.orderSummary}
            </h3>

            {/* Voucher Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-semibold text-[#465137]">
                {locale === "bn" ? "কুপন কোড ব্যবহার করুন:" : "Apply Promo Code:"}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. EXPLODE10"
                  value={couponCode}
                  onChange={(e) => {
                    setCouponCode(e.target.value.toUpperCase());
                    setCouponError("");
                  }}
                  className="flex-1 bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-hidden focus:border-[#68734B]"
                />
                <button
                  type="submit"
                  disabled={isApplying || !couponCode.trim()}
                  className="px-4 py-2 bg-[#465137] hover:bg-[#68734B] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                >
                  {t.common.apply}
                </button>
              </div>

              {couponError && (
                <p className="text-xs text-red-600 flex items-center gap-1 pt-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{couponError}</span>
                </p>
              )}

              {appliedCoupon && (
                <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#68734B]/40 flex items-center justify-between text-xs text-[#465137]">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5 text-[#68734B]" />
                    <span>
                      {appliedCoupon.code} (-{formatPrice(appliedCoupon.discountAmount, locale)})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-500 hover:text-red-700 text-[11px] underline"
                  >
                    {t.common.remove}
                  </button>
                </div>
              )}
            </form>

            {/* Calculations Breakdown */}
            <div className="space-y-3 pt-4 border-t border-[#D7C5A5]/30 text-sm">
              <div className="flex justify-between text-[#77786F]">
                <span>{t.common.subtotal}</span>
                <span className="font-semibold text-[#292B26]">
                  {formatPrice(subtotal, locale)}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-[#68734B] font-medium">
                  <span>{t.common.discount}</span>
                  <span>-{formatPrice(appliedCoupon.discountAmount, locale)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#77786F]">
                <span>{t.common.shipping}</span>
                <span>
                  {estimatedShipping === 0 ? (
                    <span className="text-[#68734B] font-semibold">
                      {t.common.free}
                    </span>
                  ) : (
                    formatPrice(estimatedShipping, locale)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base sm:text-lg font-bold text-[#292B26] pt-3 border-t border-[#D7C5A5]/40">
                <span>{t.common.total}</span>
                <span className="text-[#465137]">
                  {formatPrice(finalTotal, locale)}
                </span>
              </div>
            </div>

            {/* Checkout Button */}
            <Link
              href={`/${locale}/checkout`}
              className="w-full py-4 rounded-full bg-[#68734B] hover:bg-[#465137] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer group"
            >
              <span>{t.cart.proceedToCheckout}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <p className="text-[11px] text-[#77786F] text-center">
              {locale === "bn"
                ? "ক্যাশ অন ডেলিভারি এবং বিকাশ/নগদ ম্যানুয়াল পেমেন্ট সুবিধা রয়েছে।"
                : "Supports Cash on Delivery & bKash / Nagad payment."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
