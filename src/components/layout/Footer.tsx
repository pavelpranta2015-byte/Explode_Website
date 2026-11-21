import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/types";
import { getTranslations } from "@/lib/i18n";
import { Phone, Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { FacebookIcon } from "@/components/common/Icons";

interface FooterProps {
  locale: Locale;
}

export const Footer: React.FC<FooterProps> = ({ locale }) => {
  const t = getTranslations(locale);

  return (
    <footer className="bg-[#292B26] text-[#FAF7F2] border-t border-[#465137]/30 pt-16 pb-8 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#465137]/40">
          {/* Brand Info & Official Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
              <div className="relative w-14 h-14 shrink-0 rounded-full overflow-hidden bg-black border border-[#68734B]/40 shadow-xs">
                <Image
                  src="/images/explode-logo.png"
                  alt="EXPLODE BD"
                  fill
                  sizes="56px"
                  className="object-contain p-0.5"
                />
              </div>
              <div>
                <span className="font-serif-heading font-bold text-xl tracking-tight text-[#FAF7F2]">
                  EXPLODE BD
                </span>
                <p className="text-xs text-[#D7C5A5] font-medium tracking-wide">
                  {t.footer.tagline}
                </p>
              </div>
            </div>

            <p className="text-sm text-[#FAF7F2]/80 leading-relaxed max-w-sm">
              {t.footer.aboutText}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.facebook.com/explodebd"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Official Facebook Page"
                className="w-9 h-9 rounded-full bg-[#465137] hover:bg-[#68734B] text-[#FAF7F2] flex items-center justify-center transition-colors"
              >
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/8801999101157"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Contact"
                className="w-9 h-9 rounded-full bg-[#465137] hover:bg-[#68734B] text-[#FAF7F2] flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif-heading text-base font-semibold text-[#D7C5A5]">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-sm text-[#FAF7F2]/80">
              <li>
                <Link
                  href={`/${locale}/shop`}
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  {t.nav.shop}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/category/ready-to-wear-hijabs`}
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  {t.nav.readyToWear}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/category/salat-suits`}
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  {t.nav.salatSuits}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/category/khimar-sets`}
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  {t.nav.khimarSets}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/category/abayas`}
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  {t.nav.abayas}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/offers`}
                  className="hover:text-[#D7C5A5] transition-colors text-[#D7C5A5]"
                >
                  {t.nav.offers}
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="space-y-4">
            <h4 className="font-serif-heading text-base font-semibold text-[#D7C5A5]">
              {t.footer.customerService}
            </h4>
            <ul className="space-y-2 text-sm text-[#FAF7F2]/80">
              <li>
                <Link
                  href={`/${locale}/track-order`}
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  {t.nav.trackOrder}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/size-guide`}
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  {t.footer.policies.sizeGuide}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/shipping-policy`}
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  {t.footer.policies.shipping}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/return-exchange-policy`}
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  {t.footer.policies.returns}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/faq`}
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  {t.footer.policies.faq}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/privacy-policy`}
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  {t.footer.policies.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  {t.footer.policies.terms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif-heading text-base font-semibold text-[#D7C5A5]">
              {t.footer.contactInfo}
            </h4>
            <ul className="space-y-3 text-sm text-[#FAF7F2]/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D7C5A5] shrink-0 mt-0.5" />
                <span>{t.footer.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D7C5A5] shrink-0" />
                <a
                  href="tel:+8801999101157"
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  +880 1999-101157
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D7C5A5] shrink-0" />
                <a
                  href="mailto:support@explodebd.com"
                  className="hover:text-[#D7C5A5] transition-colors"
                >
                  support@explodebd.com
                </a>
              </li>
              <li className="flex items-center gap-2 pt-2 text-xs text-[#FAF7F2]/70">
                <ShieldCheck className="w-4 h-4 text-[#68734B]" />
                <span>Verified Bangladesh F-Commerce Brand</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Payments & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F2]/60">
          <p>© 2026 {t.footer.allRights}</p>
          <div className="flex items-center gap-3">
            <span className="text-[#D7C5A5] font-medium">Payment Options:</span>
            <span className="bg-[#465137]/60 px-2 py-0.5 rounded text-[11px] text-[#FAF7F2]">
              Cash on Delivery
            </span>
            <span className="bg-[#465137]/60 px-2 py-0.5 rounded text-[11px] text-[#FAF7F2]">
              bKash
            </span>
            <span className="bg-[#465137]/60 px-2 py-0.5 rounded text-[11px] text-[#FAF7F2]">
              Nagad
            </span>
            <span className="bg-[#465137]/60 px-2 py-0.5 rounded text-[11px] text-[#FAF7F2]">
              Rocket
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
