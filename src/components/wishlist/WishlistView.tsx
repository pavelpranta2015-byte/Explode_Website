"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/types";
import { getTranslations, formatPrice } from "@/lib/i18n";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { Heart, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";

interface WishlistViewProps {
  locale: Locale;
}

export const WishlistView: React.FC<WishlistViewProps> = ({ locale }) => {
  const t = getTranslations(locale);
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  const handleMoveToCart = (product: any) => {
    const defaultVariant = product.variants[0];
    addToCart(
      {
        id: `${product.id}-${defaultVariant?.id || "default"}`,
        productId: product.id,
        variantId: defaultVariant?.id || "default",
        slug: product.slug,
        title: product.title,
        image: product.images[0],
        price: defaultVariant?.price || product.price,
        originalPrice: defaultVariant?.originalPrice || product.originalPrice,
        selectedColor: defaultVariant?.colorName,
        selectedSize: defaultVariant?.size || product.availableSizes[0],
        inStock: product.inStock,
      },
      1
    );
    removeItem(product.id);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl p-10 border border-[#D7C5A5]/40 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] text-[#68734B] flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="font-serif-heading text-xl font-bold text-[#292B26]">
            {t.wishlist.emptyTitle}
          </h2>
          <p className="text-sm text-[#77786F]">
            {t.wishlist.emptySubtitle}
          </p>
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#68734B] hover:bg-[#465137] text-white font-semibold text-xs shadow-md transition-colors"
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
      <div className="flex items-center justify-between pb-6 border-b border-[#D7C5A5]/30 mb-8">
        <p className="text-sm text-[#77786F]">
          {locale === "bn" ? "সংরক্ষিত পণ্য সংখ্যা:" : "Saved products:"}{" "}
          <strong className="text-[#292B26]">{items.length}</strong>
        </p>
        <button
          type="button"
          onClick={clearWishlist}
          className="text-xs text-red-600 hover:text-red-800 font-medium hover:underline cursor-pointer"
        >
          {t.common.clearAll}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl overflow-hidden border border-[#D7C5A5]/40 hover:border-[#68734B] shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-4/5 w-full bg-[#FAF7F2]">
              <Image
                src={product.images[0]}
                alt={product.title[locale]}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => removeItem(product.id)}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white text-red-600 shadow-xs cursor-pointer"
                aria-label="Remove from wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <span className="text-[11px] text-[#77786F] uppercase">
                  {product.categoryName[locale]}
                </span>
                <Link
                  href={`/${locale}/product/${product.slug}`}
                  className="font-serif-heading font-semibold text-sm text-[#292B26] hover:text-[#68734B] line-clamp-1 block"
                >
                  {product.title[locale]}
                </Link>
                <span className="text-base font-bold text-[#465137] mt-1 block">
                  {formatPrice(product.price, locale)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleMoveToCart(product)}
                className="w-full py-2.5 rounded-xl bg-[#68734B] hover:bg-[#465137] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t.wishlist.moveToCart}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
