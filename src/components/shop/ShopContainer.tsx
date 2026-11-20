"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Product, Category, Locale } from "@/types";
import { ProductCard } from "@/components/products/ProductCard";
import { getTranslations, formatPrice } from "@/lib/i18n";
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  PackageOpen,
} from "lucide-react";

interface ShopContainerProps {
  initialProducts: Product[];
  categories: Category[];
  locale: Locale;
  initialCategorySlug?: string;
}

function ShopContainerContent({
  initialProducts,
  categories,
  locale,
  initialCategorySlug,
}: ShopContainerProps) {
  const t = getTranslations(locale);
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || initialCategorySlug || "all";

  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(urlCategory);
  const [selectedSize, setSelectedSize] = useState<string>("all");
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Available size options
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      p.availableSizes?.forEach((s) => set.add(s));
    });
    return Array.from(set);
  }, [initialProducts]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    let list = [...initialProducts];

    // Category filter
    if (selectedCategory !== "all") {
      list = list.filter((p) => p.categorySlug === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title.en.toLowerCase().includes(q) ||
          p.title.bn.toLowerCase().includes(q) ||
          p.categoryName.en.toLowerCase().includes(q) ||
          p.categoryName.bn.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Size filter
    if (selectedSize !== "all") {
      list = list.filter((p) => p.availableSizes?.includes(selectedSize));
    }

    // Max Price filter
    list = list.filter((p) => p.price <= maxPrice);

    // In Stock filter
    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    // Sorting
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      case "bestseller":
        list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
      case "featured":
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return list;
  }, [
    initialProducts,
    selectedCategory,
    searchQuery,
    selectedSize,
    maxPrice,
    inStockOnly,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSize("all");
    setMaxPrice(3000);
    setInStockOnly(false);
    setSortBy("featured");
  };

  const isFiltered =
    searchQuery !== "" ||
    selectedCategory !== "all" ||
    selectedSize !== "all" ||
    maxPrice < 3000 ||
    inStockOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Search and Mobile Filter Trigger Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#D7C5A5]/40">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <Search className="w-4 h-4 text-[#77786F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t.shop.allProducts + " - " + t.nav.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-[#D7C5A5]/60 rounded-full pl-10 pr-10 py-2.5 text-sm text-[#292B26] focus:outline-hidden focus:border-[#68734B] shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#77786F] hover:text-[#292B26]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort and Mobile Filter Button */}
        <div className="flex items-center justify-between md:justify-end gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#D7C5A5] bg-white text-xs font-semibold text-[#465137] shadow-2xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#68734B]" />
            <span>{t.common.filter}</span>
            {isFiltered && (
              <span className="w-2 h-2 rounded-full bg-[#68734B]" />
            )}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#77786F] hidden sm:inline">
              {t.common.sortBy}:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-[#D7C5A5]/60 rounded-full px-3 py-2 text-xs font-medium text-[#292B26] focus:outline-hidden focus:border-[#68734B] shadow-2xs"
            >
              <option value="featured">{t.shop.sortFeatured}</option>
              <option value="newest">{t.shop.sortNewest}</option>
              <option value="bestseller">{t.common.bestseller}</option>
              <option value="price-asc">{t.shop.sortPriceAsc}</option>
              <option value="price-desc">{t.shop.sortPriceDesc}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-heading font-bold text-base text-[#292B26] flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#68734B]" />
              <span>{t.common.filter}</span>
            </h3>
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-[#68734B] hover:text-[#465137] flex items-center gap-1 font-medium hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.common.clearAll}</span>
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2 border-t border-[#D7C5A5]/30 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#465137]">
              {t.shop.filterByCategory}
            </h4>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-[#68734B] text-white font-semibold"
                    : "text-[#292B26] hover:bg-[#FAF7F2]"
                }`}
              >
                {t.shop.allProducts}
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === c.slug
                      ? "bg-[#68734B] text-white font-semibold"
                      : "text-[#292B26] hover:bg-[#FAF7F2]"
                  }`}
                >
                  {c.name[locale]}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-3 border-t border-[#D7C5A5]/30 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#465137]">
                {t.shop.filterByPrice}
              </h4>
              <span className="text-xs font-bold text-[#68734B]">
                ≤ {formatPrice(maxPrice, locale)}
              </span>
            </div>
            <input
              type="range"
              min="150"
              max="3000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#68734B] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#77786F]">
              <span>৳150</span>
              <span>৳3,000</span>
            </div>
          </div>

          {/* Size Filter */}
          {allSizes.length > 0 && (
            <div className="space-y-2 border-t border-[#D7C5A5]/30 pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#465137]">
                {t.shop.filterBySize}
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedSize("all")}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selectedSize === "all"
                      ? "bg-[#68734B] border-[#68734B] text-white"
                      : "bg-white border-[#D7C5A5]/60 text-[#292B26] hover:border-[#68734B]"
                  }`}
                >
                  {t.shop.allProducts}
                </button>
                {allSizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      selectedSize === s
                        ? "bg-[#68734B] border-[#68734B] text-white"
                        : "bg-white border-[#D7C5A5]/60 text-[#292B26] hover:border-[#68734B]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* In Stock Only Toggle */}
          <div className="border-t border-[#D7C5A5]/30 pt-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#292B26]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded text-[#68734B] focus:ring-[#68734B] accent-[#68734B]"
              />
              <span>{t.shop.inStockOnly}</span>
            </label>
          </div>
        </aside>

        {/* Product Grid & States */}
        <main className="md:col-span-3">
          {/* Active Filter Pills Bar */}
          {isFiltered && (
            <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-[#D7C5A5]/20">
              <span className="text-xs text-[#77786F]">
                {locale === "bn" ? "সক্রিয় ফিল্টার:" : "Active Filters:"}
              </span>
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D7C5A5] text-xs text-[#465137]">
                  {categories.find((c) => c.slug === selectedCategory)?.name[locale]}
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedSize !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D7C5A5] text-xs text-[#465137]">
                  Size: {selectedSize}
                  <button
                    type="button"
                    onClick={() => setSelectedSize("all")}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {maxPrice < 3000 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FAF7F2] border border-[#D7C5A5] text-xs text-[#465137]">
                  ≤ {formatPrice(maxPrice, locale)}
                  <button
                    type="button"
                    onClick={() => setMaxPrice(3000)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-[#77786F]">
              {locale === "bn" ? "পাওয়া গেছে" : "Showing"}{" "}
              <strong className="text-[#292B26]">{filteredProducts.length}</strong>{" "}
              {locale === "bn" ? "টি পণ্য" : "products"}
            </p>
          </div>

          {/* Products Grid or No Results */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#D7C5A5]/40 space-y-4 max-w-lg mx-auto my-8">
              <PackageOpen className="w-12 h-12 text-[#D7C5A5] mx-auto" />
              <h3 className="font-serif-heading font-semibold text-lg text-[#292B26]">
                {t.shop.noProductsFound}
              </h3>
              <p className="text-xs sm:text-sm text-[#77786F]">
                {t.shop.tryDifferentFilter}
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#68734B] text-white text-xs font-semibold hover:bg-[#465137] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.common.clearAll}</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-xs md:hidden animate-in fade-in duration-200">
          <div className="ml-auto w-4/5 max-w-xs h-full bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#D7C5A5]/30 pb-3">
                <h3 className="font-serif-heading font-bold text-base text-[#292B26]">
                  {t.common.filter}
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-[#77786F]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-[#465137]">
                  {t.shop.filterByCategory}
                </h4>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("all")}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-xs ${
                      selectedCategory === "all"
                        ? "bg-[#68734B] text-white font-semibold"
                        : "text-[#292B26]"
                    }`}
                  >
                    {t.shop.allProducts}
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-xs ${
                        selectedCategory === c.slug
                          ? "bg-[#68734B] text-white font-semibold"
                          : "text-[#292B26]"
                      }`}
                    >
                      {c.name[locale]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2 border-t border-[#D7C5A5]/30 pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-[#465137]">
                    {t.shop.filterByPrice}
                  </h4>
                  <span className="text-xs font-bold text-[#68734B]">
                    ≤ {formatPrice(maxPrice, locale)}
                  </span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="3000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#68734B]"
                />
              </div>

              {/* Stock */}
              <div className="border-t border-[#D7C5A5]/30 pt-4">
                <label className="flex items-center gap-2 text-xs font-medium text-[#292B26]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 rounded text-[#68734B] accent-[#68734B]"
                  />
                  <span>{t.shop.inStockOnly}</span>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-[#D7C5A5]/30 flex gap-2">
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex-1 py-2 rounded-full border border-[#D7C5A5] text-xs font-medium text-[#292B26]"
              >
                {t.common.clearAll}
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 rounded-full bg-[#68734B] text-xs font-semibold text-white"
              >
                {t.common.apply}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const ShopContainer: React.FC<ShopContainerProps> = (props) => {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 text-center text-sm text-[#77786F]">
          Loading modest collection...
        </div>
      }
    >
      <ShopContainerContent {...props} />
    </Suspense>
  );
};
