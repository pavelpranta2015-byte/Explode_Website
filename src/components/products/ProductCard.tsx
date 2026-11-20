"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product, Locale } from "@/types";
import { formatPrice, getTranslations } from "@/lib/i18n";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { Heart, ShoppingBag, Check } from "lucide-react";

interface ProductCardProps {
  product: Product;
  locale: Locale;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, locale }) => {
  const t = getTranslations(locale);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const addToCart = useCartStore((state) => state.addItem);

  const primaryImage = product.images[0] || "/images/explode-logo.png";
  const hoverImage = product.images[1] || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultVariant = product.variants[0];
    addToCart(
      {
        id: `${product.id}-${defaultVariant?.id || "default"}`,
        productId: product.id,
        variantId: defaultVariant?.id || "default",
        slug: product.slug,
        title: product.title,
        image: primaryImage,
        price: defaultVariant?.price || product.price,
        originalPrice: defaultVariant?.originalPrice || product.originalPrice,
        selectedColor: defaultVariant?.colorName,
        selectedSize: defaultVariant?.size || product.availableSizes[0],
        inStock: product.inStock,
      },
      1
    );

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden border border-[#D7C5A5]/40 hover:border-[#68734B]/60 shadow-xs hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <Link
        href={`/${locale}/product/${product.slug}`}
        className="relative aspect-4/5 w-full bg-[#FAF7F2] overflow-hidden block"
      >
        <Image
          src={isHovered ? hoverImage : primaryImage}
          alt={product.title[locale]}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges: Discount, New Arrival, Best Seller */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountPercentage && (
            <span className="bg-[#465137] text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              -{product.discountPercentage}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-[#68734B] text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
              {t.common.new}
            </span>
          )}
          {product.isBestSeller && !product.discountPercentage && (
            <span className="bg-[#D7C5A5] text-[#292B26] text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {t.common.bestseller}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlistClick}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 cursor-pointer ${
            isInWishlist
              ? "bg-[#68734B] text-white shadow-sm"
              : "bg-white/80 text-[#292B26] hover:bg-white hover:text-[#68734B]"
          }`}
        >
          <Heart
            className={`w-4 h-4 ${isInWishlist ? "fill-current" : ""}`}
          />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block z-10">
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer ${
              justAdded
                ? "bg-[#465137] text-white"
                : "bg-white/95 hover:bg-[#68734B] text-[#292B26] hover:text-white"
            } ${!product.inStock ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 text-[#D7C5A5]" />
                <span>{t.common.addedToCart}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>{product.inStock ? t.common.addToCart : t.common.outOfStock}</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category Tag */}
          <span className="text-[11px] font-medium text-[#77786F] uppercase tracking-wider block mb-1">
            {product.categoryName[locale]}
          </span>

          {/* Product Title */}
          <Link
            href={`/${locale}/product/${product.slug}`}
            className="font-serif-heading font-medium text-sm sm:text-base text-[#292B26] hover:text-[#68734B] line-clamp-1 transition-colors"
          >
            {product.title[locale]}
          </Link>

          {/* Color Swatches */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {product.availableColors.slice(0, 5).map((color, idx) => (
                <span
                  key={idx}
                  title={color.name[locale]}
                  className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {product.availableColors.length > 5 && (
                <span className="text-[10px] text-[#77786F]">
                  +{product.availableColors.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Mobile Add Button */}
        <div className="flex items-center justify-between pt-2 border-t border-[#D7C5A5]/20">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-[#465137]">
              {formatPrice(product.price, locale)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-[#77786F] line-through">
                {formatPrice(product.originalPrice, locale)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Icon */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            aria-label="Add to cart"
            className="sm:hidden p-2 rounded-full bg-[#FAF7F2] text-[#465137] hover:bg-[#68734B] hover:text-white transition-colors"
          >
            {justAdded ? (
              <Check className="w-4 h-4 text-[#68734B]" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
