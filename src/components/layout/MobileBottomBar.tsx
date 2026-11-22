"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { Home, Compass, ShoppingBag, Truck, MessageCircle } from "lucide-react";

interface MobileBottomBarProps {
  locale: Locale;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ locale }) => {
  const pathname = usePathname();
  const cartTotalItems = useCartStore((state) => state.getTotalItems());

  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
  const isShop = pathname.includes(`/${locale}/shop`) || pathname.includes(`/${locale}/category`);
  const isTrack = pathname.includes(`/${locale}/track-order`);
  const isCart = pathname.includes(`/${locale}/cart`) || pathname.includes(`/${locale}/checkout`);

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D7C5A5]/60 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe"
    >
      <div className="grid grid-cols-5 items-center h-15 px-1">
        {/* Home */}
        <Link
          href={`/${locale}`}
          className={`flex flex-col items-center justify-center gap-1 transition-colors py-1 ${
            isHome ? "text-[#465137] font-bold" : "text-[#77786F] hover:text-[#465137]"
          }`}
        >
          <Home className="w-4.5 h-4.5" strokeWidth={isHome ? 2.3 : 1.8} />
          <span className="text-[10px] tracking-tight">
            {locale === "bn" ? "হোম" : "Home"}
          </span>
        </Link>

        {/* Categories / Shop */}
        <Link
          href={`/${locale}/shop`}
          className={`flex flex-col items-center justify-center gap-1 transition-colors py-1 ${
            isShop ? "text-[#465137] font-bold" : "text-[#77786F] hover:text-[#465137]"
          }`}
        >
          <Compass className="w-4.5 h-4.5" strokeWidth={isShop ? 2.3 : 1.8} />
          <span className="text-[10px] tracking-tight">
            {locale === "bn" ? "ক্যাটাগরি" : "Shop"}
          </span>
        </Link>

        {/* Track Order */}
        <Link
          href={`/${locale}/track-order`}
          className={`flex flex-col items-center justify-center gap-1 transition-colors py-1 ${
            isTrack ? "text-[#465137] font-bold" : "text-[#77786F] hover:text-[#465137]"
          }`}
        >
          <div className="relative">
            <Truck className="w-4.5 h-4.5" strokeWidth={isTrack ? 2.3 : 1.8} />
          </div>
          <span className="text-[10px] tracking-tight whitespace-nowrap">
            {locale === "bn" ? "ট্র্যাক অর্ডার" : "Track Order"}
          </span>
        </Link>

        {/* Cart */}
        <Link
          href={`/${locale}/cart`}
          className={`flex flex-col items-center justify-center gap-1 transition-colors py-1 relative ${
            isCart ? "text-[#465137] font-bold" : "text-[#77786F] hover:text-[#465137]"
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-4.5 h-4.5" strokeWidth={isCart ? 2.3 : 1.8} />
            {cartTotalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#68734B] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartTotalItems > 9 ? "9+" : cartTotalItems}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">
            {locale === "bn" ? "ব্যাগ" : "Cart"}
          </span>
        </Link>

        {/* WhatsApp Help */}
        <a
          href="https://wa.me/8801999101157?text=Hello%20EXPLODE%20BD%2C%20I%20would%20like%20to%20inquire%20about%20my%20order."
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-1 text-[#25D366] hover:text-[#20bd5a] transition-colors py-1"
        >
          <MessageCircle className="w-4.5 h-4.5 fill-[#25D366] stroke-white" />
          <span className="text-[10px] tracking-tight text-[#25D366] font-semibold">
            WhatsApp
          </span>
        </a>
      </div>
    </nav>
  );
};
