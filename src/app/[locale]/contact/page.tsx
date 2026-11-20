import React from "react";
import { notFound } from "next/navigation";
import { Locale } from "@/types";
import { isValidLocale, getTranslations } from "@/lib/i18n";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
} from "lucide-react";
import { FacebookIcon } from "@/components/common/Icons";
import { ContactForm } from "@/components/forms/ContactForm";

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "en";
  const t = getTranslations(locale);

  return {
    title: `${t.nav.contact} | EXPLODE BD`,
    description: "Get in touch with EXPLODE BD for modest fashion orders, product inquiries, and custom requests in Bangladesh.",
    alternates: {
      canonical: `https://explodebd.com/${locale}/contact`,
      languages: {
        en: "https://explodebd.com/en/contact",
        bn: "https://explodebd.com/bn/contact",
      },
    },
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const t = getTranslations(locale);

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-16">
      <div className="bg-[#FAF7F2] border-b border-[#D7C5A5]/40 py-10 md:py-14 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-2">
          <span className="text-xs uppercase tracking-widest text-[#68734B] font-bold">
            {locale === "bn" ? "যোগাযোগ ও কাস্টমার কেয়ার" : "Customer Support & Inquiries"}
          </span>
          <h1 className="font-serif-heading text-3xl sm:text-4xl md:text-5xl font-bold text-[#292B26]">
            {t.nav.contact}
          </h1>
          <p className="text-sm text-[#77786F]">
            {locale === "bn"
              ? "যেকোনো পণ্য, অর্ডার বা সাইজ সংক্রান্ত তথ্যে আমাদের সাথে সরাসরি যোগাযোগ করুন।"
              : "We are here to assist you with order status, styling queries, and product recommendations."}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D7C5A5]/40 shadow-xs space-y-6">
              <h3 className="font-serif-heading font-bold text-xl text-[#292B26]">
                {locale === "bn" ? "যোগাযোগের সরাসরি মাধ্যম" : "Direct Channels"}
              </h3>

              {/* WhatsApp Button */}
              <a
                href="https://wa.me/8801700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 hover:bg-[#25D366]/20 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#292B26]">
                    WhatsApp Support
                  </h4>
                  <p className="text-xs text-[#77786F]">
                    +880 1700-000000 (Instant replies)
                  </p>
                </div>
              </a>

              {/* Facebook Page Button */}
              <a
                href="https://www.facebook.com/explodebd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#1877F2]/10 border border-[#1877F2]/30 hover:bg-[#1877F2]/20 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <FacebookIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#292B26]">
                    Official Facebook Page
                  </h4>
                  <p className="text-xs text-[#77786F]">
                    facebook.com/explodebd
                  </p>
                </div>
              </a>

              {/* Address and Hours */}
              <div className="space-y-4 pt-4 border-t border-[#D7C5A5]/30 text-xs sm:text-sm text-[#465137]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#68734B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#292B26]">
                      {locale === "bn" ? "অফিস ঠিকানা:" : "Hub Location:"}
                    </span>
                    <p className="text-[#77786F]">{t.footer.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#68734B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#292B26]">
                      {locale === "bn" ? "হটলাইন:" : "Phone Support:"}
                    </span>
                    <p className="text-[#77786F]">+880 1700-000000</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#68734B] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-[#292B26]">
                      {locale === "bn" ? "কাস্টমার কেয়ার সময়:" : "Support Hours:"}
                    </span>
                    <p className="text-[#77786F]">
                      {locale === "bn"
                        ? "প্রতিদিন সকাল ৯টা থেকে রাত ১০টা পর্যন্ত"
                        : "Every day: 9:00 AM – 10:00 PM"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#D7C5A5]/40 shadow-xs space-y-6">
            <div>
              <h3 className="font-serif-heading font-bold text-xl text-[#292B26]">
                {locale === "bn" ? "আমাদের একটি বার্তা পাঠান" : "Send us a Message"}
              </h3>
              <p className="text-xs text-[#77786F] mt-1">
                {locale === "bn"
                  ? "আপনার নাম, ফোন নম্বর ও বিস্তারিত লিখে সাবমিট করুন। আমরা দ্রুত উত্তর দেব।"
                  : "Fill in the details below and our team will get back to you promptly."}
              </p>
            </div>

            <ContactForm locale={locale} />
          </div>
        </div>
      </div>
    </div>
  );
}
