import type { Metadata, Viewport } from "next";
import { Playfair_Display, Manrope, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bengali",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#465137",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://explodebd.com"),
  title: {
    default: "EXPLODE BD — Increase your beauty with modesty",
    template: "%s | EXPLODE BD",
  },
  description:
    "Explore premium modest fashion, ready-to-wear hijabs, salat suits, khimars, and accessories in Bangladesh. Increase your beauty with modesty.",
  keywords: [
    "EXPLODE BD",
    "Hijab Bangladesh",
    "Ready to wear hijab",
    "Ribbed jersey hijab",
    "Mosscrepe hijab",
    "Salat suit Dhaka",
    "Telekung Bangladesh",
    "Khimar set Bangladesh",
    "Modest fashion BD",
  ],
  authors: [{ name: "EXPLODE BD", url: "https://explodebd.com" }],
  creator: "EXPLODE BD",
  publisher: "EXPLODE BD",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_BD",
    alternateLocale: ["bn_BD"],
    url: "https://explodebd.com",
    siteName: "EXPLODE BD",
    title: "EXPLODE BD — Increase your beauty with modesty",
    description:
      "Premium modest fashion, ready-to-wear hijabs, prayer telekungs and accessories in Bangladesh.",
    images: [
      {
        url: "/images/explode-logo.png",
        width: 800,
        height: 800,
        alt: "EXPLODE BD Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EXPLODE BD — Increase your beauty with modesty",
    description: "Premium modest fashion and hijab e-commerce in Bangladesh.",
    images: ["/images/explode-logo.png"],
  },
  icons: {
    icon: "/images/explode-logo.png",
    apple: "/images/explode-logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${manrope.variable} ${hindSiliguri.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#292B26] antialiased w-full max-w-full">
        {children}
      </body>
    </html>
  );
}
