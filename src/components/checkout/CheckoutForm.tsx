"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Locale, PaymentMethod } from "@/types";
import { getTranslations, formatPrice } from "@/lib/i18n";
import { useCartStore } from "@/store/useCartStore";
import { orderService } from "@/services/api";
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  MessageCircle,
  AlertCircle,
  ShoppingBag,
  ArrowLeft,
  Phone,
  MapPin,
  CreditCard,
  Banknote,
  Send,
} from "lucide-react";

interface CheckoutFormProps {
  locale: Locale;
}

const BD_DISTRICTS = [
  "Dhaka",
  "Gazipur",
  "Narayanganj",
  "Chattogram (Chittagong)",
  "Sylhet",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Bogura",
  "Cox's Bazar",
  "Feni",
  "Brahmanbaria",
  "Tangail",
  "Faridpur",
  "Jessore",
  "Kushtia",
  "Pabna",
  "Dinajpur",
  "Jamalpur",
  "Other Districts",
];

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ locale }) => {
  const t = getTranslations(locale);
  const { items, getSubtotal, clearCart } = useCartStore();

  const subtotal = getSubtotal();

  // Form Fields State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [district, setDistrict] = useState("Dhaka");
  const [cityArea, setCityArea] = useState("");
  const [fullAddress, setFullAddress] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const [deliveryZone, setDeliveryZone] = useState<"inside" | "suburbs" | "outside">("inside");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderNumber: string;
    totalAmount: number;
    itemsCount: number;
    whatsappUrl?: string;
  } | null>(null);

  // Delivery Charge logic
  const isFreeDelivery = false;
  const shippingFee = isFreeDelivery
    ? 0
    : deliveryZone === "inside"
    ? 80
    : deliveryZone === "suburbs"
    ? 100
    : 130;

  const totalAmount = subtotal + shippingFee;

  const validatePhone = (number: string): boolean => {
    const cleaned = number.replace(/\D/g, "");
    // Bangladesh mobile number pattern: 013, 014, 015, 016, 017, 018, 019 followed by 8 digits (11 total)
    return /^01[3-9]\d{8}$/.test(cleaned);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      newErrors.fullName = t.checkout.errors.nameRequired;
    }

    if (!validatePhone(phone)) {
      newErrors.phone = t.checkout.errors.phoneInvalid;
    }

    if (!district) {
      newErrors.district = t.checkout.errors.districtRequired;
    }

    if (!cityArea.trim()) {
      newErrors.cityArea = t.checkout.errors.cityAreaRequired;
    }

    if (!fullAddress.trim()) {
      newErrors.fullAddress = t.checkout.errors.addressRequired;
    }

    if (paymentMethod !== "cod" && !transactionId.trim()) {
      newErrors.transactionId = t.checkout.errors.trxRequired;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      window.scrollTo({ top: 150, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerName: fullName.trim(),
        phone: phone.trim(),
        altPhone: altPhone.trim() || undefined,
        deliveryZone,
        deliveryAddress: {
          fullAddress: fullAddress.trim(),
          cityArea: cityArea.trim(),
          district,
        },
        deliveryNotes: deliveryNotes.trim() || undefined,
        paymentMethod,
        claimedTrxId: transactionId.trim() || undefined,
        paymentNumber: senderNumber.trim() || undefined,
        subtotal,
        shippingFee,
        totalAmount,
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          title: i.title.en,
          color: i.selectedColor?.en,
          size: i.selectedSize,
          quantity: i.quantity,
          unitPrice: i.price,
          totalPrice: i.price * i.quantity,
          image: i.image,
        })),
      };

      let orderNumber = `EX-${Math.floor(100000 + Math.random() * 900000)}`;

      try {
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success && data.orderNumber) {
          orderNumber = data.orderNumber;
        }
      } catch (apiErr) {
        console.error("Order API call error:", apiErr);
      }

      setConfirmedOrder({
        orderNumber,
        totalAmount,
        itemsCount: items.length,
      });

      clearCart();
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is confirmed, display Order Received screen
  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#68734B]/40 shadow-lg text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#68734B]/10 text-[#68734B] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#68734B]">
              {t.checkout.orderPlaced}
            </span>
            <h2 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#292B26]">
              {locale === "bn" ? "আপনার অর্ডারটি গ্রহণ করা হয়েছে!" : "Order Successfully Received!"}
            </h2>
            <p className="text-sm text-[#77786F]">
              {t.checkout.orderConfirmedMsg}
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D7C5A5]/60 inline-block font-mono text-lg font-bold text-[#465137]">
            {confirmedOrder.orderNumber}
          </div>

          <div className="text-left bg-[#FAF7F2] p-5 rounded-2xl text-xs sm:text-sm text-[#465137] space-y-2">
            <p className="font-semibold text-[#292B26]">
              {locale === "bn" ? "গুরুত্বপূর্ণ ডেলিভারি তথ্য:" : "Important Delivery Notice:"}
            </p>
            <p className="text-[#77786F] leading-relaxed">
              {t.checkout.orderNotice}
            </p>
            <div className="pt-2 flex justify-between font-bold text-[#292B26]">
              <span>{locale === "bn" ? "মোট প্রদেয় মূল্য:" : "Total Payable:"}</span>
              <span className="text-[#465137]">
                {formatPrice(confirmedOrder.totalAmount, locale)}
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/${locale}/track-order`}
                className="flex-1 py-3 px-6 rounded-full bg-[#68734B] hover:bg-[#465137] text-white font-semibold text-xs shadow-md transition-colors text-center"
              >
                {t.nav.trackOrder}
              </Link>
              <Link
                href={`/${locale}/shop`}
                className="flex-1 py-3 px-6 rounded-full bg-[#FAF7F2] hover:bg-[#D7C5A5]/20 text-[#465137] border border-[#D7C5A5] font-semibold text-xs transition-colors text-center"
              >
                {t.cart.continueShopping}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty and not confirmed
  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-10 border border-[#D7C5A5]/40 shadow-xs space-y-4">
          <ShoppingBag className="w-12 h-12 text-[#D7C5A5] mx-auto" />
          <h2 className="font-serif-heading text-xl font-bold text-[#292B26]">
            {t.cart.emptyTitle}
          </h2>
          <p className="text-sm text-[#77786F]">
            {locale === "bn"
              ? "চেকআউট করতে প্রথমে কার্টে কোনো পণ্য যোগ করুন।"
              : "Please add products to your cart before proceeding to checkout."}
          </p>
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#68734B] text-white font-semibold text-xs shadow-md"
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
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Customer Info & Payment */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section 1: Delivery Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D7C5A5]/40 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-[#D7C5A5]/30 pb-3">
              <MapPin className="w-5 h-5 text-[#68734B]" />
              <h2 className="font-serif-heading font-bold text-lg text-[#292B26]">
                {t.checkout.deliveryInfoTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#465137]">
                  {t.checkout.fullName} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t.checkout.fullNamePlaceholder}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full bg-[#FAF7F2] border rounded-xl px-3.5 py-2.5 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B] ${
                    errors.fullName ? "border-red-500" : "border-[#D7C5A5]/60"
                  }`}
                />
                {errors.fullName && (
                  <span className="text-[11px] text-red-600 block">
                    {errors.fullName}
                  </span>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#465137]">
                  {t.checkout.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder={t.checkout.phonePlaceholder}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full bg-[#FAF7F2] border rounded-xl px-3.5 py-2.5 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B] ${
                    errors.phone ? "border-red-500" : "border-[#D7C5A5]/60"
                  }`}
                />
                {errors.phone && (
                  <span className="text-[11px] text-red-600 block">
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* District Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#465137]">
                  {t.checkout.district} <span className="text-red-500">*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDistrict(val);
                    if (val === "Dhaka") {
                      setDeliveryZone("inside");
                    } else if (val === "Gazipur" || val === "Narayanganj") {
                      setDeliveryZone("suburbs");
                    } else {
                      setDeliveryZone("outside");
                    }
                  }}
                  className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-3.5 py-2.5 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B]"
                >
                  {BD_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area / Thana */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#465137]">
                  {t.checkout.cityArea} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t.checkout.cityAreaPlaceholder}
                  value={cityArea}
                  onChange={(e) => setCityArea(e.target.value)}
                  className={`w-full bg-[#FAF7F2] border rounded-xl px-3.5 py-2.5 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B] ${
                    errors.cityArea ? "border-red-500" : "border-[#D7C5A5]/60"
                  }`}
                />
                {errors.cityArea && (
                  <span className="text-[11px] text-red-600 block">
                    {errors.cityArea}
                  </span>
                )}
              </div>
            </div>

            {/* Full Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-[#465137]">
                {t.checkout.fullAddress} <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder={t.checkout.fullAddressPlaceholder}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                className={`w-full bg-[#FAF7F2] border rounded-xl px-3.5 py-2 text-xs text-[#292B26] focus:outline-hidden focus:border-[#68734B] ${
                  errors.fullAddress ? "border-red-500" : "border-[#D7C5A5]/60"
                }`}
              />
              {errors.fullAddress && (
                <span className="text-[11px] text-red-600 block">
                  {errors.fullAddress}
                </span>
              )}
            </div>

            {/* Optional Fields: Alt Phone & Delivery Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#77786F]">
                  {t.checkout.altPhone}
                </label>
                <input
                  type="tel"
                  placeholder={t.checkout.altPhonePlaceholder}
                  value={altPhone}
                  onChange={(e) => setAltPhone(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-3.5 py-2 text-xs text-[#292B26]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#77786F]">
                  {t.checkout.deliveryNotes}
                </label>
                <input
                  type="text"
                  placeholder={t.checkout.deliveryNotesPlaceholder}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-xl px-3.5 py-2 text-xs text-[#292B26]"
                />
              </div>
            </div>

            {/* Delivery Zone Selector */}
            <div className="space-y-2 pt-2 border-t border-[#D7C5A5]/30">
              <label className="text-xs font-semibold text-[#465137] block">
                {locale === "bn" ? "ডেলিভারি এরিয়া ও চার্জ:" : "Delivery Region & Rates:"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryZone("inside")}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                    deliveryZone === "inside"
                      ? "border-[#68734B] bg-[#68734B]/10 text-[#465137] font-semibold"
                      : "border-[#D7C5A5]/60 bg-[#FAF7F2] text-[#292B26]"
                  }`}
                >
                  <p>{t.checkout.insideDhaka}</p>
                  <span className="text-[11px] text-[#77786F]">24-48 Hours</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryZone("suburbs")}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                    deliveryZone === "suburbs"
                      ? "border-[#68734B] bg-[#68734B]/10 text-[#465137] font-semibold"
                      : "border-[#D7C5A5]/60 bg-[#FAF7F2] text-[#292B26]"
                  }`}
                >
                  <p>{t.checkout.dhakaSuburbs}</p>
                  <span className="text-[11px] text-[#77786F]">48-72 Hours</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryZone("outside")}
                  className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                    deliveryZone === "outside"
                      ? "border-[#68734B] bg-[#68734B]/10 text-[#465137] font-semibold"
                      : "border-[#D7C5A5]/60 bg-[#FAF7F2] text-[#292B26]"
                  }`}
                >
                  <p>{t.checkout.outsideDhaka}</p>
                  <span className="text-[11px] text-[#77786F]">3-5 Days</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Payment Options */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D7C5A5]/40 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-[#D7C5A5]/30 pb-3">
              <CreditCard className="w-5 h-5 text-[#68734B]" />
              <h2 className="font-serif-heading font-bold text-lg text-[#292B26]">
                {t.checkout.paymentInfoTitle}
              </h2>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-[#68734B] bg-[#68734B]/5"
                    : "border-[#D7C5A5]/50 bg-[#FAF7F2]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="mt-1 accent-[#68734B]"
                />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-[#68734B]" />
                    <span className="text-sm font-bold text-[#292B26]">
                      {t.checkout.cod}
                    </span>
                  </div>
                  <p className="text-xs text-[#77786F]">
                    {t.checkout.codDesc}
                  </p>
                </div>
              </label>

              {/* bKash Manual Payment */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "bkash"
                    ? "border-[#68734B] bg-[#68734B]/5"
                    : "border-[#D7C5A5]/50 bg-[#FAF7F2]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bkash"}
                  onChange={() => setPaymentMethod("bkash")}
                  className="mt-1 accent-[#68734B]"
                />
                <div className="space-y-1">
                  <span className="text-sm font-bold text-[#292B26]">
                    {t.checkout.bkash}
                  </span>
                  <p className="text-xs text-[#77786F]">
                    {t.checkout.bkashDesc}
                  </p>
                </div>
              </label>

              {/* Nagad Manual Payment */}
              <label
                className={`flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === "nagad"
                    ? "border-[#68734B] bg-[#68734B]/5"
                    : "border-[#D7C5A5]/50 bg-[#FAF7F2]"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "nagad"}
                  onChange={() => setPaymentMethod("nagad")}
                  className="mt-1 accent-[#68734B]"
                />
                <div className="space-y-1">
                  <span className="text-sm font-bold text-[#292B26]">
                    {t.checkout.nagad}
                  </span>
                  <p className="text-xs text-[#77786F]">
                    {t.checkout.nagadDesc}
                  </p>
                </div>
              </label>
            </div>

            {/* Manual Payment Fields */}
            {paymentMethod !== "cod" && (
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#D7C5A5]/60 space-y-3 animate-in fade-in duration-200">
                <div className="text-xs text-[#465137] space-y-1">
                  <p className="font-bold">
                    Official {paymentMethod.toUpperCase()} Account: +880 1999-101157 (Personal)
                  </p>
                  <p className="text-[#77786F]">
                    {t.checkout.manualPaymentNotice}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#465137]">
                      {t.checkout.trxId} *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9J182KSL9A"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      className={`w-full bg-white border rounded-xl px-3 py-2 text-xs font-mono uppercase ${
                        errors.transactionId ? "border-red-500" : "border-[#D7C5A5]"
                      }`}
                    />
                    {errors.transactionId && (
                      <span className="text-[10px] text-red-600 block">
                        {errors.transactionId}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-[#465137]">
                      {t.checkout.senderPhone}
                    </label>
                    <input
                      type="tel"
                      placeholder="01XXXXXXXXX"
                      value={senderNumber}
                      onChange={(e) => setSenderNumber(e.target.value)}
                      className="w-full bg-white border border-[#D7C5A5] rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary Breakdown & Confirmation Action */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D7C5A5]/50 shadow-xs space-y-6 sticky top-24">
            <h3 className="font-serif-heading font-bold text-lg text-[#292B26] pb-3 border-b border-[#D7C5A5]/30">
              {t.cart.orderSummary} ({items.length} {t.cart.itemsCount})
            </h3>

            {/* Items mini list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1 divide-y divide-[#D7C5A5]/20">
              {items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-12 h-14 rounded-lg overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#D7C5A5]/30">
                      <Image
                        src={item.image}
                        alt={item.title[locale]}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[#292B26] line-clamp-1">
                        {item.title[locale]}
                      </p>
                      <span className="text-[#77786F]">
                        Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ""}
                      </span>
                    </div>
                  </div>
                  <span className="font-bold text-[#465137]">
                    {formatPrice(item.price * item.quantity, locale)}
                  </span>
                </div>
              ))}
            </div>

            {/* Costs calculation */}
            <div className="space-y-2 pt-4 border-t border-[#D7C5A5]/30 text-xs sm:text-sm">
              <div className="flex justify-between text-[#77786F]">
                <span>{t.common.subtotal}</span>
                <span className="font-semibold text-[#292B26]">
                  {formatPrice(subtotal, locale)}
                </span>
              </div>

              <div className="flex justify-between text-[#77786F]">
                <span>{t.common.shipping}</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="text-[#68734B] font-semibold">
                      {t.common.free} ({locale === "bn" ? "অফার প্রযোজ্য" : "Offer Applied"})
                    </span>
                  ) : (
                    formatPrice(shippingFee, locale)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base sm:text-lg font-bold text-[#292B26] pt-3 border-t border-[#D7C5A5]/40">
                <span>{t.common.total}</span>
                <span className="text-[#465137]">
                  {formatPrice(totalAmount, locale)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[#68734B] hover:bg-[#465137] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span>{t.common.loading}</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{t.checkout.placeOrder}</span>
                </>
              )}
            </button>

            <div className="text-[11px] text-[#77786F] space-y-1 text-center">
              <p>256-Bit Secure Modest Shopping Guarantee</p>
              <p>{t.product.returnPolicy}</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
