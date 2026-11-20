import React from "react";
import Image from "next/image";
import { Locale, Review } from "@/types";
import { Star, CheckCircle, Quote } from "lucide-react";

interface CustomerReviewsProps {
  reviews: Review[];
  locale: Locale;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({
  reviews,
  locale,
}) => {
  return (
    <section className="py-16 md:py-24 bg-white border-t border-[#D7C5A5]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#68734B]">
            {locale === "bn" ? "বাস্তব গ্রাহকদের অভিজ্ঞতা" : "Sisterhood Love & Feedback"}
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#292B26]">
            {locale === "bn" ? "গ্রাহকেরা যা বলছেন" : "What Our Valued Customers Say"}
          </h2>
          <p className="text-sm text-[#77786F]">
            {locale === "bn"
              ? "সরাসরি ফেসবুক পেজ ও মেসেঞ্জার থেকে সংগৃহীত গ্রাহকদের সত্য ও নির্ভরযোগ্য প্রতিক্রিয়া।"
              : "Genuine, verified reviews received from customers across Bangladesh."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#FAF7F2] rounded-2xl p-6 border border-[#D7C5A5]/40 flex flex-col justify-between space-y-4 hover:border-[#68734B] shadow-xs transition-all duration-300"
            >
              <div className="space-y-3">
                {/* Rating stars */}
                <div className="flex items-center gap-1 text-[#68734B]">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current text-[#68734B]" />
                  ))}
                </div>

                <Quote className="w-6 h-6 text-[#D7C5A5]/80" />

                <p className="text-sm text-[#292B26] leading-relaxed italic">
                  &ldquo;{rev.comment[locale]}&rdquo;
                </p>
              </div>

              {/* Author & Verification */}
              <div className="pt-3 border-t border-[#D7C5A5]/30 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-xs text-[#292B26]">
                    {rev.author}
                  </h4>
                  {rev.location && (
                    <span className="text-[11px] text-[#77786F]">
                      {rev.location}
                    </span>
                  )}
                </div>

                {rev.verifiedBuyer && (
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#68734B] font-medium bg-[#68734B]/10 px-2 py-0.5 rounded-full">
                    <CheckCircle className="w-3 h-3" />
                    <span>{locale === "bn" ? "ভেরিফায়েড ক্রেতা" : "Verified"}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
