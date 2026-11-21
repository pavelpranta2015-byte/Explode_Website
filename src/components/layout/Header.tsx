"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Locale } from "@/types";
import { getTranslations } from "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AnnouncementBar } from "./AnnouncementBar";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  } from "lucide-react";

interface HeaderProps {
  locale: Locale;
}

export const Header: React.FC<HeaderProps> = ({ locale }) => {
  const t = getTranslations(locale);
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hijabDropdownOpen, setHijabDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartTotalItems = useCartStore((state) => state.getTotalItems());
  const wishlistItems = useWishlistStore((state) => state.items);
  const wishlistCount = wishlistItems.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${locale}/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const hijabSubcategories = [
    { name: t.nav.readyToWear, slug: "ready-to-wear-hijabs" },
    { name: t.nav.ribbedJersey, slug: "ribbed-jersey-hijabs" },
    { name: t.nav.mosscrepe, slug: "mosscrepe-hijabs" },
    { name: t.nav.printed, slug: "printed-hijabs" },
    { name: t.nav.plain, slug: "plain-hijabs" },
    { name: t.nav.floralTextured, slug: "floral-and-textured-hijabs" },
  ];

  return (
    <>
      <AnnouncementBar locale={locale} />

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-xs py-2"
            : "bg-[#FAF7F2] border-b border-[#D7C5A5]/40 py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile Menu Button & Official Logo */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="lg:hidden p-2 text-[#465137] hover:text-[#68734B] focus:outline-hidden"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Official Brand Logo */}
              <Link
                href={`/${locale}`}
                className="flex items-center gap-3 group focus:outline-hidden"
              >
                <div className="relative w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-full overflow-hidden shadow-xs border border-[#68734B]/30 transition-transform duration-300 group-hover:scale-105 bg-[#292B26]">
                  <Image
                    src="/images/explode-logo.png"
                    alt="EXPLODE BD Logo"
                    fill
                    priority
                    sizes="(max-width: 640px) 48px, 56px"
                    className="object-contain p-0.5"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-serif-heading font-bold text-lg sm:text-xl tracking-tight text-[#292B26] leading-none group-hover:text-[#68734B] transition-colors">
                    EXPLODE
                  </span>
                  <span className="hidden xs:inline text-[10px] sm:text-xs text-[#77786F] tracking-wider uppercase font-medium">
                    {locale === "bn" ? "সৌন্দর্য বাড়ান শালীনতার সাথে" : "Modest Fashion BD"}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#292B26]">
              <Link
                href={`/${locale}`}
                className="hover:text-[#68734B] transition-colors py-2"
              >
                {t.nav.home}
              </Link>

              <Link
                href={`/${locale}/shop`}
                className="hover:text-[#68734B] transition-colors py-2"
              >
                {t.nav.shop}
              </Link>

              {/* Hijabs Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setHijabDropdownOpen(true)}
                onMouseLeave={() => setHijabDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setHijabDropdownOpen(!hijabDropdownOpen)}
                  className="flex items-center gap-1 hover:text-[#68734B] transition-colors py-2 focus:outline-hidden cursor-pointer"
                >
                  <span>{t.nav.hijabs}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      hijabDropdownOpen ? "rotate-180 text-[#68734B]" : ""
                    }`}
                  />
                </button>

                {hijabDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-lg border border-[#D7C5A5]/30 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {hijabSubcategories.map((item) => (
                      <Link
                        key={item.slug}
                        href={`/${locale}/category/${item.slug}`}
                        onClick={() => setHijabDropdownOpen(false)}
                        className="block px-4 py-2.5 text-sm text-[#292B26] hover:bg-[#FAF7F2] hover:text-[#68734B] transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <div className="border-t border-[#D7C5A5]/20 mt-1 pt-1">
                      <Link
                        href={`/${locale}/shop`}
                        onClick={() => setHijabDropdownOpen(false)}
                        className="block px-4 py-2 text-xs font-semibold text-[#68734B] hover:underline"
                      >
                        {locale === "bn" ? "সকল হিজাব দেখুন →" : "View All Hijabs →"}
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href={`/${locale}/category/salat-suits`}
                className="hover:text-[#68734B] transition-colors py-2"
              >
                {t.nav.salatSuits}
              </Link>

              <Link
                href={`/${locale}/category/khimar-sets`}
                className="hover:text-[#68734B] transition-colors py-2"
              >
                {t.nav.khimarSets}
              </Link>

              <Link
                href={`/${locale}/category/abayas`}
                className="hover:text-[#68734B] transition-colors py-2"
              >
                {t.nav.abayas}
              </Link>

              <Link
                href={`/${locale}/new-arrivals`}
                className="hover:text-[#68734B] transition-colors py-2 flex items-center gap-1"
              >
                <span>{t.nav.newArrivals}</span>
              </Link>

              
            </nav>

            {/* Right Side: Search, Language Switcher, Wishlist, Cart */}
            <div className="flex items-center gap-1 sm:gap-3">
              {/* Search Toggle / Input */}
              <div className="relative">
                {searchOpen ? (
                  <form
                    onSubmit={handleSearchSubmit}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-64 sm:w-72 bg-white rounded-full border border-[#68734B] shadow-md flex items-center px-3 py-1.5 z-10"
                  >
                    <input
                      type="text"
                      placeholder={t.nav.search}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full text-xs sm:text-sm text-[#292B26] focus:outline-hidden bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setSearchOpen(false)}
                      className="p-1 text-[#77786F] hover:text-[#292B26]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    aria-label="Open search bar"
                    className="p-2 text-[#465137] hover:text-[#68734B] hover:bg-[#D7C5A5]/20 rounded-full transition-colors cursor-pointer"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Language Switcher */}
              <LanguageSwitcher currentLocale={locale} className="hidden md:inline-flex" />

              {/* Account Link */}
              <Link
                href={`/${locale}/account`}
                aria-label="My Account"
                className="hidden sm:flex p-2 text-[#465137] hover:text-[#68734B] hover:bg-[#D7C5A5]/20 rounded-full transition-colors"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Wishlist Link with Live Badge */}
              <Link
                href={`/${locale}/wishlist`}
                aria-label="Wishlist"
                className="relative p-2 text-[#465137] hover:text-[#68734B] hover:bg-[#D7C5A5]/20 rounded-full transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#68734B] text-white text-[10px] font-bold flex items-center justify-center animate-in zoom-in-50 duration-200">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Button with Live Badge */}
              <Link
                href={`/${locale}/cart`}
                aria-label="Shopping Cart"
                className="relative flex items-center gap-2 bg-[#68734B] hover:bg-[#465137] text-white px-3.5 py-2 rounded-full font-medium text-xs sm:text-sm shadow-xs transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden md:inline">{t.nav.cart}</span>
                {cartTotalItems > 0 && (
                  <span className="bg-[#D7C5A5] text-[#292B26] px-1.5 py-0.2 rounded-full text-xs font-bold">
                    {cartTotalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-[#D7C5A5]/30 px-4 pt-4 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top duration-300">
            {/* Mobile Search Bar */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder={t.nav.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#D7C5A5]/60 rounded-lg px-4 py-2.5 text-sm text-[#292B26] focus:outline-hidden focus:border-[#68734B]"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#68734B]"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-between border-b border-[#D7C5A5]/20 pb-3">
              <span className="text-xs text-[#77786F] font-medium">
                {locale === "bn" ? "ভাষা পরিবর্তন করুন:" : "Language Selection:"}
              </span>
              <LanguageSwitcher currentLocale={locale} />
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex flex-col space-y-2 text-sm font-medium text-[#292B26]">
              <Link
                href={`/${locale}`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-md hover:bg-[#FAF7F2] hover:text-[#68734B]"
              >
                {t.nav.home}
              </Link>
              <Link
                href={`/${locale}/shop`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-md hover:bg-[#FAF7F2] hover:text-[#68734B]"
              >
                {t.nav.shop}
              </Link>
              <Link
                href={`/${locale}/category/ready-to-wear-hijabs`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-md hover:bg-[#FAF7F2] hover:text-[#68734B]"
              >
                {t.nav.readyToWear}
              </Link>
              <Link
                href={`/${locale}/category/ribbed-jersey-hijabs`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-md hover:bg-[#FAF7F2] hover:text-[#68734B]"
              >
                {t.nav.ribbedJersey}
              </Link>
              <Link
                href={`/${locale}/category/mosscrepe-hijabs`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-md hover:bg-[#FAF7F2] hover:text-[#68734B]"
              >
                {t.nav.mosscrepe}
              </Link>
              <Link
                href={`/${locale}/category/salat-suits`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-md hover:bg-[#FAF7F2] hover:text-[#68734B]"
              >
                {t.nav.salatSuits}
              </Link>
              <Link
                href={`/${locale}/category/khimar-sets`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-md hover:bg-[#FAF7F2] hover:text-[#68734B]"
              >
                {t.nav.khimarSets}
              </Link>
              <Link
                href={`/${locale}/category/abayas`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-md hover:bg-[#FAF7F2] hover:text-[#68734B]"
              >
                {t.nav.abayas}
              </Link>
              <Link
                href={`/${locale}/category/accessories`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-md hover:bg-[#FAF7F2] hover:text-[#68734B]"
              >
                {t.nav.accessories}
              </Link>
              <Link
                href={`/${locale}/new-arrivals`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-md hover:bg-[#FAF7F2] text-[#68734B] font-semibold"
              >
                {t.nav.newArrivals}
              </Link>
              
              <Link
                href={`/${locale}/account`}
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-2 rounded-md hover:bg-[#FAF7F2] hover:text-[#68734B] border-t border-[#D7C5A5]/20 pt-2"
              >
                {t.nav.account}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
