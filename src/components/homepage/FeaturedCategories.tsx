import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Locale, Category } from "@/types";
import { getTranslations } from "@/lib/i18n";
import { ArrowRight } from "lucide-react";

interface FeaturedCategoriesProps {
  categories: Category[];
  locale: Locale;
}

export const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  categories,
  locale,
}) => {
  const t = getTranslations(locale);

  return (
    <section id="categories" className="py-16 md:py-24 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs uppercase tracking-widest text-[#68734B] font-bold">
            {locale === "bn" ? "এক্সপ্লোড কালেকশন" : "Curated Collections"}
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#292B26]">
            {locale === "bn" ? "জনপ্রিয় ক্যাটাগরিগুলো ব্রাউজ করুন" : "Explore Featured Categories"}
          </h2>
          <p className="text-sm text-[#77786F]">
            {locale === "bn"
              ? "আপনার প্রয়োজনীয় রেডি হিজাব, নামাজ কালেকশন ও মার্জিত পোশাক একনজরে।"
              : "Discover thoughtfully designed modest essentials, from ready-to-wear hijabs to cooling prayer suits."}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/category/${category.slug}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#D7C5A5]/40 hover:border-[#68734B] shadow-xs hover:shadow-md transition-all duration-300"
            >
              <div className="relative aspect-square w-full bg-[#FAF7F2] overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.name[locale]}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-3 inset-x-3 text-white">
                  <h3 className="font-serif-heading text-sm sm:text-base font-semibold leading-tight drop-shadow-xs">
                    {category.name[locale]}
                  </h3>
                  <span className="text-[11px] text-[#D7C5A5] flex items-center gap-1 mt-1 font-medium">
                    <span>{category.itemCount || 5} {locale === "bn" ? "পণ্য" : "items"}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
