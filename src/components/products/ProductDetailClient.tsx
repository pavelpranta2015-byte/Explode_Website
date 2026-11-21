"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product, ProductVariant, Locale } from "@/types";
import { getTranslations, formatPrice } from "@/lib/i18n";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import {
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  MessageCircle,
  Share2,
} from "lucide-react";

interface ProductDetailClientProps {
  product: Product;
  locale: Locale;
}

export const ProductDetailClient: React.FC<ProductDetailClientProps> = ({
  product,
  locale,
}) => {
  const t = getTranslations(locale);
  const router = useRouter();

  // Active image index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Selected Variant state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {
      id: "default",
      name: product.title,
      price: product.price,
      inStock: product.inStock,
      sku: "EX-DEF",
    }
  );

  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const addToCart = useCartStore((state) => state.addItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);

  const currentPrice = selectedVariant.price || product.price;
  const currentOriginalPrice = selectedVariant.originalPrice || product.originalPrice;
  const isAvailable = product.inStock && selectedVariant.inStock;

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    // If variant has its own image, find it in product images or switch
    if (variant.image) {
      const imgIdx = product.images.indexOf(variant.image);
      if (imgIdx > -1) {
        setActiveImageIndex(imgIdx);
      }
    }
  };

  const handleAddToCart = () => {
    if (!isAvailable) return;

    addToCart(
      {
        id: `${product.id}-${selectedVariant.id}`,
        productId: product.id,
        variantId: selectedVariant.id,
        slug: product.slug,
        title: product.title,
        image: product.images[activeImageIndex] || product.images[0],
        price: currentPrice,
        originalPrice: currentOriginalPrice,
        selectedColor: selectedVariant.colorName,
        selectedSize: selectedVariant.size,
        inStock: isAvailable,
      },
      quantity
    );

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!isAvailable) return;
    handleAddToCart();
    router.push(`/${locale}/checkout`);
  };

  // WhatsApp prefilled message
  const whatsappText = encodeURIComponent(
    `Hello EXPLODE BD! I am interested in purchasing "${product.title.en}" (Variant: ${
      selectedVariant.name.en || selectedVariant.size || "Standard"
    }) priced at ৳${currentPrice}. Please provide order details.`
  );
  const whatsappUrl = `https://wa.me/8801999101157?text=${whatsappText}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
      {/* Left: Gallery */}
      <div className="lg:col-span-7 space-y-4">
        {/* Main Image Frame */}
        <div className="relative aspect-4/5 w-full bg-white rounded-3xl overflow-hidden border border-[#D7C5A5]/40 shadow-xs">
          <Image
            src={product.images[activeImageIndex] || product.images[0]}
            alt={product.title[locale]}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover object-center"
          />

          

          <button
            type="button"
            onClick={() => toggleWishlist(product)}
            aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all shadow-xs cursor-pointer ${
              isInWishlist
                ? "bg-[#68734B] text-white"
                : "bg-white/80 text-[#292B26] hover:bg-white hover:text-[#68734B]"
            }`}
          >
            <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
          </button>
        </div>

        {/* Thumbnail Selector */}
        {product.images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                  activeImageIndex === idx
                    ? "border-[#68734B] ring-2 ring-[#68734B]/30"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${product.title[locale]} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Product Buy Box & Details */}
      <div className="lg:col-span-5 space-y-6">
        {/* Category & Title */}
        <div>
          <Link
            href={`/${locale}/category/${product.categorySlug}`}
            className="text-xs uppercase tracking-widest text-[#68734B] font-bold hover:underline"
          >
            {product.categoryName[locale]}
          </Link>
          <h1 className="font-serif-heading text-2xl sm:text-3xl font-bold text-[#292B26] mt-1.5 leading-snug">
            {product.title[locale]}
          </h1>
          <p className="text-xs text-[#77786F] mt-1">
            {t.product.sku}: <span className="font-mono">{selectedVariant.sku}</span>
          </p>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-3 p-4 bg-white rounded-2xl border border-[#D7C5A5]/40">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#465137]">
            {formatPrice(currentPrice, locale)}
          </span>
          {currentOriginalPrice && (
            <span className="text-base text-[#77786F] line-through font-medium">
              {formatPrice(currentOriginalPrice, locale)}
            </span>
          )}
          
        </div>

        {/* Short Summary */}
        <p className="text-sm text-[#77786F] leading-relaxed">
          {product.shortDescription[locale]}
        </p>

        {/* Variant Selection (Sizes & Colors) */}
        {product.variants.length > 1 && (
          <div className="space-y-4 border-t border-[#D7C5A5]/30 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#465137]">
                {locale === "bn" ? "ভেরিয়েন্ট নির্বাচন করুন:" : "Select Option / Size / Color:"}
              </label>
              {selectedVariant.colorName && (
                <span className="text-xs text-[#68734B] font-medium">
                  {selectedVariant.colorName[locale]}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {product.variants.map((v) => {
                const isSelected = selectedVariant.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleVariantChange(v)}
                    disabled={!v.inStock}
                    className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#68734B] bg-[#68734B]/5 text-[#465137] ring-1 ring-[#68734B]"
                        : "border-[#D7C5A5]/60 bg-white hover:border-[#68734B] text-[#292B26]"
                    } ${!v.inStock ? "opacity-40 cursor-not-allowed bg-gray-50" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      {v.colorHex && (
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      )}
                      <span>{v.name[locale]}</span>
                    </div>
                    <span className="font-bold text-[#465137]">
                      {formatPrice(v.price, locale)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quantity Selector & Stock Indicator */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center border border-[#D7C5A5]/60 rounded-full bg-white p-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#292B26] hover:bg-[#FAF7F2] font-bold text-sm"
            >
              -
            </button>
            <span className="w-10 text-center font-bold text-sm text-[#292B26]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#292B26] hover:bg-[#FAF7F2] font-bold text-sm"
            >
              +
            </button>
          </div>

          <div className="text-xs">
            {isAvailable ? (
              <span className="inline-flex items-center gap-1.5 text-[#68734B] font-semibold">
                <Check className="w-4 h-4" />
                <span>{t.common.inStock}</span>
              </span>
            ) : (
              <span className="text-red-600 font-semibold">
                {t.common.outOfStock}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className={`flex-1 py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                justAdded
                  ? "bg-[#465137] text-white"
                  : "bg-[#68734B] hover:bg-[#465137] text-white"
              } ${!isAvailable ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4 text-[#D7C5A5]" />
                  <span>{t.common.addedToCart}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAvailable ? t.common.addToCart : t.common.outOfStock}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!isAvailable}
              className={`flex-1 py-3.5 px-6 rounded-full font-semibold text-sm flex items-center justify-center gap-2 bg-[#292B26] hover:bg-[#1A1C18] text-white shadow-md transition-all cursor-pointer ${
                !isAvailable ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Zap className="w-4 h-4 text-[#D7C5A5]" />
              <span>{t.common.buyNow}</span>
            </button>
          </div>

          {/* WhatsApp Direct Order Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-6 rounded-full border border-[#68734B] bg-white hover:bg-[#68734B]/5 text-[#465137] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-[#68734B]" />
            <span>{t.common.whatsappOrder}</span>
          </a>
        </div>

        {/* Product Attributes Accordion / Cards */}
        <div className="space-y-3 pt-4 border-t border-[#D7C5A5]/30 text-xs">
          {/* Material & Fabric */}
          <div className="bg-white p-3.5 rounded-xl border border-[#D7C5A5]/40 space-y-1">
            <span className="font-bold text-[#465137] block">
              {t.product.fabricMaterial}:
            </span>
            <p className="text-[#77786F]">{product.material[locale]}</p>
          </div>

          {/* Measurements */}
          {product.measurements && (
            <div className="bg-white p-3.5 rounded-xl border border-[#D7C5A5]/40 space-y-1">
              <span className="font-bold text-[#465137] block">
                {t.product.measurements}:
              </span>
              <p className="text-[#77786F]">{product.measurements[locale]}</p>
            </div>
          )}

          {/* Delivery & Returns Info */}
          <div className="bg-[#FAF7F2] p-3.5 rounded-xl border border-[#D7C5A5]/40 space-y-2">
            <div className="flex items-center gap-2 text-[#465137] font-semibold">
              <Truck className="w-4 h-4 text-[#68734B]" />
              <span>{t.product.deliveryReturn}</span>
            </div>
            <ul className="text-[#77786F] space-y-1 list-disc list-inside">
              <li>{t.product.dhakaDelivery}</li>
              <li>{t.product.outsideDhakaDelivery}</li>
              <li>{t.product.returnPolicy}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
