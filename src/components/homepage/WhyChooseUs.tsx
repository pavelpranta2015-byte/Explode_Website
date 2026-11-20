import React from "react";
import { Locale } from "@/types";
import { getTranslations } from "@/lib/i18n";
import { Feather, Shield, Truck, HeartHandshake } from "lucide-react";

interface WhyChooseUsProps {
  locale: Locale;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ locale }) => {
  const t = getTranslations(locale);

  const benefits = [
    {
      icon: Feather,
      title: t.features.f1Title,
      description: t.features.f1Desc,
    },
    {
      icon: Shield,
      title: t.features.f2Title,
      description: t.features.f2Desc,
    },
    {
      icon: Truck,
      title: t.features.f3Title,
      description: t.features.f3Desc,
    },
    {
      icon: HeartHandshake,
      title: t.features.f4Title,
      description: t.features.f4Desc,
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#68734B]">
            {locale === "bn" ? "আমাদের প্রতিশ্রুতি" : "Our Promise"}
          </span>
          <h2 className="font-serif-heading text-2xl sm:text-3xl md:text-4xl font-bold text-[#292B26] mt-2">
            {t.features.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-[#D7C5A5]/40 hover:border-[#68734B] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-[#68734B]/10 text-[#465137] flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#68734B]" />
                </div>
                <h3 className="font-serif-heading font-semibold text-base text-[#292B26]">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#77786F] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
